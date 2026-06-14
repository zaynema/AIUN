const organizations = [
  ["United Nations", "UN"],
  ["United Nations Children's Fund", "UNICEF"],
  ["United Nations Development Programme", "UNDP"],
  ["UN Refugee Agency", "UNHCR"],
  ["World Food Programme", "WFP"],
  ["World Health Organization", "WHO"],
  ["Food and Agriculture Organization", "FAO"],
  ["UNESCO", "UNESCO"],
  ["International Labour Organization", "ILO"],
  ["United Nations Population Fund", "UNFPA"],
  ["UN Women", "UN Women"],
  ["United Nations Industrial Development Organization", "UNIDO"],
  ["International Atomic Energy Agency", "IAEA"],
  ["World Meteorological Organization", "WMO"],
  ["International Telecommunication Union", "ITU"],
  ["International Maritime Organization", "IMO"],
  ["International Civil Aviation Organization", "ICAO"],
  ["World Intellectual Property Organization", "WIPO"],
  ["UNOPS", "UNOPS"],
  ["United Nations Volunteers", "UNV"],
  ["United Nations International Computing Centre", "UNICC"],
  ["United Nations University", "UNU"],
  ["UN Institute for Training and Research", "UNITAR"],
  ["World Bank Group", "World Bank"],
  ["International Monetary Fund", "IMF"],
  ["Asian Development Bank", "ADB"],
  ["Asian Infrastructure Investment Bank", "AIIB"],
  ["European Bank for Reconstruction and Development", "EBRD"],
  ["Inter-American Development Bank", "IDB"],
  ["New Development Bank", "NDB"],
  ["European Union", "EU"],
  ["African Union", "AU"],
  ["Association of Southeast Asian Nations", "ASEAN"],
  ["Organisation for Economic Co-operation and Development", "OECD"],
  ["Organization for Security and Co-operation in Europe", "OSCE"],
  ["Council of Europe", "Council of Europe"],
  ["International Energy Agency", "IEA"],
  ["International Union for Conservation of Nature", "IUCN"],
  ["International Fund for Agricultural Development", "IFAD"],
  ["World Trade Organization", "WTO"],
];

const storyStates = [
  {
    title: "Upload once, privately.",
    copy:
      "Share your resume once. We keep only the useful competency signals, then delete the file.",
    phase: "upload",
  },
  {
    title: "Fresh matches, not more noise.",
    copy:
      "Each week, we compare new openings with your signals and bring the strongest fits forward.",
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
      ([name, acronym]) => `
        <div class="logo-tile" title="${name}" aria-label="${name}">
          <span class="logo-wordmark" aria-hidden="true">${acronym}</span>
        </div>
      `,
    )
    .join("");
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Hero: the upload→signal→orbit timeline is scrubbed by scroll position ----
const HERO_MS = 10000;
const HERO_SCRUB_END = 0.36;
const ROLES_START = 0.44;
const EMAIL_START = 0.72;
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
    heroTop + heroRange * 0.32,
    heroTop + heroRange * 0.5,
    heroTop + heroRange * 0.78,
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
setupIntro();
setupHero();
setupSegmentNavigation();
setupReveal();
scrollToHashTarget();
window.addEventListener("hashchange", scrollToHashTarget);
