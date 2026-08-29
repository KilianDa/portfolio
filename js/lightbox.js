(function () {
  var triggers = document.querySelectorAll('.proof-shot img');
  if (!triggers.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML =
    '<button class="lightbox__close" aria-label="Fermer l\'image agrandie" type="button">' +
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
    '</button>' +
    '<img class="lightbox__img" alt="">';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('.lightbox__img');
  var closeBtn = overlay.querySelector('.lightbox__close');
  var lastFocused = null;

  function open(src, alt) {
    lastFocused = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      open(trigger.currentSrc || trigger.src, trigger.alt);
    });
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === img) close();
  });

  closeBtn.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });
})();
