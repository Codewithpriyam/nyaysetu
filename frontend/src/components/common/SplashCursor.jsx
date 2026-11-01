'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/animations/useReducedMotion';

const QUALITY = {
  low: { sim: 64, dye: 512, iterations: 10 },
  medium: { sim: 96, dye: 1024, iterations: 16 },
  high: { sim: 128, dye: 1440, iterations: 20 }
};

const BLOOM_RESOLUTION = 256;
const BLOOM_ITERATIONS = 4;

const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 outColor;
`;

const SHADERS = {
  copy: `uniform sampler2D uTexture;
void main() {
  outColor = texture(uTexture, vUv);
}`,
  clear: `uniform sampler2D uTexture;
uniform float value;
void main() {
  outColor = value * texture(uTexture, vUv);
}`,
  splat: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 pointA;
uniform vec2 pointB;
uniform float radius;
void main() {
  vec2 scale = vec2(aspectRatio, 1.0);
  vec2 pa = (vUv - pointA) * scale;
  vec2 ba = (pointB - pointA) * scale;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-9), 0.0, 1.0);
  vec2 d = pa - ba * h;
  vec3 base = texture(uTarget, vUv).xyz;
  outColor = vec4(base + exp(-dot(d, d) / radius) * color, 1.0);
}`,
  burst: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform float strength;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  float distance = length(d);
  vec2 direction = d / max(distance, 0.00001);
  float angle = atan(d.y, d.x);
  float petals = 0.78 + 0.22 * sin(angle * 5.0 + seed) * sin(angle * 3.0 - seed * 1.7);
  vec2 twist = vec2(-direction.y, direction.x) * 0.3 * sin(angle * 4.0 + seed * 2.3);
  float falloff = exp(-dot(d, d) / radius) * distance / sqrt(radius);
  outColor = vec4(texture(uTarget, vUv).xy + (direction * petals + twist) * falloff * strength, 0.0, 1.0);
}`,
  crown: `uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform float radius;
uniform vec3 colorA;
uniform vec3 colorB;
uniform float seed;
void main() {
  vec2 d = (vUv - point) * vec2(aspectRatio, 1.0);
  vec3 ink = exp(-dot(d, d) / (radius * 0.45)) * colorA;
  for (int i = 0; i < 7; i++) {
    float index = float(i);
    float angle = index * (6.2831853 / 7.0) + seed;
    float offset = 0.85 + 0.15 * sin(index * 2.1 + seed * 1.7);
    vec2 tip = vec2(cos(angle), sin(angle)) * radius * offset;
    vec2 delta = d - tip;
    ink += exp(-dot(delta, delta) / (radius * 0.18)) * colorB * 0.45;
  }
  outColor = vec4(texture(uTarget, vUv).xyz + ink, 1.0);
}`,
  advection: `uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: `uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  outColor = vec4(texture(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
}`,
  pressure: `uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  outColor = vec4(0.25 * (L + R + T + B - div), 0.0, 0.0, 1.0);
}`,
  gradient: `uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  outColor = vec4(texture(uVelocity, vUv).xy - vec2(R - L, T - B) * 0.5, 0.0, 1.0);
}`,
  bloomPrefilter: `uniform sampler2D uTexture;
uniform float threshold;
uniform float knee;
void main() {
  vec3 color = texture(uTexture, vUv).rgb;
  float brightness = max(color.r, max(color.g, color.b));
  float soft = clamp(brightness - threshold + knee, 0.0, 2.0 * knee);
  soft = (soft * soft) / (4.0 * knee + 0.00001);
  float factor = max(soft, brightness - threshold) / max(brightness, 0.00001);
  outColor = vec4(color * factor, 1.0);
}`,
  bloomBlur: `uniform sampler2D uTexture;
uniform vec2 texelSize;
void main() {
  vec4 sum = vec4(0.0);
  vec2 offset = texelSize * 1.333333;
  sum += texture(uTexture, vUv + vec2(-offset.x, -offset.y)) * 0.0625;
  sum += texture(uTexture, vUv + vec2(0.0, -offset.y)) * 0.125;
  sum += texture(uTexture, vUv + vec2(offset.x, -offset.y)) * 0.0625;
  sum += texture(uTexture, vUv + vec2(-offset.x, 0.0)) * 0.125;
  sum += texture(uTexture, vUv) * 0.25;
  sum += texture(uTexture, vUv + vec2(offset.x, 0.0)) * 0.125;
  sum += texture(uTexture, vUv + vec2(-offset.x, offset.y)) * 0.0625;
  sum += texture(uTexture, vUv + vec2(0.0, offset.y)) * 0.125;
  sum += texture(uTexture, vUv + vec2(offset.x, offset.y)) * 0.0625;
  outColor = sum;
}`,
  bloomComposite: `uniform sampler2D uTexture;
uniform sampler2D uBloom;
uniform float intensity;
void main() {
  outColor = texture(uTexture, vUv) + texture(uBloom, vUv) * intensity;
}`,
  display: `uniform sampler2D uTexture;
uniform sampler2D uBloom;
uniform float bloom;
uniform float shading;
uniform vec2 texelSize;
uniform float light;
float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
void main() {
  vec3 c = texture(uTexture, vUv).rgb;
  if (shading > 0.0) {
    float dx = length(texture(uTexture, vR).rgb) - length(texture(uTexture, vL).rgb);
    float dy = length(texture(uTexture, vT).rgb) - length(texture(uTexture, vB).rgb);
    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
    c *= mix(1.0, clamp(n.z + 0.7, 0.7, 1.0), shading);
  }
  if (bloom > 0.0) {
    c += max(texture(uBloom, vUv).rgb, 0.0) * bloom;
  }
  c = max(c, 0.0);
  float peak = max(c.r, max(c.g, c.b));
  float grain = (hash(gl_FragCoord.xy) - 0.5) / 255.0 * smoothstep(0.0, 0.03, peak);
  if (light > 0.5) {
    vec3 transmit = exp(-2.4 * c);
    float low = min(transmit.r, min(transmit.g, transmit.b));
    float alpha = clamp(1.0 - low + grain, 0.0, 1.0);
    outColor = vec4(min(transmit - low, vec3(alpha)), alpha);
  } else {
    c = max(c + grain, 0.0);
    float alpha = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
    outColor = vec4(min(c, vec3(alpha)), alpha);
  }
}`
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseColor = value => {
  let hex = String(value).replace('#', '').trim();
  if (hex.length === 3) hex = [...hex].map(char => char + char).join('');
  const number = parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(number)) return [0.996, 0.498, 0.176]; // #FE7F2D fallback
  return [((number >> 16) & 255) / 255, ((number >> 8) & 255) / 255, (number & 255) / 255];
};

const NYAYASETU_ORANGE_PALETTE = ['#FE7F2D', '#FF9A50', '#E96718', '#C94D0B'];

function SplashCursor({
  colors = NYAYASETU_ORANGE_PALETTE,
  rainbow = false,
  colorSpeed = 1,
  intensity = 0.55,
  size = 0.75,
  force = 0.60,
  swirl = 2,
  trail = 0.65,
  momentum = 0.85,
  shading = 0.5,
  glow = 0,
  quality = 'high',
  clickSplash = true,
  contained = false,
  theme = 'dark',
  zIndex = 30,
  className = '',
  style
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  
  const prefersReduced = useReducedMotion();
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmall = window.innerWidth < 768;
    setIsMobileDevice(isTouch && isSmall);
  }, []);

  const settings = {
    palette: (Array.isArray(colors) && colors.length ? colors : NYAYASETU_ORANGE_PALETTE).map(parseColor),
    rainbow: Boolean(rainbow),
    colorSpeed: Math.max(0, colorSpeed),
    intensity: Math.max(0, intensity),
    size: Math.max(0.05, size),
    force: Math.max(0, force),
    swirl: Math.max(0, swirl),
    trail: Math.max(0.05, trail),
    momentum: Math.max(0.05, momentum),
    shading: clamp(shading, 0, 1),
    glow: clamp(glow, 0, 1),
    quality: QUALITY[quality] ? quality : 'high',
    clickSplash: Boolean(clickSplash),
    contained: Boolean(contained),
    light: theme === 'light'
  };

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    if (prefersReduced || isMobileDevice) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false
    });
    if (!gl) return undefined;
    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('EXT_color_buffer_half_float');

    const renderable = (internal, format) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, 4, 4, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(texture);
      return complete;
    };
    const rgba = { internal: gl.RGBA16F, format: gl.RGBA };
    if (!renderable(rgba.internal, rgba.format)) return undefined;
    const rg = renderable(gl.RG16F, gl.RG) ? { internal: gl.RG16F, format: gl.RG } : rgba;
    const r = renderable(gl.R16F, gl.RED) ? { internal: gl.R16F, format: gl.RED } : rg;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX);
    const programs = {};
    let broken = false;
    Object.entries(SHADERS).forEach(([name, body]) => {
      const fragment = compile(gl.FRAGMENT_SHADER, HEADER + body);
      const program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) broken = true;
      const uniforms = {};
      const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      programs[name] = { program, uniforms };
    });
    gl.deleteShader(vertex);

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const targets = new Set();
    let disposed = false;
    let lost = false;

    const release = () => {
      if (gl.isContextLost()) return;
      targets.forEach(target => {
        gl.deleteFramebuffer(target.fbo);
        gl.deleteTexture(target.texture);
      });
      targets.clear();
      Object.values(programs).forEach(item => gl.deleteProgram(item.program));
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
    };

    if (broken) {
      release();
      return undefined;
    }

    const bindProgram = name => {
      const item = programs[name];
      gl.useProgram(item.program);
      return item.uniforms;
    };

    const blit = target => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const createTarget = (width, height, format, filter) => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, format.internal, width, height, 0, format.format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const target = {
        texture,
        fbo,
        width,
        height,
        texelX: 1 / width,
        texelY: 1 / height,
        attach: unit => {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        }
      };
      targets.add(target);
      return target;
    };

    const destroyTarget = target => {
      if (!target) return;
      gl.deleteFramebuffer(target.fbo);
      gl.deleteTexture(target.texture);
      targets.delete(target);
    };

    const reshape = (target, width, height, format) => {
      gl.bindTexture(gl.TEXTURE_2D, target.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, format.internal, width, height, 0, format.format, gl.HALF_FLOAT, null);
      target.width = width;
      target.height = height;
      target.texelX = 1 / width;
      target.texelY = 1 / height;
    };

    const createDouble = (width, height, format, filter) => {
      const pair = {
        read: createTarget(width, height, format, filter),
        write: createTarget(width, height, format, filter),
        width,
        height,
        texelX: 1 / width,
        texelY: 1 / height,
        swap: () => {
          const current = pair.read;
          pair.read = pair.write;
          pair.write = current;
        }
      };
      return pair;
    };

    const resizeDouble = (pair, width, height, format, filter, keep) => {
      if (keep) {
        const next = createTarget(width, height, format, filter);
        const u = bindProgram('copy');
        gl.uniform1i(u.uTexture, pair.read.attach(0));
        blit(next);
        destroyTarget(pair.read);
        pair.read = next;
      } else {
        reshape(pair.read, width, height, format);
      }
      reshape(pair.write, width, height, format);
      pair.width = width;
      pair.height = height;
      pair.texelX = 1 / width;
      pair.texelY = 1 / height;
    };

    const resolution = base => {
      const width = gl.drawingBufferWidth;
      const height = gl.drawingBufferHeight;
      const aspect = Math.max(width, height) / Math.max(1, Math.min(width, height));
      const short = Math.round(base);
      const long = Math.round(base * aspect);
      return width > height ? { width: long, height: short } : { width: short, height: long };
    };

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
    };

    const sizes = () => {
      const q = QUALITY[settingsRef.current.quality];
      const shortSide = Math.min(gl.drawingBufferWidth, gl.drawingBufferHeight);
      return { sim: resolution(q.sim), ink: resolution(Math.max(q.sim, Math.min(q.dye, shortSide))) };
    };

    fit();
    const initial = sizes();
    const dye = createDouble(initial.ink.width, initial.ink.height, rgba, gl.LINEAR);
    const velocity = createDouble(initial.sim.width, initial.sim.height, rg, gl.LINEAR);
    const pressure = createDouble(initial.sim.width, initial.sim.height, r, gl.NEAREST);
    const divergence = createTarget(initial.sim.width, initial.sim.height, r, gl.NEAREST);
    const curl = createTarget(initial.sim.width, initial.sim.height, r, gl.NEAREST);
    let bloom = null;
    let bloomChain = [];

    const dropBloom = () => {
      destroyTarget(bloom);
      bloomChain.forEach(destroyTarget);
      bloom = null;
      bloomChain = [];
    };

    const _ensureBloom = () => {
      if (bloom) return bloom;
      const size = resolution(BLOOM_RESOLUTION);
      const created = createTarget(size.width, size.height, rgba, gl.LINEAR);
      for (let i = 0; i < BLOOM_ITERATIONS; i++) {
        const width = size.width >> (i + 1);
        const height = size.height >> (i + 1);
        if (width < 2 || height < 2) break;
        bloomChain.push(createTarget(width, height, rgba, gl.LINEAR));
      }
      bloom = created;
      return created;
    };

    const resize = () => {
      fit();
      const next = sizes();
      if (dye.width !== next.ink.width || dye.height !== next.ink.height) {
        resizeDouble(dye, next.ink.width, next.ink.height, rgba, gl.LINEAR, true);
      }
      if (velocity.width !== next.sim.width || velocity.height !== next.sim.height) {
        resizeDouble(velocity, next.sim.width, next.sim.height, rg, gl.LINEAR, true);
        resizeDouble(pressure, next.sim.width, next.sim.height, r, gl.NEAREST, false);
        reshape(divergence, next.sim.width, next.sim.height, r);
        reshape(curl, next.sim.width, next.sim.height, r);
      }
      const glowSize = resolution(BLOOM_RESOLUTION);
      if (bloom && (bloom.width !== glowSize.width || bloom.height !== glowSize.height)) dropBloom();
    };

    // Refined fluid radius: thinner trail (0.13 multiplier vs original 0.20)
    const radiusFor = scale => {
      const aspect = canvas.width / canvas.height;
      return ((0.13 * settingsRef.current.size * scale) / 100) * (aspect > 1 ? aspect : 1);
    };

    const splat = (ax, ay, bx, by, vx, vy, color, radius) => {
      const u = bindProgram('splat');
      gl.uniform1i(u.uTarget, velocity.read.attach(0));
      gl.uniform1f(u.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(u.pointA, ax, ay);
      gl.uniform2f(u.pointB, bx, by);
      gl.uniform3f(u.color, vx, vy, 0);
      gl.uniform1f(u.radius, radius);
      blit(velocity.write);
      velocity.swap();
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      gl.uniform3f(u.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    };

    // Controlled smooth orange palette interpolation
    const colorAt = (offset, now) => {
      const s = settingsRef.current;
      const phase = (((offset + (now / 1000) * s.colorSpeed * 0.4) % 1) + 1) % 1;
      const palette = s.palette;
      if (palette.length === 1) return palette[0];
      const position = phase * palette.length;
      const from = palette[Math.floor(position) % palette.length];
      const to = palette[(Math.floor(position) + 1) % palette.length];
      const t = position - Math.floor(position);
      const blend = t * t * (3 - 2 * t);
      return [
        from[0] + (to[0] - from[0]) * blend,
        from[1] + (to[1] - from[1]) * blend,
        from[2] + (to[2] - from[2]) * blend
      ];
    };

    const inkFor = (color, amount) =>
      color.map(channel => (settingsRef.current.light ? 1 - channel : channel) * amount);

    // Reduced fluid deposition: amount multiplier 0.08 (prevent large blobs and heavy pooling)
    const flush = (pointer, dt, now) => {
      const s = settingsRef.current;
      const aspect = canvas.width / canvas.height;
      const length = Math.hypot((pointer.x - pointer.px) * aspect, pointer.y - pointer.py);
      if (length > 0.35) {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
        return;
      }
      let dx = pointer.x - pointer.px;
      let dy = pointer.y - pointer.py;
      if (aspect < 1) dx *= aspect;
      else dy /= aspect;
      const radius = radiusFor(0.85);
      const spread = 1 + length / (1.77 * Math.sqrt(radius));
      const push = (4500 * s.force) / Math.sqrt(spread);
      const amount = (0.08 * s.intensity * Math.min(dt * 60, 1)) / Math.sqrt(spread);
      const color = inkFor(colorAt(pointer.offset, now), amount);
      splat(pointer.px, pointer.py, pointer.x, pointer.y, dx * push, dy * push, color, radius);
      pointer.px = pointer.x;
      pointer.py = pointer.y;
    };

    // Refined click splash: controlled burst radius (1.8 scale vs 3) and gentle strength
    const burst = (x, y, now) => {
      const s = settingsRef.current;
      const seed = Math.random() * Math.PI * 2;
      const aspect = canvas.width / canvas.height;
      let u = bindProgram('burst');
      gl.uniform1i(u.uTarget, velocity.read.attach(0));
      gl.uniform1f(u.aspectRatio, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform1f(u.radius, radiusFor(1.8));
      gl.uniform1f(u.strength, 650 * s.force);
      gl.uniform1f(u.seed, seed);
      blit(velocity.write);
      velocity.swap();
      const offset = Math.random();
      const amount = 0.7 * s.intensity;
      const first = inkFor(colorAt(offset, now), amount);
      const second = inkFor(colorAt(offset + 0.25, now), amount);
      u = bindProgram('crown');
      gl.uniform1i(u.uTarget, dye.read.attach(0));
      gl.uniform1f(u.aspectRatio, aspect);
      gl.uniform2f(u.point, x, y);
      gl.uniform1f(u.radius, radiusFor(1.2));
      gl.uniform3f(u.colorA, first[0], first[1], first[2]);
      gl.uniform3f(u.colorB, second[0], second[1], second[2]);
      gl.uniform1f(u.seed, seed);
      blit(dye.write);
      dye.swap();
    };

    const step = dt => {
      const s = settingsRef.current;
      const iterations = QUALITY[s.quality].iterations;
      gl.disable(gl.BLEND);

      let u = bindProgram('curl');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(curl);

      u = bindProgram('vorticity');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uCurl, curl.attach(1));
      gl.uniform1f(u.curl, 15 * s.swirl);
      gl.uniform1f(u.dt, dt);
      blit(velocity.write);
      velocity.swap();

      u = bindProgram('divergence');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      u = bindProgram('clear');
      gl.uniform1i(u.uTexture, pressure.read.attach(0));
      gl.uniform1f(u.value, 0.8);
      blit(pressure.write);
      pressure.swap();

      u = bindProgram('pressure');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uDivergence, divergence.attach(1));
      for (let i = 0; i < iterations; i++) {
        gl.uniform1i(u.uPressure, pressure.read.attach(0));
        blit(pressure.write);
        pressure.swap();
      }

      u = bindProgram('gradient');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uPressure, pressure.read.attach(0));
      gl.uniform1i(u.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      // Velocity advection
      u = bindProgram('advection');
      gl.uniform2f(u.texelSize, velocity.texelX, velocity.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, velocity.read.attach(0));
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, 2.5 / s.momentum);
      blit(velocity.write);
      velocity.swap();

      // Dye advection: smooth, elegant dissipation without sludge accumulation
      gl.uniform2f(u.texelSize, dye.texelX, dye.texelY);
      gl.uniform1i(u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(u.uSource, dye.read.attach(1));
      gl.uniform1f(u.dissipation, 4.2 / s.trail);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      const s = settingsRef.current;
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      const u = bindProgram('display');
      gl.uniform1i(u.uTexture, dye.read.attach(0));
      gl.uniform2f(u.texelSize, 1 / canvas.width, 1 / canvas.height);
      gl.uniform1f(u.shading, s.shading);
      gl.uniform1f(u.bloom, s.glow);
      gl.uniform1f(u.light, s.light ? 1 : 0);
      blit(null);
    };

    const pointers = new Map();
    const bursts = [];
    let raf = 0;
    let last = performance.now();
    let idleFrames = 0;

    const frame = now => {
      if (disposed || lost) return;
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      resize();

      let active = false;
      pointers.forEach(pointer => {
        if (!pointer.moved) return;
        pointer.moved = false;
        flush(pointer, dt, now);
        active = true;
      });

      while (bursts.length) {
        const point = bursts.shift();
        burst(point.x, point.y, now);
        active = true;
      }

      step(dt);
      render();

      if (!active) {
        idleFrames++;
      } else {
        idleFrames = 0;
      }

      // Keep running smoothly as long as fluid or pointers are active
      if (idleFrames < 180 || pointers.size > 0) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const wake = () => {
      if (raf) return;
      last = performance.now();
      idleFrames = 0;
      raf = requestAnimationFrame(frame);
    };

    const locate = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1 - (clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return null;
      return { x, y };
    };

    const track = (id, clientX, clientY) => {
      const point = locate(clientX, clientY);
      if (!point) return;
      let pointer = pointers.get(id);
      if (!pointer) {
        pointer = {
          x: point.x,
          y: point.y,
          px: point.x,
          py: point.y,
          offset: Math.random(),
          ready: false,
          moved: false
        };
        pointers.set(id, pointer);
      }
      pointer.x = point.x;
      pointer.y = point.y;
      if (!pointer.ready) {
        pointer.px = point.x;
        pointer.py = point.y;
        pointer.ready = true;
      }
      pointer.moved = true;
      wake();
    };

    const press = (clientX, clientY) => {
      if (!settingsRef.current.clickSplash) return;
      const point = locate(clientX, clientY);
      if (!point) return;
      bursts.push(point);
      wake();
    };

    const onPointerMove = event => {
      if (event.pointerType !== 'touch') track(`p${event.pointerId}`, event.clientX, event.clientY);
    };
    const onPointerDown = event => {
      if (event.pointerType !== 'touch') press(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      release();
    };
  }, [prefersReduced, isMobileDevice]);

  if (prefersReduced || isMobileDevice) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={`splash-cursor pointer-events-none ${contained ? 'absolute inset-0' : 'fixed inset-0'} ${className}`.trim()}
      style={{ zIndex, ...style }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none" />
    </div>
  );
}

export default SplashCursor;
