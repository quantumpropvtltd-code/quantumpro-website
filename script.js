const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const glow = document.querySelector('.cursor-glow');
const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const loader = document.querySelector('.page-loader');
const particleLayer = document.querySelector('.particle-layer');
const form = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isExpanded = nav.classList.contains('open');
    toggle.setAttribute('aria-expanded', String(isExpanded));
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('load', () => {
  setTimeout(() => {
    loader?.classList.add('hidden');
  }, 500);
});

window.addEventListener('mousemove', (event) => {
  if (!glow) return;
  const x = event.clientX;
  const y = event.clientY;
  glow.style.left = `${x}px`;
  glow.style.top = `${y}px`;
  document.documentElement.style.setProperty('--pointer-x', `${(x / window.innerWidth) * 100}%`);
  document.documentElement.style.setProperty('--pointer-y', `${(y / window.innerHeight) * 100}%`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const targetId = link.getAttribute('href');
          link.classList.toggle('active', targetId === `#${entry.target.id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.7 }
);

function animateCounter(element) {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || '';
  const duration = 1400;
  const startTime = performance.now();

  const tick = (time) => {
    const progress = Math.min(1, (time - startTime) / duration);
    const current = Math.floor(progress * target);
    element.textContent = `${current}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
}

counters.forEach((counter) => counterObserver.observe(counter));

if (particleLayer) {
  for (let index = 0; index < 18; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.setProperty('--x', `${Math.random() * 100}%`);
    particle.style.setProperty('--y', `${Math.random() * 100}%`);
    particle.style.setProperty('--size', `${Math.random() * 6 + 3}px`);
    particle.style.animationDelay = `${Math.random() * 4}s`;
    particleLayer.appendChild(particle);
  }
}

document.querySelectorAll('.btn, .floating-action').forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = button.getBoundingClientRect();
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formStatus) {
      formStatus.textContent = 'Thanks for reaching out. We will get back to you shortly.';
    }
    form.reset();
  });
}
