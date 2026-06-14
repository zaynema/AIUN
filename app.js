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
    title: "Start privately.",
    copy:
      "Upload your resume once. We read it privately, keep the useful signals, and delete the file.",
    phase: "upload",
  },
  {
    title: "Fresh roles, ranked.",
    copy:
      "We scan new openings each week, then rank them by fit so the best ones rise first.",
    phase: "roles",
  },
  {
    title: "Open the weekly email.",
    copy:
      "Tap the top recommendation and it opens into a weekly email with direct application links.",
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
const HERO_MS = 8000;
const HERO_SCRUB_END = 0.34;
const ROLES_START = 0.56;
const EMAIL_START = 0.78;
const STORY_STOPS = [0, HERO_SCRUB_END, ROLES_START, EMAIL_START, 1];
// Scrub starts a touch in, so progress 0 already shows the resume + upload
// button (the very first frames are an intro fade we skip past).
const HERO_START = 700;
const heroEl = document.querySelector(".hero-pin");
const heroTimelineEl = document.querySelector(".screen-upload");
const storyTitle = document.querySelector("#story-title");
const storyCopy = document.querySelector("#story-copy");
const progressDots = Array.from(document.querySelectorAll(".story-progress span"));
// These loop on their own (shimmer / bob) and must not be pinned to scroll.
const FREE_RUNNING = new Set(["wave-bounce"]);
let heroAnims = [];
let activeDeckIndex = -1;
let segmentScrollLockedUntil = 0;

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

function heroScrollTopForProgress(p) {
  const scrollable = Math.max(1, heroEl.offsetHeight - window.innerHeight);
  return heroEl.offsetTop + scrollable * p;
}

function wheelDeltaPixels(event) {
  if (event.deltaMode === 1) return event.deltaY * 18;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function storySegmentBounds(p, direction) {
  const epsilon = 0.003;
  if (direction > 0) {
    const upperIndex = STORY_STOPS.findIndex((stop) => stop > p + epsilon);
    const safeUpperIndex = upperIndex === -1 ? STORY_STOPS.length - 1 : upperIndex;
    return {
      lower: STORY_STOPS[Math.max(0, safeUpperIndex - 1)],
      upper: STORY_STOPS[safeUpperIndex],
    };
  }

  let lowerIndex = 0;
  for (let i = STORY_STOPS.length - 1; i >= 0; i -= 1) {
    if (STORY_STOPS[i] < p - epsilon) {
      lowerIndex = i;
      break;
    }
  }
  return {
    lower: STORY_STOPS[lowerIndex],
    upper: STORY_STOPS[Math.min(STORY_STOPS.length - 1, lowerIndex + 1)],
  };
}

function applyScrub(p) {
  const localHeroProgress = easeProgress(Math.min(1, p / HERO_SCRUB_END));
  const time = HERO_START + localHeroProgress * (HERO_MS - HERO_START);
  for (const a of heroAnims) {
    try {
      a.currentTime = time;
    } catch (e) {}
  }

  const idx = p < ROLES_START ? 0 : p < EMAIL_START ? 1 : 2;
  if (idx !== activeDeckIndex) {
    activeDeckIndex = idx;
    const state = storyStates[idx];
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

function onHeroWheel(event) {
  if (!heroEl || reduceMotion) return;
  const direction = Math.sign(event.deltaY);
  if (direction === 0) return;

  const rect = heroEl.getBoundingClientRect();
  const withinHero = rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
  if (!withinHero) return;

  if (performance.now() < segmentScrollLockedUntil) {
    event.preventDefault();
    return;
  }

  const p = heroProgress();
  if ((direction < 0 && p <= 0.01) || (direction > 0 && p >= 0.995)) return;

  const scrollable = Math.max(1, heroEl.offsetHeight - window.innerHeight);
  const { lower, upper } = storySegmentBounds(p, direction);
  const wheelFriction = 0.78;
  const nextP = p + (wheelDeltaPixels(event) * wheelFriction) / scrollable;
  const clampedP = Math.min(upper, Math.max(lower, nextP));
  const hitSegmentEdge = clampedP !== nextP;

  event.preventDefault();
  window.scrollTo({ top: heroScrollTopForProgress(clampedP), behavior: "auto" });
  applyScrub(clampedP);

  if (hitSegmentEdge) {
    segmentScrollLockedUntil = performance.now() + 420;
  }
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
  window.addEventListener("wheel", onHeroWheel, { passive: false });
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
setupHero();
setupReveal();
scrollToHashTarget();
window.addEventListener("hashchange", scrollToHashTarget);
