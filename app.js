/* ═══════════════════════════════════════════════
   CONFIG — update BACKEND_URL after Railway deploy
═══════════════════════════════════════════════ */
const BACKEND_URL = 'https://YOUR-RAILWAY-APP.railway.app';  // ← update this

/* ═══════════════════════════════════════════════
   LOAD CONTENT FROM CMS
═══════════════════════════════════════════════ */
async function loadContent() {
  try {
    const res = await fetch('/content.json?v=' + Date.now());
    if (!res.ok) return;
    const c = await res.json();
    applyContent(c);
  } catch (e) {
    // Silently fall back to inline HTML defaults
    console.info('Using default content');
  }
}

function applyContent(c) {
  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  };

  const setHref = (id, href) => {
    const el = document.getElementById(id);
    if (el && href) el.href = href;
  };

  // Nav
  set('nav-logo', c.nav?.logo);
  set('nav-cta', c.nav?.cta);
  set('footer-logo', c.footer?.logo);

  // Hero
  set('hero-badge', c.hero?.badge);
  set('hero-headline', c.hero?.headline);
  set('hero-sub', c.hero?.subheadline);
  set('hero-proof', '');  // rebuild below
  set('form-headline', c.hero?.formHeadline);
  set('form-sub', c.hero?.formSubtext);
  set('submit-btn', '');  // rebuilt below

  // Hero proof
  const proof = document.getElementById('hero-proof');
  if (proof && c.hero?.socialProof) {
    proof.innerHTML = `
      <div class="proof-avatars">
        <span class="avatar">A</span>
        <span class="avatar">B</span>
        <span class="avatar">C</span>
        <span class="avatar">D</span>
      </div>
      <span>${c.hero.socialProof}</span>
    `;
  }

  // Form button
  const btn = document.getElementById('submit-btn');
  if (btn) {
    btn.innerHTML = `
      <span id="btn-text">${c.hero?.cta || 'Get Instant Access →'}</span>
      <span id="btn-loading" class="hidden">Signing you up…</span>
    `;
  }

  // Form placeholders
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  if (nameInput && c.hero?.namePlaceholder) nameInput.placeholder = c.hero.namePlaceholder;
  if (emailInput && c.hero?.emailPlaceholder) emailInput.placeholder = c.hero.emailPlaceholder;

  // Trust bar
  if (c.trust && Array.isArray(c.trust)) {
    const grid = document.getElementById('trust-grid');
    if (grid) {
      grid.innerHTML = c.trust.map(t => `
        <div class="trust-item">
          <span class="trust-value">${t.value}</span>
          <span class="trust-label">${t.label}</span>
        </div>
      `).join('');
    }
  }

  // Benefits
  const benefits = c.benefits;
  if (benefits) {
    set('benefits-headline', benefits.headline);
    set('benefits-sub', benefits.subheadline);
    if (benefits.items) {
      const grid = document.getElementById('benefits-grid');
      if (grid) {
        grid.innerHTML = benefits.items.map(b => `
          <div class="benefit-card">
            <span class="benefit-icon">${b.icon}</span>
            <h3 class="benefit-title">${b.title}</h3>
            <p class="benefit-desc">${b.description}</p>
          </div>
        `).join('');
      }
    }
  }

  // Schedule
  if (c.schedule) {
    set('schedule-headline', c.schedule.headline);
    const list = document.getElementById('schedule-list');
    if (list && c.schedule.items) {
      list.innerHTML = c.schedule.items.map(s => `
        <div class="schedule-item">
          <span class="schedule-week">${s.week}</span>
          <div>
            <div class="schedule-title">${s.title}</div>
            <div class="schedule-desc">${s.desc}</div>
          </div>
        </div>
      `).join('');
    }
  }

  // Trainer
  if (c.trainer) {
    set('trainer-name', c.trainer.name);
    set('trainer-title', c.trainer.title);
    set('trainer-bio', c.trainer.bio);
    set('trainer-quote', c.trainer.tagline);
    const avatar = document.getElementById('trainer-avatar');
    if (avatar && c.trainer.photo) {
      avatar.innerHTML = `<img src="${c.trainer.photo}" alt="${c.trainer.name}" />`;
      avatar.style.padding = '0';
      avatar.style.overflow = 'hidden';
    } else if (avatar && c.trainer.name) {
      avatar.textContent = c.trainer.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('');
    }
  }

  // FAQ
  if (c.faq) {
    set('faq-headline', c.faq.headline);
    const list = document.getElementById('faq-list');
    if (list && c.faq.items) {
      list.innerHTML = c.faq.items.map((item, i) => `
        <div class="faq-item" id="faq-${i}">
          <button class="faq-question" aria-expanded="false" onclick="toggleFaq(${i})">
            <span>${item.question}</span>
            <svg class="faq-chevron" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 7.5L10 12.5L15 7.5"/>
            </svg>
          </button>
          <div class="faq-answer">
            <div class="faq-answer-inner">${item.answer}</div>
          </div>
        </div>
      `).join('');
    }
  }

  // Final CTA
  if (c.finalCta) {
    set('cta-headline', c.finalCta.headline);
    set('cta-sub', c.finalCta.subheadline);
    set('cta-btn', c.finalCta.cta);
  }

  // Footer
  if (c.footer) {
    set('footer-tagline', c.footer.tagline);
    set('footer-copy', c.footer.copyright);
  }

  // Site title
  if (c.siteTitle) document.title = c.siteTitle;
}

/* ═══════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════ */
function toggleFaq(index) {
  const item = document.getElementById('faq-' + index);
  if (!item) return;
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
  });

  // Open clicked (unless it was already open)
  if (!isOpen) {
    item.classList.add('open');
    item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
  }
}

/* ═══════════════════════════════════════════════
   FORM SUBMISSION
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadContent();

  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleSubmit();
  });
});

async function handleSubmit() {
  const nameInput  = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const btnText    = document.getElementById('btn-text');
  const btnLoading = document.getElementById('btn-loading');
  const submitBtn  = document.getElementById('submit-btn');
  const successEl  = document.getElementById('form-success');
  const errorEl    = document.getElementById('form-error');

  // Clear previous states
  errorEl.classList.add('hidden');
  nameInput.classList.remove('error');
  emailInput.classList.remove('error');

  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();

  // Validate
  let hasError = false;
  if (!name) { nameInput.classList.add('error'); hasError = true; }
  if (!email || !isValidEmail(email)) { emailInput.classList.add('error'); hasError = true; }
  if (hasError) return;

  // Loading state
  btnText.classList.add('hidden');
  btnLoading.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${BACKEND_URL}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) throw new Error('Server error');

    // Show success
    document.getElementById('signup-form').classList.add('hidden');
    successEl.classList.remove('hidden');

    // Track signup (optional analytics event)
    if (window.gtag) window.gtag('event', 'sign_up', { method: 'landing_page' });

  } catch (err) {
    console.error('Signup error:', err);
    errorEl.classList.remove('hidden');
    // Reset button
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    submitBtn.disabled = false;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL FOR NAV/CTA LINKS
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ═══════════════════════════════════════════════
   STICKY NAV SHADOW ON SCROLL
═══════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  if (nav) {
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 40px rgba(0,0,0,0.4)'
      : 'none';
  }
}, { passive: true });
