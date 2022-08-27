window.addEventListener('load', (e) => {
  document.querySelectorAll('.btn-class-toggler').forEach((btn) => {
    new ClassToggler(btn).init();
  });
});
