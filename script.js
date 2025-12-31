// robo sapiens — premium-feel vanilla js (no libs)
// features: canvas particles, reveal on scroll, magnetic hover, orb drag, modal, theme toggle

const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

/* -------------------- theme -------------------- */
const themeBtn = $("#themeBtn");
const saved = localStorage.getItem("theme");
if (saved) document.documentElement.dataset.theme = saved;

themeBtn?.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || "dark";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

/* -------------------- year -------------------- */
$("#year").textContent = new Date().getFullYear();

/* -------------------- reveal on scroll -------------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("on");
  });
}, { threshold: 0.12 });

$$(".reveal").forEach(el => io.observe(el));

/* -------------------- magnetic hover -------------------- */
function magnetize(el, strength=0.18){
  const rect = () => el.getBoundingClientRect();

  function onMove(e){
    const r = rect();
    const x = (e.clientX - (r.left + r.width/2)) * strength;
    const y = (e.clientY - (r.top + r.height/2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  function onLeave(){
    el.style.transform = `translate(0px, 0px)`;
  }

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);
}

$$(".magnet").forEach(el => magnetize(el));

/* -------------------- cursor glow follow -------------------- */
const glow = document.getElementById("cursor-glow");

window.addEventListener("pointermove", (e) => {
  if (!glow) return;

  glow.style.transform = `
    translate(${e.clientX}px, ${e.clientY}px)
    translate(-50%, -50%)
  `;
});

/* -------------------- tilt cards -------------------- */
$$("[data-tilt]").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateX(${(-py*8)}deg) rotateY(${(px*10)}deg) translateY(-1px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
  });
});

/* -------------------- modal posts -------------------- */
const modal = $("#modal");
const modalContent = $("#modalContent");
const postData = {
  demo: {
    title: "robot demo day",
    body: [
      "We bring our robot to community spaces and let students drive it.",
      "Goal: make robotics feel hands-on, not intimidating — and help younger students see themselves in STEM."
    ]
  },
  drive: {
    title: "week 1: drivetrain decisions",
    body: [
      "We treated drivetrain as a system: speed, traction, control, and build time.",
      "We’ll publish testing clips + notes as we iterate."
    ]
  },
  sponsor: {
    title: "why support us",
    body: [
      "Sponsorship pays for parts, registration, travel, outreach materials, and tools.",
      "You get community visibility + direct impact: every dollar builds access to STEM."
    ]
  }
};

function openModal(key){
  const d = postData[key];
  if (!d) return;
  modalContent.innerHTML = `
    <h3>${d.title}</h3>
    ${d.body.map(p => `<p>${p}</p>`).join("")}
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$("[data-modal]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.modal));
});
$$("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

/* -------------------- contact form (frontend only) -------------------- */
$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());

  // you’ll replace this with your backend call (fetch to your endpoint)
  console.log("contact form payload:", data);

  // micro UX
  const btn = form.querySelector("button[type='submit']");
  btn.textContent = "sent ✓";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "send";
    btn.disabled = false;
    form.reset();
  }, 1400);
});

/* -------------------- fun button -------------------- */
$("#playBtn")?.addEventListener("click", () => {
  document.documentElement.animate(
    [
      { filter: "hue-rotate(0deg) saturate(1)" },
      { filter: "hue-rotate(18deg) saturate(1.15)" },
      { filter: "hue-rotate(0deg) saturate(1)" }
    ],
    { duration: 900, easing: "ease-in-out" }
  );
});
