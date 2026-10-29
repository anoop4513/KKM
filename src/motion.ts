import { useEffect } from 'react';

const clamp = (value: number, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

function factor(value: string | undefined, fallback: number, limit: number) {
  const parsed = value?.trim() ? Number(value) : fallback;
  return Number.isFinite(parsed) ? clamp(parsed, -limit, limit) : fallback;
}

/**
 * Optional motion is added after mount; the uninitialised document stays readable.
 * Translate/rotate targets use a static ancestor so their own transforms cannot
 * feed back into the measurement that drives the next frame.
 */
export function useMotion(enabled: boolean, routeKey: string) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
    const rotations = [...document.querySelectorAll<HTMLElement>('[data-rotate]')];
    const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const wordGroups = [...document.querySelectorAll<HTMLElement>('[data-word-reveal]')].map(element => ({
      element,
      words: [...element.querySelectorAll<HTMLElement>('span.word')],
    }));
    const anchorFor = (element: HTMLElement) => (
      element.parentElement?.closest<HTMLElement>('[data-motion-anchor]') ?? element.parentElement ?? element
    );
    const layers = parallax.map(element => ({
      element, anchor: anchorFor(element), amount: factor(element.dataset.parallax, 70, 320),
    }));
    const turns = rotations.map(element => ({
      element, anchor: anchorFor(element), amount: factor(element.dataset.rotate, 160, 1080),
    }));

    const reset = () => {
      parallax.forEach(element => {
        element.style.setProperty('--parallax-y', '0px');
        element.style.removeProperty('--motion-progress');
      });
      rotations.forEach(element => {
        element.style.setProperty('--scroll-rotation', '0deg');
        element.style.removeProperty('--motion-progress');
      });
      reveals.forEach(element => element.classList.remove('reveal-ready', 'revealed'));
      wordGroups.forEach(({ element, words }) => {
        element.classList.remove('word-reveal-ready');
        words.forEach(word => {
          word.style.setProperty('--word-opacity', '1');
          word.style.setProperty('--word-y', '0px');
        });
      });
    };

    const start = () => {
      reset();
      if (!enabled || reduced.matches) return reset;

      let frame = 0;
      let disposed = false;
      const sources = [...new Set([
        ...layers.map(layer => layer.anchor),
        ...turns.map(turn => turn.anchor),
        ...wordGroups.map(group => group.element),
      ])];
      const render = () => {
        frame = 0;
        if (disposed) return;
        const viewport = Math.max(1, window.innerHeight);
        // Batch layout reads before applying any visual changes.
        const boxes = new Map(sources.map(element => [element, element.getBoundingClientRect()]));
        const progress = (element: HTMLElement) => {
          const box = boxes.get(element)!;
          return clamp((viewport - box.top) / (viewport + Math.max(1, box.height)));
        };

        layers.forEach(({ element, anchor, amount }) => {
          const position = progress(anchor);
          element.style.setProperty('--motion-progress', position.toFixed(4));
          element.style.setProperty('--parallax-y', `${((position - 0.5) * amount).toFixed(2)}px`);
        });
        turns.forEach(({ element, anchor, amount }) => {
          const position = progress(anchor);
          element.style.setProperty('--motion-progress', position.toFixed(4));
          // Angle depends only on position: stopping/reversing scroll stops/reverses it.
          element.style.setProperty('--scroll-rotation', `${(position * amount).toFixed(3)}deg`);
        });
        wordGroups.forEach(({ element, words }) => {
          const box = boxes.get(element)!;
          const position = clamp((viewport * 0.88 - box.top) / (viewport * 0.56 + box.height * 0.35));
          words.forEach((word, index) => {
            const visibility = clamp((position * (words.length + 4) - index) / 4);
            word.style.setProperty('--word-opacity', visibility.toFixed(3));
            word.style.setProperty('--word-y', `${((1 - visibility) * 12).toFixed(2)}px`);
          });
          if (words.length) element.classList.add('word-reveal-ready');
        });
      };
      const schedule = () => {
        if (!frame && !disposed) frame = window.requestAnimationFrame(render);
      };

      let observer: IntersectionObserver | undefined;
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer?.unobserve(entry.target);
          }
        }), { rootMargin: '0px 0px -7% 0px', threshold: 0.04 });
        // Anything already reached stays visible, including restored scroll positions.
        const positions = reveals.map(element => ({ element, top: element.getBoundingClientRect().top }));
        positions.forEach(({ element, top }) => {
          element.classList.add('reveal-ready');
          if (top < window.innerHeight * 0.93) element.classList.add('revealed');
          else observer?.observe(element);
        });
      }

      const resize = 'ResizeObserver' in window ? new ResizeObserver(schedule) : undefined;
      resize?.observe(document.documentElement);
      sources.forEach(element => resize?.observe(element));
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      window.addEventListener('pageshow', schedule);
      render();

      return () => {
        disposed = true;
        window.cancelAnimationFrame(frame);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        window.removeEventListener('pageshow', schedule);
        observer?.disconnect();
        resize?.disconnect();
        reset();
      };
    };

    let stop = start();
    const preferenceChanged = () => { stop(); stop = start(); };
    reduced.addEventListener('change', preferenceChanged);
    return () => {
      stop();
      reduced.removeEventListener('change', preferenceChanged);
    };
  }, [enabled, routeKey]);
}
