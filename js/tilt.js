/* ==========================================================================
   3D CARD TILT & MOUSE SPOTLIGHT EFFECT
   Smooth 3D perspective rotation on hover
   ========================================================================== */

(function () {
  function initTilt(selector, maxAngle = 10, scale = 1.02) {
    const cards = document.querySelectorAll(selector);

    cards.forEach((card) => {
      let bounds;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.1s ease-out';
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = (mouseX / bounds.width - 0.5) * 2;
        const yPct = (mouseY / bounds.height - 0.5) * 2;

        const rotateX = -yPct * maxAngle;
        const rotateY = xPct * maxAngle;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
      }

      function onMouseLeave() {
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    initTilt('.portrait-frame-container', 12, 1.03);
    initTilt('.project-card', 6, 1.015);
    initTilt('.skill-card', 5, 1.02);
  });
})();
