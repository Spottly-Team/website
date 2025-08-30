// LOGO DIGITAZIONE
function typeEffect(element, text, speed = 200) {
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  element.after(cursor);

  function type() {
    if (i < text.length) {
      element.textContent += text[i++];
      setTimeout(type, speed);
    } else {
      cursor.remove();
    }
  }
  
  type();
}

// PARTICELLE (Ottimizzate con DocumentFragment)
function createParticles(containerSelector, count = 100) {
  const container = document.querySelector(containerSelector);
  const fragment = document.createDocumentFragment();
  const particles = [];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    const size = Math.random() * 3 + 1;
    
    Object.assign(particle.style, {
      width: `${size}px`,
      height: `${size}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 5}s`
    });

    particles.push(particle);
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);
  return particles;
}

// Gestione del caricamento della pagina
function init() {
  const logo = document.getElementById('logo');
  if (logo && logo.textContent === '') {
    typeEffect(logo, 'Spottly');
  }
  createParticles('.particles');
}

// Caricamento non bloccante
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}