// ── NAVBAR: add .scrolled class on scroll ──
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
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
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── FORM VALIDATION HELPERS ──

function showError(input, message) {
  if (!input) return;

  clearError(input);
  input.classList.add('input-error');

  const err = document.createElement('p');
  err.className = 'field-error';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearError(input) {
  if (!input) return;

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
  const email = value.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1];

  // Only exact trusted domains are accepted.
  return TRUSTED_DOMAINS.includes(domain);
}

// ── NAME FIELD: block invalid typing, paste, autofill ──
const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');

const ALLOWED_NAME_KEY = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-.]$/;
const INVALID_NAME_CHARS = /[^A-Za-zÀ-ÖØ-öø-ÿ\s'\-.]/g;
const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-.]+$/;

function cleanNameValue(value) {
  return value.replace(INVALID_NAME_CHARS, '');
}

if (nameInput) {
  nameInput.addEventListener('keydown', (e) => {
    const allowedControls = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
      'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'
    ];

    if (
      allowedControls.includes(e.key) ||
      e.ctrlKey ||
      e.metaKey ||
      e.altKey
    ) {
      return;
    }

    if (!ALLOWED_NAME_KEY.test(e.key)) {
      e.preventDefault();
      showError(nameInput, 'Only letters, spaces, hyphens, apostrophes, or periods are allowed.');
    } else {
      clearError(nameInput);
    }
  });

  nameInput.addEventListener('beforeinput', (e) => {
    if (!e.data) return;

    if (INVALID_NAME_CHARS.test(e.data)) {
      e.preventDefault();
      showError(nameInput, 'Only letters, spaces, hyphens, apostrophes, or periods are allowed.');
    }
  });

  nameInput.addEventListener('input', () => {
    const cleaned = cleanNameValue(nameInput.value);

    if (nameInput.value !== cleaned) {
      nameInput.value = cleaned;
      showError(nameInput, 'Only letters, spaces, hyphens, apostrophes, or periods are allowed.');
    }
  });

  nameInput.addEventListener('paste', (e) => {
    e.preventDefault();

    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const cleaned = cleanNameValue(pasted);

    const start = nameInput.selectionStart;
    const end = nameInput.selectionEnd;

    nameInput.value =
      nameInput.value.slice(0, start) +
      cleaned +
      nameInput.value.slice(end);

    if (pasted !== cleaned) {
      showError(nameInput, 'Only letters, spaces, hyphens, apostrophes, or periods are allowed.');
    } else {
      clearError(nameInput);
    }
  });

  nameInput.addEventListener('blur', () => {
    const value = nameInput.value.trim();

    if (value && !FULL_NAME_REGEX.test(value)) {
      showError(nameInput, 'Only letters, spaces, hyphens, apostrophes, or periods are allowed.');
    } else {
      clearError(nameInput);
    }
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
      showError(emailInput, 'Please use a trusted email provider, such as Gmail, Yahoo, or Outlook.');
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
  } else if (!FULL_NAME_REGEX.test(nameInput.value.trim())) {
    showError(nameInput, 'Only letters, spaces, hyphens, apostrophes, or periods are allowed.');
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
    showError(emailInput, 'Please use a trusted email provider, such as Gmail, Yahoo, or Outlook.');
    hasError = true;
  }

  if (hasError) return;

  const successMsg = document.getElementById('form-success');

  if (successMsg) {
    successMsg.style.display = 'block';
  }

  e.target.reset();

  setTimeout(() => {
    if (successMsg) {
      successMsg.style.display = 'none';
    }
  }, 5000);
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