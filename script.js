// LOGO DIGITAZIONE
const text = "Spottly";
const logo = document.getElementById("logo");
let i = 0;

function typeEffect() {
  if (i < text.length) {
    logo.textContent += text.charAt(i);
    i++;
    setTimeout(typeEffect, 200); // velocità digitazione
  } else {
    setTimeout(() => { logo.style.borderRight = "none"; }, 500);
  }
}

window.onload = () => {
  typeEffect();
  createParticles();
  initIubenda();
}

// PARTICELLE
function createParticles() {
  const container = document.querySelector('.particles');
  const numberOfParticles = 100;

  for(let i=0; i<numberOfParticles; i++){
      const particle = document.createElement('span');
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
      container.appendChild(particle);
  }
}

// IUBENDA BOTTOM BANNER
function initIubenda() {
  window._iub = window._iub || [];
  _iub.csConfiguration = {
    consentOnContinuedBrowsing: false,
    lang: "it",
    siteId: 74448765,
    banner: {
      position: "bottom",
      acceptButtonDisplay: true,
      rejectButtonDisplay: true,
      applyStyles: true
    }
  };

  const script = document.createElement('script');
  script.src = "https://cdn.iubenda.com/cs/iubenda_cs.js";
  script.async = true;
  document.body.appendChild(script);
}