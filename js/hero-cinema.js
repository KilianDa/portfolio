(function () {
  var hero = document.querySelector('.hero--cinema');
  if (!hero) return;

  var scrub = document.getElementById('heroScrub');
  var sticky = scrub ? scrub.querySelector('.hero-scrub__sticky') : null;
  var canvas = document.getElementById('heroCanvas');
  var video = document.getElementById('heroVideo');
  var inner = hero.querySelector('.hero__inner');
  var scrollCue = hero.querySelector('.hero__scroll');
  var progressFill = hero.querySelector('.hero__progress-fill');
  var header = document.getElementById('header');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 860px)').matches;

  /* ------------------------------------------------------------------
     Écran de chargement : les frames/la vidéo sont en HD, donc on
     masque le média derrière un repère le temps qu'il soit prêt.
     Un garde-fou révèle quand même le hero après quelques secondes,
     au cas où une connexion lente bloquerait le chargement complet.
     ------------------------------------------------------------------ */
  var ready = false;
  function markReady() {
    if (ready) return;
    ready = true;
    hero.classList.add('is-ready');
  }
  var readyFallback = window.setTimeout(markReady, 6000);
  function markReadyNow() {
    window.clearTimeout(readyFallback);
    markReady();
  }

  /* ------------------------------------------------------------------
     Header transparent tant qu'on est sur le hero (accueil uniquement)
     ------------------------------------------------------------------ */
  function updateHeaderState() {
    if (!header) return;
    var heroBottom = hero.getBoundingClientRect().bottom;
    header.classList.toggle('is-over-hero', heroBottom > 96);
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);

  /* ------------------------------------------------------------------
     Choix du mode : scrub canvas (desktop) ou vidéo en boucle (mobile,
     mouvement réduit, ou échec de chargement des frames)
     ------------------------------------------------------------------ */
  function enableVideoMode(paused) {
    hero.classList.add('is-video-mode');
    if (!video) {
      markReadyNow();
      return;
    }
    if (paused || reduceMotion) {
      // Image fixe : le poster (même image que la 1ère frame du scrub)
      // s'affiche seul, pas besoin d'attendre le chargement de la vidéo
      video.autoplay = false;
      video.pause();
      markReadyNow();
      return;
    }
    // 'loadeddata' = la première frame est décodée et affichable ;
    // pas besoin d'attendre le buffer complet pour révéler le hero
    if (video.readyState >= 2) {
      markReadyNow();
    } else {
      video.addEventListener('loadeddata', markReadyNow, { once: true });
      video.addEventListener('error', markReadyNow, { once: true });
    }
    video.autoplay = true;
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay refusé : poster affiché */ });
  }

  if (reduceMotion) {
    enableVideoMode(true);
    return;
  }

  if (isMobile || !canvas || !canvas.getContext) {
    enableVideoMode(false);
    return;
  }

  /* ------------------------------------------------------------------
     Mode scrub : séquence de frames dessinée sur canvas, pilotée
     par la position de scroll dans le rail .hero-scrub
     ------------------------------------------------------------------ */
  var FRAME_COUNT = window.HERO_FRAME_COUNT || 100;
  var FRAME_PATH = function (i) {
    return 'assets/hero-frames/frame-' + String(i + 1).padStart(3, '0') + '.jpg';
  };

  var ctx = canvas.getContext('2d');
  var frames = new Array(FRAME_COUNT);
  var loadedCount = 0;
  var firstFrameReady = false;
  var currentIndex = -1;
  var targetIndex = 0;
  var failed = false;

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    // Redessine immédiatement à la nouvelle taille
    if (currentIndex >= 0 && frames[currentIndex]) {
      drawFrame(currentIndex);
    }
  }

  function drawFrame(index) {
    var img = frames[index];
    if (!img || !img.complete || !img.naturalWidth) return;
    var cw = canvas.width;
    var ch = canvas.height;
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    // object-fit: cover
    var scale = Math.max(cw / iw, ch / ih);
    var dw = iw * scale;
    var dh = ih * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    currentIndex = index;
  }

  // La frame demandée, ou à défaut la plus proche déjà chargée
  function nearestLoaded(index) {
    if (frames[index] && frames[index].complete && frames[index].naturalWidth) return index;
    for (var d = 1; d < FRAME_COUNT; d++) {
      var lo = index - d;
      var hi = index + d;
      if (lo >= 0 && frames[lo] && frames[lo].complete && frames[lo].naturalWidth) return lo;
      if (hi < FRAME_COUNT && frames[hi] && frames[hi].complete && frames[hi].naturalWidth) return hi;
    }
    return -1;
  }

  function loadFrame(i, onDone) {
    var img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      loadedCount++;
      if (onDone) onDone(i);
    };
    img.onerror = function () {
      if (!failed) {
        failed = true;
        enableVideoMode(false);
      }
    };
    img.src = FRAME_PATH(i);
    frames[i] = img;
  }

  // Frame 1 en priorité pour peindre l'écran au plus vite,
  // puis le reste en tâche de fond
  loadFrame(0, function () {
    firstFrameReady = true;
    resizeCanvas();
    drawFrame(0);
    for (var i = 1; i < FRAME_COUNT; i++) loadFrame(i, function (idx) {
      // Si la frame qui vient d'arriver est celle attendue, on l'affiche
      if (idx === targetIndex && !failed) drawFrame(idx);
      // Toute la séquence est en cache : le scrub sera fluide dès le
      // premier pixel de scroll, on peut révéler le hero
      if (loadedCount >= FRAME_COUNT && !failed) markReadyNow();
    });
  });

  window.addEventListener('resize', resizeCanvas);

  /* Scroll -> progression 0..1 dans le rail */
  function progress() {
    var rect = scrub.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if (total <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / total));
  }

  function update() {
    if (failed) return;
    var p = progress();

    // Frame cible
    targetIndex = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
    var drawable = nearestLoaded(targetIndex);
    if (drawable >= 0 && drawable !== currentIndex && firstFrameReady) {
      drawFrame(drawable);
    }

    // La copie s'efface en douceur pendant la fin de l'orbite
    if (inner) {
      var fade = Math.min(1, Math.max(0, (p - 0.45) / 0.35));
      inner.style.opacity = String(1 - fade);
      inner.style.transform = 'translateY(' + (-40 * fade) + 'px)';
    }

    // L'indicateur de scroll disparaît dès qu'on commence
    if (scrollCue) {
      scrollCue.style.opacity = p > 0.04 ? '0' : '1';
    }

    // Jauge de progression
    if (progressFill) {
      progressFill.style.transform = 'scaleY(' + p + ')';
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  resizeCanvas();
  update();

  // Poignée de debug (utilisée par les tests, sans effet en usage normal)
  window.__heroUpdate = update;
})();
