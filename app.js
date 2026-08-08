/* ══════════════════════════════════════════════════════════
   PETAL STUDIO — app.js
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1600);
});

/* ─── CUSTOM CURSOR ─── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX; cursorY = e.clientY;
  cursorDot.style.left = cursorX + 'px';
  cursorDot.style.top = cursorY + 'px';
});

function animateCursor() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .cat-card, .gallery-item, .filter-btn, .btn-view').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
});

/* ─── NAVBAR ─── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ─── HAMBURGER ─── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

/* ─── PARTICLES ─── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#f9a8d4', '#c084fc', '#5eead4', '#fbbf24', '#ec4899', '#a78bfa'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4 - 0.2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 1; this.decay = Math.random() * 0.003 + 0.001;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity * this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─── COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + (target >= 100 ? '+' : '');
      if (count >= target) clearInterval(timer);
    }, 25);
  });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObserver.disconnect(); } });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ─── REVEAL ON SCROLL ─── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.gallery-item, .cat-card, .about-img-card, .feature').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ─── GALLERY FILTER ─── */
function setupFilter(filterId, galleryId) {
  const filterContainer = document.getElementById(filterId);
  const galleryItems = document.querySelectorAll('#' + galleryId + ' .gallery-item');
  if (!filterContainer) return;

  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

setupFilter('artFilter', 'artGallery');
setupFilter('editedFilter', 'editedGallery');
setupFilter('aiFilter', 'aiGallery');

/* ─── LIGHTBOX ─── */
function openLightbox(imgSrc, title, meta, desc) {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbPlaceholder = document.getElementById('lightboxPlaceholder');
  const lbWrap = document.getElementById('lightboxImgWrap');

  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxMeta').textContent = meta;
  document.getElementById('lightboxDesc').textContent = desc;

  if (imgSrc) {
    lbImg.src = imgSrc;
    lbImg.style.display = 'block';
    lbPlaceholder.style.display = 'none';
  } else {
    lbImg.style.display = 'none';
    lbPlaceholder.style.display = 'block';
    lbPlaceholder.innerHTML = '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#0a0612"/><text x="200" y="195" text-anchor="middle" fill="#c084fc" font-size="18" font-family="Outfit,sans-serif">🌸</text><text x="200" y="225" text-anchor="middle" fill="#c084fc" font-size="14" font-family="Outfit,sans-serif">' + title + '</text></svg>';
  }

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOnBg(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ─── NEWSLETTER ─── */
function handleSubscribe(e) {
  e.preventDefault();
  const msg = document.getElementById('newsletterMsg');
  const email = document.getElementById('emailInput').value;
  msg.textContent = '🌸 Welcome! You\'ll receive beautiful flower art weekly at ' + email;
  document.getElementById('newsletterForm').reset();
  setTimeout(() => { msg.textContent = ''; }, 6000);
}

/* ─── SMOOTH SCROLL for hero image cycling ─── */
const heroImg = document.getElementById('heroImg');
const heroImages = ['art_flower.png', 'edited_flower.png', 'ai_flower.png'];
let heroImgIdx = 0;

setInterval(() => {
  heroImgIdx = (heroImgIdx + 1) % heroImages.length;
  heroImg.style.opacity = '0';
  heroImg.style.transform = 'scale(1.08) rotate(5deg)';
  setTimeout(() => {
    heroImg.src = heroImages[heroImgIdx];
    heroImg.style.opacity = '1';
    heroImg.style.transform = 'scale(1) rotate(0deg)';
  }, 400);
}, 4000);

heroImg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

/* ─── PARALLAX on hero orbs ─── */
window.addEventListener('mousemove', e => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 30;
  const my = (e.clientY / window.innerHeight - 0.5) * 30;
  document.querySelector('.orb-1').style.transform = `translate(${mx}px, ${my}px)`;
  document.querySelector('.orb-2').style.transform = `translate(${-mx * 0.7}px, ${-my * 0.7}px)`;
  document.querySelector('.orb-3').style.transform = `translate(${mx * 0.5}px, ${my * 0.5}px)`;
});
