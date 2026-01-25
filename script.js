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
$$('[data-tilt]').forEach(card => {
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

/* -------------------- contact form (NO REDIRECT) -------------------- */
$("#contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();

  const form = e.currentTarget;
  const btn = form.querySelector("button[type='submit']");
  const formData = new FormData(form);

  btn.textContent = "sending...";
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (res.ok) {
      btn.textContent = "Sent ✓";
      form.reset();
    } else {
      btn.textContent = "error";
    }
  } catch {
    btn.textContent = "error";
  }

  setTimeout(() => {
    btn.textContent = "send";
    btn.disabled = false;
  }, 16000);

  return false;
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

  /* -------------------- posts carousel -------------------- */
  (function initPostsCarousel(){
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    const list = track.querySelector('.carousel-list');
    const items = Array.from(list.children);
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    let current = 0;

    function visibleCount(){
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getGap(){
      const g = getComputedStyle(list).gap;
      return g ? parseFloat(g) : 16;
    }

    function resize(){
      const visible = Math.min(visibleCount(), items.length);
      const gap = getGap();
      const trackW = track.clientWidth;
      const itemW = Math.floor((trackW - gap * (visible - 1)) / visible);
      items.forEach(it => it.style.width = itemW + 'px');
      update();
    }

    function update(){
      if (!items.length) return;
      const gap = getGap();
      const slideSize = items[0].getBoundingClientRect().width + gap;
      const visible = Math.min(visibleCount(), items.length);
      const maxIndex = Math.max(0, items.length - visible);
      if (current > maxIndex) current = maxIndex;
      list.style.transform = `translateX(${-current * slideSize}px)`;
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === maxIndex;
    }

    prev?.addEventListener('click', () => { current = Math.max(0, current - 1); update(); });
    next?.addEventListener('click', () => {
      const visible = Math.min(visibleCount(), items.length);
      const maxIndex = Math.max(0, items.length - visible);
      current = Math.min(maxIndex, current + 1);
      update();
    });

    window.addEventListener('resize', resize);
    // initial layout
    setTimeout(resize, 30);
  })();