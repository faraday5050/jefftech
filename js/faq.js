/* ============================================================
   JEFF TECH — faq.js
   Smooth accordion behaviour for <details> FAQ items
   (only one open at a time)
   ============================================================ */

(function () {
  'use strict';

  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Close all others
        faqItems.forEach((other) => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
})();