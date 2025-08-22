// modal-exito.js
document.addEventListener('DOMContentLoaded', function() {
  const form      = document.querySelector('.contact-form');
  const overlay   = document.getElementById('modalExito');
  const btnCerrar = document.getElementById('btnCerrarModal');

  if (!form || !overlay || !btnCerrar) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    overlay.style.display = 'flex';

    // opcional: reset tras animación
    setTimeout(() => form.reset(), 800);
  });

  btnCerrar.addEventListener('click', function() {
    overlay.style.display = 'none';
  });
});