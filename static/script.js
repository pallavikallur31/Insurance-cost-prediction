/* ================================================================
   INSURIFY — script.js
   Handles: Loader, Navbar scroll, Scroll reveal, Counter anim,
            Blog filter, Prediction form logic, Back-to-top, etc.
   ================================================================ */

// ----------------------------------------------------------------
// 1. PAGE LOADER
// ----------------------------------------------------------------
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 500);
  }
});

// ----------------------------------------------------------------
// 2. STICKY NAVBAR + SCROLL EFFECTS
// ----------------------------------------------------------------
const navbar = document.querySelector('.navbar-insurify');
const backTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  if (backTop) {
    if (window.scrollY > 300) backTop.classList.add('show');
    else backTop.classList.remove('show');
  }
});

if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ----------------------------------------------------------------
// 3. ACTIVE NAV LINK
// ----------------------------------------------------------------
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === page) link.classList.add('active');
  });
})();

// ----------------------------------------------------------------
// 4. SCROLL REVEAL ANIMATIONS
// ----------------------------------------------------------------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // stagger children if needed
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ----------------------------------------------------------------
// 5. COUNTER ANIMATION
// ----------------------------------------------------------------
function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
  el.textContent = '0' + (el.dataset.suffix || '');
  counterObserver.observe(el);
});

// ----------------------------------------------------------------
// 6. BLOG SEARCH & FILTER
// ----------------------------------------------------------------
const searchInput  = document.getElementById('blogSearch');
const filterPills  = document.querySelectorAll('.filter-pill');
const blogCards    = document.querySelectorAll('.blog-item');

function filterBlogs() {
  const query     = searchInput ? searchInput.value.toLowerCase() : '';
  const activeTag = document.querySelector('.filter-pill.active')?.dataset.tag || 'all';

  blogCards.forEach(card => {
    const title   = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
    const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
    const tag     = card.dataset.tag || '';

    const matchSearch = title.includes(query) || excerpt.includes(query);
    const matchTag    = activeTag === 'all' || tag === activeTag;

    card.style.display = matchSearch && matchTag ? '' : 'none';
  });
}

if (searchInput)    searchInput.addEventListener('input', filterBlogs);
filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    filterBlogs();
  });
});

// ----------------------------------------------------------------
// 7. PREDICTION FORM — TOGGLES, MEMBER CARDS, STEP VALIDATION
// ----------------------------------------------------------------

// Gender toggle
document.querySelectorAll('.gender-toggle .toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hidden = document.getElementById('genderValue');
    if (hidden) hidden.value = btn.dataset.value;
  });
});

// Smoker toggle
document.querySelectorAll('.smoker-toggle .toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hidden = document.getElementById('smokerValue');
    if (hidden) hidden.value = btn.dataset.value;
  });
});

// Marital Status toggle
document.querySelectorAll('.marital-toggle .toggle-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hidden = document.getElementById('maritalValue');
    if (hidden) hidden.value = btn.dataset.value;
  });
});

// Member card selection
document.querySelectorAll('.member-card[data-member]').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
    updateMemberValues();
  });
});

function updateMemberValues() {
  const selected = [...document.querySelectorAll('.member-card.selected')].map(c => c.dataset.member);
  const hidden   = document.getElementById('membersValue');
  if (hidden) hidden.value = selected.join(',');
}

// (Predict form logic is handled in predict.html via fetch API)

// ----------------------------------------------------------------
// 8. CONTACT FORM
// ----------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = '✅ Message Sent!';
      btn.style.background = 'var(--accent)';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1400);
  });
}

// ----------------------------------------------------------------
// 9. NAVBAR HAMBURGER ARIA
// ----------------------------------------------------------------
const toggler = document.querySelector('.navbar-toggler');
if (toggler) {
  toggler.addEventListener('click', () => {
    const expanded = toggler.getAttribute('aria-expanded') === 'true';
    toggler.setAttribute('aria-expanded', String(!expanded));
  });
}

// ----------------------------------------------------------------
// 10. STAGGER REVEAL (for card grids)
// ----------------------------------------------------------------
document.querySelectorAll('.stagger-parent').forEach(parent => {
  const children = parent.querySelectorAll(':scope > *');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});
