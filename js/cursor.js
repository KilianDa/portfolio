(function () {
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) return;

  var cursor = document.querySelector('.cursor-dot');
  if (!cursor) return;

  var mouseX = 0;
  var mouseY = 0;
  var dotX = 0;
  var dotY = 0;
  var ease = 0.15;
  var started = false;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!started) {
      started = true;
      dotX = mouseX;
      dotY = mouseY;
      cursor.classList.add('is-visible');
    }
  });

  window.addEventListener('mouseleave', function () {
    cursor.classList.remove('is-visible');
  });

  window.addEventListener('mouseenter', function () {
    if (started) cursor.classList.add('is-visible');
  });

  var interactiveSelector = 'a, button, .card, input, textarea, summary, .hamburger';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add('is-active');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove('is-active');
    }
  });

  function render() {
    dotX += (mouseX - dotX) * ease;
    dotY += (mouseY - dotY) * ease;
    cursor.style.transform = 'translate(' + dotX + 'px, ' + dotY + 'px) translate(-50%, -50%)';
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
