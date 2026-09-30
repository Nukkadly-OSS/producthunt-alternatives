import { initThemeControls } from "./theme.js";
import { bindGitHubLinks } from "./github-links.js";
import { bindDropdowns, setDropdownValue } from "./dropdown.js";

const platformsUrl = `${import.meta.env.BASE_URL}data/platforms.json`;

const categoryDescriptions = {
  "Launch platforms": "Ranked or scheduled product launches.",
  "Founder communities": "Share work and get feedback.",
  "Evergreen directories": "Listings that stay discoverable.",
  "Developer launches": "Technical audiences and developer tools.",
  "Regional platforms": "Startup directories for a region.",
  "Review sites": "Software comparison and review listings.",
  "AI directories": "Directories focused on AI tools.",
  "Press": "Technology press that still takes startup pitches."
};

const state = {
  platforms: [],
  categories: [],
  category: "all",
  query: "",
  access: "all",
  linkType: "all",
  dr: "all",
  sort: "name-asc"
};

const categoryNav = document.querySelector("#category-nav");
const directory = document.querySelector("#directory");
const queryInput = document.querySelector("#query");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const listPane = document.querySelector(".dir-main");

function slug(category) {
  return `section-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function faviconUrl(url) {
  try {
    return new URL("/favicon.ico", url).href;
  } catch {
    return "";
  }
}

function visiblePlatforms() {
  const query = state.query.trim().toLowerCase();
  return state.platforms.filter((platform) => {
    const inCategory = state.category === "all" || platform.category === state.category;
    const access = platform.access || "n/a";
    const linkType = platform.linkType || "Unknown";
    const rated = Number.isFinite(platform.domainRating);
    if (state.access !== "all" && access !== state.access) return false;
    if (state.linkType !== "all" && linkType !== state.linkType) return false;
    if (state.dr === "rated" && !rated) return false;
    if (state.dr === "unrated" && rated) return false;
    const text = [
      platform.name,
      platform.description,
      platform.bestFor,
      access,
      ...(platform.tags || [])
    ]
      .join(" ")
      .toLowerCase();
    return inCategory && (!query || text.includes(query));
  });
}

function sortPlatforms(platforms) {
  const ranked = (platform) => (Number.isFinite(platform.domainRating) ? platform.domainRating : null);
  return [...platforms].sort((a, b) => {
    if (state.sort === "name-desc") return b.name.localeCompare(a.name);
    if (state.sort === "dr-desc" || state.sort === "dr-asc") {
      const left = ranked(a);
      const right = ranked(b);
      if (left === null && right === null) return a.name.localeCompare(b.name);
      if (left === null) return 1;
      if (right === null) return -1;
      return state.sort === "dr-desc" ? right - left : left - right;
    }
    return a.name.localeCompare(b.name);
  });
}

function navButton(category, count) {
  const isAll = category === "all";
  const item = document.createElement("a");
  item.className = "dir-nav-item";
  item.href = isAll ? "#directory" : `#${slug(category)}`;
  if (state.category === category) item.setAttribute("aria-current", "page");

  const label = document.createElement("span");
  label.className = "dir-caption dir-nav-label";
  label.textContent = isAll ? "All" : category;
  const value = document.createElement("span");
  value.className = "dir-meta dir-numeric dir-nav-count";
  value.textContent = String(count);

  item.append(label, value);
  item.addEventListener("click", (event) => {
    event.preventDefault();
    state.category = category;
    render();
    if (isAll) {
      listPane.scrollTop = 0;
      return;
    }
    document.querySelector(`#${slug(category)}`)?.scrollIntoView({ block: "start" });
  });
  return item;
}

function renderNavigation() {
  const counts = new Map();
  state.platforms.forEach((platform) => counts.set(platform.category, (counts.get(platform.category) || 0) + 1));

  categoryNav.replaceChildren(
    navButton("all", state.platforms.length),
    ...state.categories.map((category) => navButton(category, counts.get(category) || 0))
  );
}

function platformRow(platform) {
  const item = document.createElement("li");
  item.className = "dir-row";

  const nameCell = document.createElement("div");
  nameCell.className = "dir-name-cell";

  const faviconWrap = document.createElement("span");
  faviconWrap.className = "dir-favicon-wrap";
  faviconWrap.setAttribute("aria-hidden", "true");
  faviconWrap.textContent = platform.name.trim().slice(0, 1).toUpperCase() || "?";

  const favicon = document.createElement("img");
  favicon.className = "dir-favicon";
  favicon.src = faviconUrl(platform.url);
  favicon.alt = "";
  favicon.width = 32;
  favicon.height = 32;
  favicon.loading = "lazy";
  favicon.decoding = "async";
  favicon.referrerPolicy = "no-referrer";
  favicon.addEventListener("error", () => {
    favicon.hidden = true;
  });
  if (!favicon.src) favicon.hidden = true;
  faviconWrap.append(favicon);

  const name = document.createElement("a");
  name.className = "dir-name";
  name.href = platform.url;
  name.target = "_blank";
  name.rel = "noopener noreferrer";
  name.textContent = platform.name;
  nameCell.append(faviconWrap, name);

  const description = document.createElement("p");
  description.textContent = platform.description;

  const access = document.createElement("span");
  access.className = "dir-meta dir-stat";
  access.textContent = platform.access || "n/a";

  const link = document.createElement("span");
  link.className = "dir-meta dir-stat";
  link.textContent = platform.linkType || "Unknown";

  const rating = document.createElement("span");
  rating.className = "dir-meta dir-numeric dir-stat";
  rating.textContent = Number.isFinite(platform.domainRating) ? String(platform.domainRating) : "n/a";

  item.append(nameCell, description, access, link, rating);
  return item;
}

function columnRow() {
  const item = document.createElement("li");
  item.className = "dir-cols";
  item.setAttribute("aria-hidden", "true");
  const labels = [
    ["Name", "dir-meta"],
    ["Description", "dir-meta"],
    ["Access", "dir-meta"],
    ["Link", "dir-meta"],
    ["DR", "dir-meta dir-numeric"]
  ];
  for (const [text, className] of labels) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    item.append(span);
  }
  return item;
}

function categorySection(category, platforms) {
  const section = document.createElement("section");
  section.className = "dir-section";
  section.id = slug(category);

  const head = document.createElement("div");
  head.className = "dir-section-head";

  const heading = document.createElement("h2");
  heading.className = "dir-heading-20";
  heading.textContent = category;

  const detail = document.createElement("p");
  detail.className = "dir-caption";
  detail.textContent = categoryDescriptions[category] || "";

  head.append(heading, detail);

  const list = document.createElement("ul");
  list.className = "dir-list";
  list.append(columnRow(), ...sortPlatforms(platforms).map(platformRow));

  section.append(head, list);
  return section;
}

function renderDirectory() {
  const visible = visiblePlatforms();
  const grouped = new Map();
  visible.forEach((platform) => {
    if (!grouped.has(platform.category)) grouped.set(platform.category, []);
    grouped.get(platform.category).push(platform);
  });

  const fragment = document.createDocumentFragment();
  state.categories.forEach((category) => {
    const platforms = grouped.get(category);
    if (!platforms?.length) return;
    fragment.append(categorySection(category, platforms));
  });

  directory.replaceChildren(fragment);
  directory.hidden = visible.length === 0;
  emptyState.hidden = visible.length > 0;
  resultCount.textContent = `${visible.length}`;
}

function render() {
  renderNavigation();
  renderDirectory();
}

async function loadDirectory() {
  try {
    const response = await fetch(platformsUrl);
    if (!response.ok) throw new Error(`Could not load data: ${response.status}`);
    const data = await response.json();
    state.platforms = data.platforms;
    state.categories = data.categories;
    document.querySelector("#raw-data-link").href = platformsUrl;
    render();
  } catch (error) {
    resultCount.textContent = "Unavailable";
    emptyState.hidden = false;
    emptyState.querySelector("p").textContent = "The list could not be loaded.";
    document.querySelector("#clear-button").hidden = true;
    console.error(error);
  }
}

document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
document.querySelector("#clear-button").addEventListener("click", () => {
  state.query = "";
  state.category = "all";
  state.access = "all";
  state.linkType = "all";
  state.dr = "all";
  state.sort = "name-asc";
  queryInput.value = "";
  setDropdownValue("access", "all");
  setDropdownValue("linkType", "all");
  setDropdownValue("dr", "all");
  setDropdownValue("sort", "name-asc");
  render();
});
queryInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});
document.addEventListener("keydown", (event) => {
  if (event.target.closest("[data-dropdown]")) return;
  if (event.key === "/" && !event.target.matches("input, textarea, select, button")) {
    event.preventDefault();
    queryInput.focus();
  }
});

initThemeControls();
bindGitHubLinks();
bindDropdowns((name, value) => {
  state[name] = value;
  render();
});
loadDirectory();
