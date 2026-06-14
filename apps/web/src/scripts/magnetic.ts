/**
 * Magnetic buttons: elements with [data-magnetic] gently follow the cursor.
 *
 * Uses the standalone `translate` CSS property (not `transform`) so it composes
 * with the button's existing :hover transform lift instead of overriding it.
 * Desktop-only (pointer: fine) and disabled under prefers-reduced-motion.
 */
const STRENGTH = 0.5; // fraction of cursor offset the button follows
const MAX = 16; // px cap so it never drifts far

export function initMagnetic() {
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reducedMotion) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    if (el.dataset.magneticBound === 'true') return;
    el.dataset.magneticBound = 'true';

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const x = Math.max(-MAX, Math.min(MAX, dx * STRENGTH));
      const y = Math.max(-MAX, Math.min(MAX, dy * STRENGTH));
      el.style.translate = `${x}px ${y}px`;
    };

    const reset = () => {
      el.style.translate = '0px 0px';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
  });
}
