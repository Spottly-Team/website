// LOGO DIGITAZIONE
const text = "Spottly";
const logo = document.getElementById("logo");
let i = 0;

function typeEffect(onComplete) {
    if (i < text.length) {
        logo.textContent += text.charAt(i);
        i++;
        setTimeout(() => typeEffect(onComplete), 60);
    } else {
        setTimeout(() => {
            logo.style.borderRight = "none";
            if (onComplete) onComplete();
        }, 150);
    }
}

// MOSTRA ELEMENTI IN ORDINE
function showAfterTyping() {
    const subtitle = document.querySelector(".subtitle");
    const countdown = document.querySelector(".countdown");
    const cta = document.querySelector(".cta");

    // 1) Subtitle
    setTimeout(() => {
        subtitle.style.opacity = "1";
        subtitle.style.transform = "translateY(0)";
    }, 200);

    // 2) Countdown
    setTimeout(() => {
        countdown.style.opacity = "1";
        countdown.style.transform = "translateY(0)";
    }, 500);

    // 3) Instagram button
    setTimeout(() => {
        cta.style.opacity = "1";
        cta.style.transform = "translateY(0)";
    }, 800);
}

// PARTICELLE
function createParticles() {
    const container = document.querySelector('.particles');
    const numberOfParticles = 100;

    for (let i = 0; i < numberOfParticles; i++) {
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

// COUNTDOWN
function getTargetDate() {
    const now = new Date();
    let year = now.getFullYear();

    let target = new Date(year, 0, 6, 0, 0, 0);

    if (now >= target) {
        target = new Date(year + 1, 0, 6, 0, 0, 0);
    }

    return target;
}

let countdownTarget = getTargetDate();

function updateCountdown() {
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const now = new Date();
    let diff = countdownTarget - now;

    if (diff <= 0) {
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            document.getElementById(id).textContent = (id === 'days') ? '0' : '00';
        });
        clearInterval(countdownInterval);
        return;
    }

    const days = Math.ceil(diff / MS_PER_DAY);
    const restMs = diff - ((days - 1) * MS_PER_DAY);
    const totalSeconds = Math.floor(restMs / 1000);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
let countdownInterval = setInterval(updateCountdown, 1000);

window.onload = () => {
    typeEffect(showAfterTyping);
    createParticles();
    initIubenda();
};