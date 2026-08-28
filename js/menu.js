(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  function setState(isOpen) {
    hamburger.classList.toggle('is-active', isOpen);
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu(returnFocus) {
    if (!mobileMenu.classList.contains('is-open')) return;
    setState(false);
    if (returnFocus) hamburger.focus();
  }

  hamburger.addEventListener('click', function () {
    var willOpen = !mobileMenu.classList.contains('is-open');
    setState(willOpen);
    if (willOpen) {
      var firstLink = mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu(false);
    });
  });

  // Clicking the backdrop (outside the nav) closes the menu
  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) closeMenu(true);
  });

  // Escape closes the menu and hands focus back to the toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu(true);
  });

  // Keep focus inside the overlay while it is open
  mobileMenu.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !mobileMenu.classList.contains('is-open')) return;
    var focusables = mobileMenu.querySelectorAll('a, button');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeMenu(false);
  });
})();
