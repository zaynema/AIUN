const storyStates = [
  {
    title: "Start privately.",
    copy:
      "Upload once. We read the resume, keep only job signals, and delete the file.",
  },
  {
    title: "Fresh roles, ranked.",
    copy:
      "We scan new openings each week, then rank them by fit so the best ones rise first.",
  },
  {
    title: "Inbox, with notes.",
    copy:
      "You get the role, the match reason, and a few practical tips before you apply.",
  },
];

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

const storySection = document.querySelector(".apple-story");
const storyTitle = document.querySelector("#story-title");
const storyCopy = document.querySelector("#story-copy");
const screenPanels = Array.from(document.querySelectorAll(".screen-panel"));
const progressDots = Array.from(document.querySelectorAll(".story-progress span"));
let activeStoryIndex = -1;

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setActiveStory(index) {
  if (index === activeStoryIndex) return;
  activeStoryIndex = index;
  storySection.dataset.active = String(index);

  const state = storyStates[index];
  storyTitle.textContent = state.title;
  storyCopy.textContent = state.copy;

  screenPanels.forEach((panel, panelIndex) => {
    panel.classList.toggle("is-active", panelIndex === index);
  });

  progressDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function updateStoryFromScroll() {
  if (window.matchMedia("(max-width: 680px)").matches) {
    setActiveStory(0);
    return;
  }

  const rect = storySection.getBoundingClientRect();
  const scrollable = Math.max(1, rect.height - window.innerHeight);
  const progress = Math.min(0.999, Math.max(0, -rect.top / scrollable));
  setActiveStory(Math.floor(progress * storyStates.length));
}

function renderOrganizations() {
  const logoGrid = document.querySelector("#logo-grid");
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

renderOrganizations();
renderIcons();
setActiveStory(0);
window.addEventListener("scroll", updateStoryFromScroll, { passive: true });
window.addEventListener("resize", updateStoryFromScroll);
