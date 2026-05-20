// ── NAVBAR: add .scrolled class on scroll ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── FORM VALIDATION HELPERS ──

function showError(input, message) {
  clearError(input);
  input.classList.add('input-error');
  const err = document.createElement('p');
  err.className = 'field-error';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearError(input) {
  input.classList.remove('input-error');
  const existing = input.parentElement.querySelector('.field-error');
  if (existing) existing.remove();
}

// Trusted email domains
const TRUSTED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'live.com', 'msn.com', 'me.com', 'protonmail.com', 'proton.me',
  'mail.com', 'aol.com', 'ymail.com', 'googlemail.com',
  'yahoo.com.ph', 'pldtdsl.net', 'globe.com.ph',
  'edu.ph', 'gov.ph'
];

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return false;
  const domain = value.split('@')[1].toLowerCase();
  return TRUSTED_DOMAINS.some(trusted =>
    domain === trusted || domain.endsWith('.' + trusted)
  );
}

// ── NAME FIELD: block invalid keys & paste ──
const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');

const ALLOWED_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-\.]$/;

if (nameInput) {
  // Block disallowed keystrokes before they reach the input
  nameInput.addEventListener('keydown', (e) => {
    // Always allow: backspace, delete, arrows, tab, enter, home, end
    const controlKeys = [
      'Backspace','Delete','ArrowLeft','ArrowRight',
      'ArrowUp','ArrowDown','Tab','Enter','Home','End'
    ];
    if (controlKeys.includes(e.key)) return;

    // Block anything not matching allowed characters
    if (!ALLOWED_NAME_REGEX.test(e.key)) {
      e.preventDefault();
      showError(nameInput, 'Only letters, spaces, hyphens, or apostrophes are allowed.');
    } else {
      clearError(nameInput);
    }
  });

  // Also strip any invalid characters that sneak in via paste
  nameInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const cleaned = pasted.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'\-\.]/g, '');

    // Insert cleaned text at cursor position
    const start = nameInput.selectionStart;
    const end   = nameInput.selectionEnd;
    const current = nameInput.value;
    nameInput.value = current.slice(0, start) + cleaned + current.slice(end);

    if (pasted !== cleaned) {
      showError(nameInput, 'Only letters, spaces, hyphens, or apostrophes are allowed.');
    } else {
      clearError(nameInput);
    }
  });

  nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim()) clearError(nameInput);
  });
}

// ── EMAIL FIELD: validate on blur ──
if (emailInput) {
  emailInput.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    if (!val) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(emailInput, 'Please enter a valid email address.');
    } else if (!isValidEmail(val)) {
      showError(emailInput, 'Please use a trusted email provider (e.g. Gmail, Yahoo, Outlook).');
    } else {
      clearError(emailInput);
    }
  });

  emailInput.addEventListener('input', () => clearError(emailInput));
}

// ── CONTACT FORM SUBMIT ──
function handleFormSubmit(e) {
  e.preventDefault();
  let hasError = false;

  if (!nameInput.value.trim()) {
    showError(nameInput, 'Full name is required.');
    hasError = true;
  }

  const emailVal = emailInput.value.trim();
  if (!emailVal) {
    showError(emailInput, 'Email address is required.');
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    showError(emailInput, 'Please enter a valid email address.');
    hasError = true;
  } else if (!isValidEmail(emailVal)) {
    showError(emailInput, 'Please use a trusted email provider (e.g. Gmail, Yahoo, Outlook).');
    hasError = true;
  }

  if (hasError) return;

  const successMsg = document.getElementById('form-success');
  successMsg.style.display = 'block';
  e.target.reset();
  setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.program-card, .mv-card, .testi-card, .pillar, .gallery-item, .faq-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});