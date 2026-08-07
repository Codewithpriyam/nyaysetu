/**
 * NyayaSetu — AnimatedTitle
 * Preserved from reference repo with NyayaSetu color/font adaptation.
 * GSAP word-cascade animation — each word tumbles in on scroll.
 *
 * Usage:
 *   <AnimatedTitle
 *     title="Know your <b>Rights</b>.<br />Understand your <b>Options</b>."
 *     containerClass="text-center"
 *   />
 */
import { useEffect, useRef } from 'react';
import { gsap }              from '@/animations/gsap-config';
import { ScrollTrigger }     from '@/animations/gsap-config';
import { useReducedMotion }  from '@/animations/useReducedMotion';
import clsx from 'clsx';

const AnimatedTitle = ({ title, containerClass, light = false }) => {
  const containerRef  = useRef(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      // Immediately make all words visible without animation
      if (containerRef.current) {
        containerRef.current.querySelectorAll('.animated-word').forEach((el) => {
          el.style.opacity   = '1';
          el.style.transform = 'none';
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger:       containerRef.current,
          start:         '100 bottom',
          end:           'center bottom',
          toggleActions: 'play none none reverse',
        },
      });

      titleAnimation.to('.animated-word', {
        opacity:   1,
        transform: 'translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)',
        ease:      'power2.inOut',
        stagger:   0.02,
      }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'animated-title',
        light ? '!text-parchment-100' : '!text-parchment-100',
        containerClass
      )}
    >
      {title.split('<br />').map((line, index) => (
        <div
          key={index}
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {line.split(' ').map((word, idx) => (
            <span
              key={idx}
              className="animated-word"
              // dangerouslySetInnerHTML is safe here — HTML is hardcoded, never user input
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
