// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Nav border on scroll
const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });

// Theme toggle (dark / light), remembered across visits
document.querySelector(".theme-btn").addEventListener("click", () => {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const links = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") links.classList.remove("open");
});

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
  }),
  // threshold 0: a ratio-based threshold never fires for sections taller than
  // the screen (e.g. Projects on phones), which left them invisible.
  { threshold: 0, rootMargin: "0px 0px -60px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Staggered fade-in for items inside sections
const itemIO = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); itemIO.unobserve(en.target); }
  }),
  { threshold: 0, rootMargin: "0px 0px -40px 0px" }
);
[".stats li", ".xp-card", ".edu-card", ".awards li", ".card", ".skill-group"].forEach((sel) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add("stagger");
    el.style.transitionDelay = (i % 3) * 90 + "ms";
    itemIO.observe(el);
  });
});

// Count-up for experience metrics
const countIO = new IntersectionObserver(
  (entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    const el = en.target, end = +el.dataset.count, suffix = el.dataset.suffix || "";
    if (reduceMotion) return;
    const start = performance.now(), dur = 1100;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }),
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Scroll progress bar + active nav link
const bar = document.querySelector(".progress");
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  let current = null;
  sections.forEach((s) => { if (s.getBoundingClientRect().top < innerHeight * 0.35) current = s.id; });
  navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Project filters
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".card");
chips.forEach((chip) =>
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      const cats = card.dataset.cat.split(" ");
      card.classList.toggle("hidden", f !== "all" && !cats.includes(f));
    });
  })
);
