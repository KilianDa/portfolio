(function () {
  // Split hero title into words for a word-by-word reveal.
  // Walks child nodes instead of using textContent so inline markup
  // (the gold italic <em>) survives the split.
  var heroLines = document.querySelectorAll('.hero__line');
  var wordDelayStep = 0.1;
  var allWordSpans = [];

  function wrapWords(textNode) {
    var frag = document.createDocumentFragment();
    var words = textNode.textContent.split(' ');
    words.forEach(function (word, i) {
      if (word) {
        var span = document.createElement('span');
        span.textContent = word;
        frag.appendChild(span);
        allWordSpans.push(span);
      }
      if (i < words.length - 1) {
        frag.appendChild(document.createTextNode(' '));
      }
    });
    return frag;
  }

  heroLines.forEach(function (line) {
    Array.prototype.slice.call(line.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        line.replaceChild(wrapWords(node), node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.prototype.slice.call(node.childNodes).forEach(function (inner) {
          if (inner.nodeType === Node.TEXT_NODE) {
            node.replaceChild(wrapWords(inner), inner);
          }
        });
      }
    });
  });

  allWordSpans.forEach(function (span, index) {
    span.style.transitionDelay = (index * wordDelayStep) + 's';
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      allWordSpans.forEach(function (span) {
        span.classList.add('is-visible');
      });
    });
  });

  // Reveal sections on scroll
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Animate gold separator lines
  var lineObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          lineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('[data-animate-line]').forEach(function (el) {
    lineObserver.observe(el);
  });

  // Slow parallax drift of the hero watermark while scrolling
  var watermark = document.querySelector('.hero__watermark, .page-header__watermark');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (watermark && !reduceMotion) {
    var parallaxTicking = false;
    window.addEventListener('scroll', function () {
      if (parallaxTicking) return;
      parallaxTicking = true;
      requestAnimationFrame(function () {
        watermark.style.setProperty('--parallax', (window.scrollY * 0.12) + 'px');
        parallaxTicking = false;
      });
    }, { passive: true });
  }
})();
