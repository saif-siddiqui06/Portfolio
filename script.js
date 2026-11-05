// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Nav border on scroll
const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });

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
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

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
