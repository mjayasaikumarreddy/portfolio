/* =============================================
   PORTFOLIO — MAIN SCRIPT
   ============================================= */

// ── Typed text animation ──────────────────────
const roles = [
  "AI/ML Research Engineer",
  "Federated Learning Researcher",
  "Deep Learning Developer",
  "Full Stack Engineer",
  "MLOps Practitioner",
  "Computer Vision Engineer",
];

let roleIndex = 0;
let charIndex  = 0;
let deleting   = false;
const typedEl  = document.getElementById("typed-text");
const SPEED_TYPE   = 65;
const SPEED_DELETE = 35;
const PAUSE_END    = 1800;
const PAUSE_START  = 400;

function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, PAUSE_END);
      return;
    }
    setTimeout(typeLoop, SPEED_TYPE);
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, PAUSE_START);
      return;
    }
    setTimeout(typeLoop, SPEED_DELETE);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeLoop();
  initTabs();
  initScrollReveal();
  initActivityBar();
});

// ── Tab / section navigation ──────────────────
const sectionMap = {
  home:       { file: "home.tsx",       icon: "fa-home" },
  about:      { file: "about.md",       icon: "fa-user" },
  skills:     { file: "skills.json",    icon: "fa-code" },
  experience: { file: "experience.ts",  icon: "fa-briefcase" },
  projects:   { file: "projects.py",    icon: "fa-folder-open" },
  contact:    { file: "contact.go",     icon: "fa-envelope" },
};

function switchSection(name) {
  // Hide all sections
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  // Show target
  const target = document.getElementById(name);
  if (target) target.classList.add("active");

  // Update tabs
  document.querySelectorAll(".tab").forEach(t => {
    t.classList.toggle("active", t.dataset.section === name);
  });

  // Update activity bar icons
  document.querySelectorAll(".activity-icon[data-section]").forEach(i => {
    i.classList.toggle("active", i.dataset.section === name);
  });

  // Update breadcrumb
  const bc = document.getElementById("breadcrumb-active");
  if (bc && sectionMap[name]) bc.textContent = sectionMap[name].file;

  // Trigger scroll-reveal for newly visible section
  revealVisible();
}

function initTabs() {
  // Tab clicks
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab-close")) return;
      switchSection(tab.dataset.section);
    });
  });

  // Tab close — just switch to home (tabs don't actually close)
  document.querySelectorAll(".tab-close").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const tab = btn.closest(".tab");
      if (tab && tab.classList.contains("active")) {
        switchSection("home");
      }
    });
  });
}

function initActivityBar() {
  document.querySelectorAll(".activity-icon[data-section]").forEach(icon => {
    icon.addEventListener("click", () => {
      switchSection(icon.dataset.section);
    });
  });
}

// Public helper called from HTML buttons
function scrollToSection(name) {
  switchSection(name);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Scroll-reveal ─────────────────────────────
function initScrollReveal() {
  // Mark all reveal targets
  const targets = [
    ".about-card",
    ".skill-group",
    ".timeline-item",
    ".project-card",
    ".contact-link",
    ".contact-form",
    ".stat-card",
    ".hero__actions",
    ".hero__bio",
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add("reveal");
    });
  });

  revealVisible();
}

function revealVisible() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal:not(.visible)").forEach(el => {
    observer.observe(el);
  });
}

// Also trigger reveal on scroll inside .editor-content
document.querySelector(".editor-content")?.addEventListener("scroll", revealVisible);

// ── Contact form ──────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  const btn     = form.querySelector(".form-submit");

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Simulate send (wire up to a real service like Formspree/EmailJS)
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    success.classList.add("show");
    setTimeout(() => success.classList.remove("show"), 4000);
  }, 1200);
}

// ── Keyboard navigation ───────────────────────
const sectionOrder = ["home","about","skills","experience","projects","contact"];

document.addEventListener("keydown", (e) => {
  // Alt+Arrow to navigate sections
  if (!e.altKey) return;
  const active = document.querySelector(".section.active");
  if (!active) return;
  const idx = sectionOrder.indexOf(active.id);
  if (e.key === "ArrowRight" && idx < sectionOrder.length - 1) {
    switchSection(sectionOrder[idx + 1]);
  }
  if (e.key === "ArrowLeft" && idx > 0) {
    switchSection(sectionOrder[idx - 1]);
  }
});

// ── Active section indicator on scroll ────────
// (for when sections are visible inside the editor pane)
const editorContent = document.querySelector(".editor-content");
if (editorContent) {
  editorContent.addEventListener("scroll", () => {
    revealVisible();
  });
}

// ── Smooth stat counter animation ─────────────
function animateCounters() {
  document.querySelectorAll(".stat-number").forEach(el => {
    const text = el.textContent.trim();
    const num  = parseFloat(text.replace(/[^0-9.]/g, ""));
    const suffix = text.replace(/[0-9.]/g, "");
    if (isNaN(num)) return;

    let start = 0;
    const duration = 1200;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (num <= 10
        ? Math.ceil(eased * num)
        : parseFloat((eased * num).toFixed(0))) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Fire counter animation when home section becomes visible
const homeSection = document.getElementById("home");
if (homeSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.3 });
  counterObserver.observe(homeSection);
}

// ── Initial load ──────────────────────────────
window.addEventListener("load", () => {
  revealVisible();
  animateCounters();
});
