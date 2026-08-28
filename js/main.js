(function () {
  // Smooth scroll on all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerOffset = 88;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  // Header state on scroll
  var header = document.getElementById('header');
  function updateHeader() {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Theme toggle logic
  var themeToggle = document.getElementById('themeToggle');
  var themeToggleMobile = document.getElementById('themeToggleMobile');

  // Deux versions du CV : la version sombre suit le thème sombre du site.
  // Le href écrit dans le HTML reste la version claire, pour le cas sans JS.
  var CV_LIGHT = 'assets/documents/Dach-Kilian-CV.pdf';
  var CV_DARK = 'assets/documents/Dach-Kilian-CV-dark.pdf';

  function updateCvLinks(theme) {
    var href = theme === 'dark' ? CV_DARK : CV_LIGHT;
    document.querySelectorAll('[data-cv-link]').forEach(function (link) {
      link.setAttribute('href', href);
    });
  }

  function getTheme() {
    var storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
    updateCvLinks(theme);
  }

  updateCvLinks(getTheme());

  function toggleTheme() {
    var currentTheme = getTheme();
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }

  // Écouter les changements de thème système en direct
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      updateCvLinks(e.matches ? 'dark' : 'light');
    }
  });

  // Dynamic copyright year
  var copyrightEl = document.getElementById('copyrightYear');
  if (copyrightEl) {
    copyrightEl.textContent = new Date().getFullYear();
  }

  // Back to top button
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    function updateBackToTop() {
      if (window.scrollY > 600) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
