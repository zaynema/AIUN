// Grouped so visually similar organizations sit near each other:
// UN system first, then development banks / financial bodies, then
// regional & international bodies. [fullName, mark, category, logo?]
const organizations = [
  ["United Nations", "UN", "un"],
  ["United Nations Children's Fund", "UNICEF", "un"],
  ["United Nations Development Programme", "UNDP", "un"],
  ["UN Refugee Agency", "UNHCR", "un"],
  ["World Food Programme", "WFP", "un"],
  ["World Health Organization", "WHO", "un"],
  ["Food and Agriculture Organization", "FAO", "un"],
  ["UNESCO", "UNESCO", "un"],
  ["International Labour Organization", "ILO", "un"],
  ["United Nations Population Fund", "UNFPA", "un"],
  ["UN Women", "UN Women", "un"],
  ["United Nations Industrial Development Organization", "UNIDO", "un"],
  ["International Atomic Energy Agency", "IAEA", "un"],
  ["World Meteorological Organization", "WMO", "un"],
  ["International Telecommunication Union", "ITU", "un"],
  ["International Maritime Organization", "IMO", "un"],
  ["International Civil Aviation Organization", "ICAO", "un"],
  ["World Intellectual Property Organization", "WIPO", "un"],
  ["UNOPS", "UNOPS", "un"],
  ["United Nations Volunteers", "UNV", "un"],
  ["United Nations International Computing Centre", "UNICC", "un"],
  ["United Nations University", "UNU", "un"],
  ["UN Institute for Training and Research", "UNITAR", "un"],
  ["International Organization for Migration", "IOM", "un"],
  ["World Bank Group", "World Bank", "finance"],
  ["International Monetary Fund", "IMF", "finance"],
  ["Asian Development Bank", "ADB", "finance"],
  ["Asian Infrastructure Investment Bank", "AIIB", "finance"],
  ["European Bank for Reconstruction and Development", "EBRD", "finance"],
  ["Inter-American Development Bank", "IDB", "finance"],
  ["New Development Bank", "NDB", "finance"],
  ["European Union", "EU", "intl"],
  ["African Union", "African Union", "intl"],
  ["Association of Southeast Asian Nations", "ASEAN", "intl"],
  ["Organisation for Economic Co-operation and Development", "OECD", "intl"],
  ["Organization for Security and Co-operation in Europe", "OSCE", "intl"],
  ["Council of Europe", "Council of Europe", "intl"],
  ["International Energy Agency", "IEA", "intl"],
  ["International Union for Conservation of Nature", "IUCN", "intl"],
  ["International Criminal Court", "ICC", "intl"],
];

// Placeholder role data, generated deterministically per card so each
// preview looks distinct without hard-coding 39 entries per organization.
const ROLE_TITLES = [
  "Programme Analyst",
  "Data Officer",
  "Policy Specialist",
  "Monitoring & Evaluation Officer",
  "Communications Associate",
  "Project Coordinator",
  "Research Consultant",
  "Field Coordinator",
  "Programme Specialist",
  "Operations Analyst",
  "Partnerships Officer",
  "Information Management Officer",
  "Humanitarian Affairs Officer",
  "Climate Policy Analyst",
  "GIS Specialist",
];
const ROLE_CITIES = [
  ["New York", "United States"],
  ["Geneva", "Switzerland"],
  ["Budapest", "Hungary"],
  ["Copenhagen", "Denmark"],
  ["Nairobi", "Kenya"],
  ["Bangkok", "Thailand"],
  ["Paris", "France"],
  ["Vienna", "Austria"],
  ["Rome", "Italy"],
  ["Amman", "Jordan"],
  ["Panama City", "Panama"],
  ["Remote", ""],
];
const ROLE_GRADES = ["P-2", "P-3", "P-4", "P-5", "NO-B", "NO-C"];

function buildRole(i) {
  const [city, country] = ROLE_CITIES[i % ROLE_CITIES.length];
  const deadline = new Date(2026, 6, 6);
  deadline.setDate(deadline.getDate() + i * 4);
  return {
    title: ROLE_TITLES[i % ROLE_TITLES.length],
    city,
    country,
    grade: ROLE_GRADES[i % ROLE_GRADES.length],
    location: country ? city + ", " + country : city,
    deadline: deadline.toISOString().slice(0, 10),
  };
}

const storyStates = [
  {
    title: "Upload once, privately.",
    copy:
      "Upload your resume once. We keep only the useful competency signals, then delete the file.",
    phase: "upload",
  },
  {
    title: "Fresh UN matches, less noise.",
    copy:
      "We surface new UN-system roles, compare them with your signals, and bring the strongest fits forward.",
    phase: "roles",
  },
  {
    title: "Your next step finds you.",
    copy:
      "Each week, new matches arrive with the reason they fit — so you can apply, not search.",
    phase: "email",
  },
];

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function renderOrganizations() {
  const logoGrid = document.querySelector("#logo-grid");
  if (!logoGrid) return;
  logoGrid.innerHTML = organizations
    .map(
      ([name, mark, category], i) => `
        <button
          class="logo-tile"
          type="button"
          style="--i:${i}"
          data-org="${name}"
          data-mark="${mark}"
          data-category="${category}"
          title="${name}"
          aria-label="Preview roles at ${name}"
          aria-expanded="false"
        >
          <span class="tile-inner">
            <span class="tile-face tile-front">
              <span class="logo-wordmark" aria-hidden="true">${mark}</span>
            </span>
            <span class="tile-face tile-back" aria-hidden="true">
              <span class="role-preview">
                <span class="role-title"></span>
                <span class="role-loc"></span>
                <span class="role-grade"></span>
              </span>
            </span>
          </span>
        </button>
      `,
    )
    .join("") +
    `
      <div class="dev-tile" role="img" aria-label="More organizations in development">
        <div class="dev-inner">
          <span class="dev-fallback" aria-hidden="true">🐴</span>
          <img
            class="dev-img"
            src="./assets/dev-horse.png"
            alt=""
            onerror="this.classList.add('is-missing');this.closest('.dev-inner').classList.add('no-img');"
          />
          <span class="dev-text">
            <span class="dev-label">Developing</span>
          </span>
        </div>
      </div>
    `;
}

// ---- Coverage: org logos -> role previews -> expanded role detail ----
function setupCoverage() {
  const section = document.querySelector(".coverage-section");
  const grid = document.querySelector("#logo-grid");
  if (!section || !grid) return;
  const backBtn = section.querySelector(".coverage-back");
  const contextEl = section.querySelector(".coverage-context");
  let sourceTile = null;

  // Expanded detail card lives inside the grid so its absolute position
  // shares the same coordinate space as the tiles (no reflow on open).
  const detail = document.createElement("div");
  detail.className = "role-detail";
  detail.id = "role-detail";
  detail.hidden = true;
  detail.innerHTML = `
    <button class="role-detail-close" type="button" aria-label="Close role detail">
      <i data-lucide="x" aria-hidden="true"></i>
    </button>
    <span class="role-detail-org"></span>
    <h3 class="role-detail-title"></h3>
    <div class="role-detail-meta">
      <div class="rd-cell">
        <span class="rd-label">Level</span>
        <span class="rd-value rd-level"></span>
      </div>
      <div class="rd-cell">
        <span class="rd-label">Location</span>
        <span class="rd-value rd-location"></span>
      </div>
      <div class="rd-cell">
        <span class="rd-label">Deadline</span>
        <span class="rd-value rd-deadline"></span>
      </div>
      <div class="rd-cell rd-action">
        <button class="role-detail-back" type="button">Check</button>
      </div>
    </div>
  `;
  grid.appendChild(detail);

  function pressFeedback(tile) {
    tile.classList.remove("is-pressing");
    void tile.offsetWidth;
    tile.classList.add("is-pressing");
  }

  function enterRoles(tile) {
    sourceTile = tile;
    let n = 0;
    grid.querySelectorAll(".logo-tile").forEach((t) => {
      const isSource = t === tile;
      t.classList.toggle("is-source", isSource);
      t.setAttribute("aria-expanded", String(isSource));
      if (isSource) return;
      const role = buildRole(n);
      n += 1;
      t.dataset.roleTitle = role.title;
      t.dataset.roleCity = role.city;
      t.dataset.roleLocation = role.location;
      t.dataset.roleGrade = role.grade;
      t.dataset.roleDeadline = role.deadline;
      const titleEl = t.querySelector(".role-title");
      const locEl = t.querySelector(".role-loc");
      const gradeEl = t.querySelector(".role-grade");
      if (titleEl) titleEl.textContent = role.title;
      if (locEl) locEl.textContent = role.city;
      if (gradeEl) gradeEl.textContent = role.grade;
    });

    grid.classList.add("is-roles");
    section.classList.add("roles-active");
    if (contextEl) contextEl.textContent = "Roles at " + (tile.dataset.org || "");
  }

  function exitRoles() {
    closeDetail();
    if (!section.classList.contains("roles-active")) return;
    grid.classList.remove("is-roles");
    section.classList.remove("roles-active");
    if (sourceTile) {
      sourceTile.classList.remove("is-source");
      sourceTile.setAttribute("aria-expanded", "false");
    }
    if (contextEl) contextEl.textContent = "";
    sourceTile = null;
  }

  function openDetail(tile) {
    detail.querySelector(".role-detail-org").textContent =
      (sourceTile && sourceTile.dataset.mark) || "";
    detail.querySelector(".role-detail-title").textContent = tile.dataset.roleTitle || "";
    detail.querySelector(".rd-level").textContent = tile.dataset.roleGrade || "";
    detail.querySelector(".rd-location").textContent = tile.dataset.roleLocation || "";
    detail.querySelector(".rd-deadline").textContent = tile.dataset.roleDeadline || "";

    const gap = parseFloat(getComputedStyle(grid).columnGap) || 14;
    const gridW = grid.clientWidth;
    const gridH = grid.offsetHeight;
    const cardW = tile.offsetWidth;
    const cardH = tile.offsetHeight;
    const cardLeft = tile.offsetLeft;
    const cardTop = tile.offsetTop;

    const finalW = Math.min(cardW * 2 + gap, gridW);
    const finalH = cardH * 2 + gap;
    const finalLeft = Math.min(cardLeft, Math.max(0, gridW - finalW));
    const finalTop = Math.min(cardTop, Math.max(0, gridH - finalH));

    detail.style.left = finalLeft + "px";
    detail.style.top = finalTop + "px";
    detail.style.width = finalW + "px";
    detail.style.height = finalH + "px";
    detail.hidden = false;

    grid.classList.add("detail-open");
    section.classList.add("detail-active");
    if (window.lucide) window.lucide.createIcons();

    if (reduceMotion) {
      detail.style.transform = "none";
      detail.style.opacity = "1";
      return;
    }

    const dx = cardLeft - finalLeft;
    const dy = cardTop - finalTop;
    const sx = cardW / finalW;
    const sy = cardH / finalH;
    detail.style.transformOrigin = "top left";
    detail.style.transition = "none";
    detail.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    detail.style.opacity = "0";
    requestAnimationFrame(() => {
      detail.style.transition =
        "transform 460ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease";
      detail.style.transform = "translate(0, 0) scale(1, 1)";
      detail.style.opacity = "1";
    });
  }

  function closeDetail() {
    if (!section.classList.contains("detail-active")) return;
    grid.classList.remove("detail-open");
    section.classList.remove("detail-active");
    if (reduceMotion) {
      detail.hidden = true;
      return;
    }
    detail.style.transition = "transform 280ms ease, opacity 200ms ease";
    detail.style.transform = "scale(0.96)";
    detail.style.opacity = "0";
    window.setTimeout(() => {
      if (!section.classList.contains("detail-active")) {
        detail.hidden = true;
        detail.style.transform = "";
      }
    }, 220);
  }

  grid.addEventListener("click", (event) => {
    if (event.target.closest(".role-detail")) return;
    const tile = event.target.closest(".logo-tile");
    if (!tile) return;
    event.stopPropagation();
    pressFeedback(tile);

    if (!grid.classList.contains("is-roles")) {
      enterRoles(tile);
    } else if (tile === sourceTile) {
      exitRoles();
    } else if (section.classList.contains("detail-active")) {
      closeDetail();
    } else {
      openDetail(tile);
    }
  });

  grid.addEventListener("animationend", (event) => {
    if (event.animationName === "tile-press") {
      const tile = event.target.closest(".logo-tile");
      if (tile) tile.classList.remove("is-pressing");
    }
  });

  detail.querySelector(".role-detail-close").addEventListener("click", closeDetail);
  detail.querySelector(".role-detail-back").addEventListener("click", closeDetail);
  if (backBtn) backBtn.addEventListener("click", exitRoles);

  document.addEventListener("click", (event) => {
    if (section.classList.contains("detail-active")) {
      if (!event.target.closest(".role-detail")) closeDetail();
      return;
    }
    if (!section.classList.contains("roles-active")) return;
    if (event.target.closest(".logo-grid") || event.target.closest(".coverage-toolbar")) {
      return;
    }
    exitRoles();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (section.classList.contains("detail-active")) closeDetail();
    else exitRoles();
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Hero: the upload→signal→orbit timeline is scrubbed by scroll position ----
const HERO_MS = 10000;
const HERO_SCRUB_END = 0.5;
const ROLES_START = 0.6;
const EMAIL_START = 0.82;
// Scrub starts a touch in, so progress 0 already shows the resume + upload
// button (the very first frames are an intro fade we skip past).
const HERO_START = 700;
const introEl = document.querySelector(".intro-hero");
const introCard = document.querySelector(".intro-card");
const heroEl = document.querySelector(".hero-pin");
const heroTimelineEl = document.querySelector(".screen-upload");
const storyTitle = document.querySelector("#story-title");
const storyCopy = document.querySelector("#story-copy");
const progressDots = Array.from(document.querySelectorAll(".story-progress span"));
// These loop on their own (shimmer / bob) and must not be pinned to scroll.
const FREE_RUNNING = new Set(["wave-bounce", "bubble-idle"]);
let heroAnims = [];
let activeDeckIndex = -1;
let segmentAnimating = false;
let segmentFrame = 0;
let segmentLastWheel = 0;
let touchStartY = 0;
let touchStartX = 0;
let touchStartAt = 0;

function collectHeroAnims() {
  heroAnims = document.getAnimations().filter((a) => {
    const target = a.effect && a.effect.target;
    return (
      target &&
      heroTimelineEl &&
      heroTimelineEl.contains(target) &&
      !FREE_RUNNING.has(a.animationName)
    );
  });
  heroAnims.forEach((a) => {
    try {
      a.pause();
    } catch (e) {}
  });
}

function heroProgress() {
  const rect = heroEl.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  return Math.min(1, Math.max(0, -rect.top / scrollable));
}

function easeProgress(t) {
  return t * t * (3 - 2 * t);
}

function applyScrub(p) {
  const localHeroProgress = easeProgress(Math.min(1, p / HERO_SCRUB_END));
  const time = HERO_START + localHeroProgress * (HERO_MS - HERO_START);
  for (const a of heroAnims) {
    try {
      a.currentTime = time;
    } catch (e) {}
  }

  heroEl.classList.toggle("cue-hidden", p > 0.04);

  const idx = p < ROLES_START ? 0 : p < EMAIL_START ? 1 : 2;
  if (idx !== activeDeckIndex) {
    activeDeckIndex = idx;
    const state = storyStates[idx];
    heroEl.dataset.active = String(idx);
    heroEl.dataset.deckPhase = state.phase;
    storyTitle.textContent = state.title;
    storyCopy.textContent = state.copy;
    progressDots.forEach((dot, i) => dot.classList.toggle("is-active", i === idx));
  }
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    applyScrub(heroProgress());
    ticking = false;
  });
}

function setupHero() {
  if (!heroEl) return;
  collectHeroAnims();
  if (reduceMotion) {
    applyScrub(1);
    return;
  }
  applyScrub(heroProgress());
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function setupIntro() {
  if (!introEl || reduceMotion) return;
  introEl.classList.add("segment-ready");
}

// ---- Segment navigation: one wheel/key gesture moves one screen at readable speed ----
function heroScrollable() {
  if (!heroEl) return 1;
  return Math.max(1, heroEl.offsetHeight - window.innerHeight);
}

function getSectionTop(selector) {
  const el = document.querySelector(selector);
  return el ? el.offsetTop : document.documentElement.scrollHeight;
}

function segmentTargets() {
  if (!heroEl) return [0];
  const heroTop = heroEl.offsetTop;
  const heroRange = heroScrollable();
  return [
    0,
    heroTop + heroRange * 0.5,
    heroTop + heroRange * 0.68,
    heroTop + heroRange * 0.88,
    getSectionTop("#coverage"),
    getSectionTop("#signin"),
  ].map((top) => Math.max(0, Math.round(top)));
}

function nearestSegmentIndex() {
  const y = window.scrollY;
  const targets = segmentTargets();
  let best = 0;
  let bestDistance = Infinity;
  targets.forEach((top, index) => {
    const distance = Math.abs(y - top);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function animateSegmentScroll(targetTop, duration = 1650) {
  window.cancelAnimationFrame(segmentFrame);
  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const start = performance.now();

  return new Promise((resolve) => {
    const frame = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      window.scrollTo(0, startTop + distance * eased);
      applyScrub(heroProgress());

      if (t < 1) {
        segmentFrame = window.requestAnimationFrame(frame);
      } else {
        window.scrollTo(0, targetTop);
        applyScrub(heroProgress());
        resolve();
      }
    };
    segmentFrame = window.requestAnimationFrame(frame);
  });
}

async function goToSegment(index) {
  if (segmentAnimating || reduceMotion) return;
  const targets = segmentTargets();
  const nextIndex = Math.max(0, Math.min(targets.length - 1, index));
  const targetTop = targets[nextIndex];
  if (Math.abs(window.scrollY - targetTop) < 2) return;

  segmentAnimating = true;
  document.documentElement.classList.add("segment-animating");
  const duration = nextIndex === 0 ? 1300 : nextIndex === 1 ? 2200 : 1800;
  await animateSegmentScroll(targetTop, duration);
  await wait(nextIndex >= 1 && nextIndex <= 3 ? 720 : 180);
  document.documentElement.classList.remove("segment-animating");
  segmentAnimating = false;
}

function stepSegment(direction) {
  if (segmentAnimating || reduceMotion) return;
  const current = nearestSegmentIndex();
  goToSegment(current + direction);
}

function shouldSegmentWheel(direction) {
  if (!heroEl) return false;
  const coverageTop = getSectionTop("#coverage");
  const y = window.scrollY;
  if (y < coverageTop - 8) return true;
  return direction < 0 && y <= coverageTop + 40;
}

function onSegmentWheel(event) {
  if (reduceMotion || Math.abs(event.deltaY) < 8) return;
  const direction = event.deltaY > 0 ? 1 : -1;
  if (!shouldSegmentWheel(direction)) return;

  event.preventDefault();
  if (segmentAnimating) return;

  const now = performance.now();
  if (now - segmentLastWheel < 360) return;
  segmentLastWheel = now;
  stepSegment(direction);
}

function onSegmentKey(event) {
  if (reduceMotion) return;
  const forwardKeys = new Set(["Space", "ArrowDown", "PageDown"]);
  const backwardKeys = new Set(["ArrowUp", "PageUp"]);
  if (!forwardKeys.has(event.code) && !backwardKeys.has(event.code)) return;

  const target = event.target;
  const isTyping =
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable);
  if (isTyping) return;

  event.preventDefault();
  if (segmentAnimating) return;
  stepSegment(backwardKeys.has(event.code) || event.shiftKey ? -1 : 1);
}

function onTouchStart(event) {
  if (reduceMotion || !event.touches || event.touches.length !== 1) return;
  touchStartY = event.touches[0].clientY;
  touchStartX = event.touches[0].clientX;
  touchStartAt = performance.now();
}

function onTouchEnd(event) {
  if (reduceMotion || segmentAnimating || !event.changedTouches || event.changedTouches.length !== 1) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaY = touchStartY - touch.clientY;
  const deltaX = touchStartX - touch.clientX;
  const elapsed = performance.now() - touchStartAt;
  if (Math.abs(deltaY) < 48 || Math.abs(deltaY) < Math.abs(deltaX) * 1.4 || elapsed > 900) return;

  const direction = deltaY > 0 ? 1 : -1;
  if (shouldSegmentWheel(direction)) {
    stepSegment(direction);
  }
}

function setupSegmentNavigation() {
  if (reduceMotion) return;
  window.addEventListener("wheel", onSegmentWheel, { passive: false });
  window.addEventListener("keydown", onSegmentKey);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
}

// ---- Sections fade/slide in the first time they enter the viewport ----
function setupReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (reduceMotion) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );
  items.forEach((el) => io.observe(el));
}

function scrollToHashTarget() {
  if (!location.hash || location.hash.length <= 1) return;
  const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) {
    requestAnimationFrame(() => target.scrollIntoView());
  }
}

document.documentElement.classList.add("js");
renderOrganizations();
renderIcons();
setupCoverage();
setupIntro();
setupHero();
setupSegmentNavigation();
setupReveal();
scrollToHashTarget();
window.addEventListener("hashchange", scrollToHashTarget);
