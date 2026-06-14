import { animate, inView, stagger } from 'motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.5;

/**
 * Clears the temporary inline animation styles and marks the element as
 * revealed. Removing the inline transform is what lets CSS :hover transforms
 * (e.g. card lift) work afterwards — an inline transform would otherwise win
 * over any hover rule.
 */
function settle(el: HTMLElement) {
  el.dataset.revealed = 'true';
  el.style.removeProperty('opacity');
  el.style.removeProperty('transform');
  el.style.removeProperty('will-change');
}

/**
 * Initializes scroll-reveal animations on elements with `data-reveal` and
 * staggered reveals on the direct children of `data-reveal-stagger` containers.
 *
 * - Fires once per element (stops observing after the first reveal).
 * - Honors prefers-reduced-motion (content shown immediately, no motion).
 * - Idempotent and safe to call on every astro:page-load.
 */
export function initReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion: never hide or animate — just mark everything revealed.
  if (reducedMotion) {
    document
      .querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger] > *')
      .forEach((el) => {
        el.dataset.revealed = 'true';
      });
    return;
  }

  // Tells CSS that motion is allowed, so un-revealed elements start hidden.
  document.documentElement.classList.add('motion-ok');

  // 1. Staggered containers — animate their direct children in sequence.
  document.querySelectorAll<HTMLElement>('[data-reveal-stagger]').forEach((container) => {
    if (container.dataset.revealObserved === 'true') return;
    container.dataset.revealObserved = 'true';

    const children = Array.from(container.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.dataset.revealed !== 'true'
    );
    // Mark so the single-element pass below never double-handles them.
    children.forEach((child) => {
      child.dataset.revealHandled = 'true';
    });
    if (children.length === 0) return;

    const staggerDelay = window.innerWidth < 640 ? 0.05 : 0.08; // shorter on mobile

    const stop = inView(
      container,
      () => {
        const controls = animate(
          children,
          { opacity: [0, 1], y: [24, 0] },
          { delay: stagger(staggerDelay), duration: DURATION, ease: EASE_OUT_EXPO }
        );
        controls.finished.then(() => children.forEach(settle)).catch(() => {});
        stop();
      },
      { amount: 0.15 }
    );
  });

  // 2. Single reveal elements.
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (
      el.dataset.revealHandled === 'true' ||
      el.dataset.revealObserved === 'true' ||
      el.dataset.revealed === 'true'
    ) {
      return;
    }
    el.dataset.revealObserved = 'true';

    const stop = inView(
      el,
      () => {
        const controls = animate(
          el,
          { opacity: [0, 1], y: [24, 0] },
          { duration: DURATION, ease: EASE_OUT_EXPO }
        );
        controls.finished.then(() => settle(el)).catch(() => {});
        stop();
      },
      { amount: 0.15 }
    );
  });
}
