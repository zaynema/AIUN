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
const FREE_RUNNING = new Set(["wave-bounce"]);
let heroAnims = [];
let activeDeckIndex = -1;
let introTransitionActive = false;
let introTransitionFallback = 0;
let introLastScrollY = window.scrollY;

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
    heroEl.dataset.deckPhase = state.phase;
    storyTitle.textContent = state.title;
    storyCopy.textContent = state.copy;
    progressDots.forEach((dot, i) => dot.classList.toggle("is-active", i === idx));
  }
}

// ---- Intro: first scroll triggers a smooth landing-page transition into the hero ----
function completeIntroTransition() {
  if (!introTransitionActive) return;
  window.clearTimeout(introTransitionFallback);
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("intro-transitioning");
    heroEl.classList.remove("hero-arriving");
    introEl.classList.remove("intro-exit", "cue-hidden");
    introTransitionActive = false;
    applyScrub(heroProgress());
  });
}

function playIntroTransition() {
  if (!introEl || !introCard || !heroEl || introTransitionActive) return;
  introTransitionActive = true;
  document.documentElement.classList.add("intro-transitioning");
  introEl.classList.add("intro-exit", "cue-hidden");
  heroEl.classList.add("hero-arriving");
  window.scrollTo({ top: heroEl.offsetTop, behavior: "auto" });
  applyScrub(0);
  introCard.addEventListener("animationend", completeIntroTransition, { once: true });
  introTransitionFallback = window.setTimeout(completeIntroTransition, 920);
}

function onIntroWheel(event) {
  if (!introEl || reduceMotion || event.deltaY <= 0) return;
  const rect = introEl.getBoundingClientRect();
  const introActive = rect.top <= 2 && rect.bottom > window.innerHeight * 0.5;
  if (!introActive) return;

  event.preventDefault();
  playIntroTransition();
}

function maybeTriggerIntroFromScroll() {
  if (!introEl || !heroEl || reduceMotion || introTransitionActive) return;
  const scrollingDown = window.scrollY > introLastScrollY;
  const insideIntro = window.scrollY > 12 && window.scrollY < heroEl.offsetTop - 12;
  if (scrollingDown && insideIntro) {
    playIntroTransition();
  }
  introLastScrollY = window.scrollY;
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    maybeTriggerIntroFromScroll();
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
  if (!introEl) return;
  window.addEventListener("wheel", onIntroWheel, { passive: false });
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
setupReveal();
scrollToHashTarget();
window.addEventListener("hashchange", scrollToHashTarget);
