import { useEffect, useRef } from 'react';
import './StudioEyes.css';

/** A precise, decorative studio-camera character, rather than a brand mark. */
export default function StudioEyes({ motion }: { motion: boolean }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const reset = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      element.style.setProperty('--studio-head-x', '0px');
      element.style.setProperty('--studio-head-y', '0px');
      element.style.setProperty('--studio-head-turn', '0deg');
      element.style.setProperty('--studio-pupil-x', '0px');
      element.style.setProperty('--studio-pupil-y', '0px');
    };
    const render = () => {
      frame = 0;
      element.style.setProperty('--studio-head-x', `${(pointerX * 4).toFixed(2)}px`);
      element.style.setProperty('--studio-head-y', `${(pointerY * 3).toFixed(2)}px`);
      element.style.setProperty('--studio-head-turn', `${(pointerX * 1.5).toFixed(2)}deg`);
      element.style.setProperty('--studio-pupil-x', `${(pointerX * 11).toFixed(2)}px`);
      element.style.setProperty('--studio-pupil-y', `${(pointerY * 8).toFixed(2)}px`);
    };
    const move = (event: PointerEvent) => {
      if (!motion || reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      const box = element.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, ((event.clientX - box.left) / Math.max(1, box.width) - 0.5) * 2));
      pointerY = Math.max(-1, Math.min(1, ((event.clientY - box.top) / Math.max(1, box.height) - 0.5) * 2));
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    finePointer.addEventListener('change', reset);
    reduced.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    reset();

    return () => {
      reset();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
      element.removeEventListener('pointercancel', reset);
      finePointer.removeEventListener('change', reset);
      reduced.removeEventListener('change', reset);
      window.removeEventListener('blur', reset);
    };
  }, [motion]);

  return <div ref={stage} className="studio-eyes" aria-hidden="true">
    <svg className="studio-eyes__drawing" viewBox="0 0 300 224" fill="none" focusable="false">
      <path className="studio-eyes__stand" d="M139 189v19m22-19v19m-44 2h66" />
      <g className="studio-eyes__head">
        <path className="studio-eyes__handle" d="M113 51V37a10 10 0 0 1 10-10h54a10 10 0 0 1 10 10v14" />
        <rect className="studio-eyes__body" x="25" y="51" width="250" height="141" rx="35" />
        <path className="studio-eyes__seam" d="M50 172h200" />
        <rect className="studio-eyes__indicator" x="239" y="69" width="13" height="5" rx="2.5" />
        {[104, 196].map(cx => <g key={cx}>
          <circle className="studio-eyes__rim" cx={cx} cy="118" r="37" />
          <circle className="studio-eyes__lens" cx={cx} cy="118" r="29" />
          <g className="studio-eyes__pupil">
            <circle className="studio-eyes__iris" cx={cx} cy="118" r="15" />
            <circle className="studio-eyes__catchlight" cx={cx - 4.5} cy="113.5" r="3" />
          </g>
        </g>)}
      </g>
    </svg>
  </div>;
}
