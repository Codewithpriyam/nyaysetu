/**
 * NyayaSetu — BentoTilt Component
 * Reference repo signature 3D mouse tilt interaction.
 * Applies perspective 3D rotation & scale on mouse hover.
 */

import { useState, useRef } from 'react';

export const BentoTilt = ({ children, className = '', tiltAmount = 8 }) => {
  const [transformStyle, setTransformStyle] = useState('');
  const itemRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    const { left, top, width, height } = itemRef.current.getBoundingClientRect();

    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * tiltAmount;
    const tiltY = (relativeX - 0.5) * -tiltAmount;

    const newTransform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.99, 0.99, 0.99)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

export default BentoTilt;
