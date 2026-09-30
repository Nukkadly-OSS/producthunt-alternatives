import { githubRepo } from "./site-config.js";

const paths = {
  root: "",
  contributing: "/blob/main/CONTRIBUTING.md",
  submit: "/issues/new?template=submit-a-platform.yml",
  update: "/issues/new?template=update-a-listing.yml",
  inactive: "/issues/new?template=report-inactive.yml",
  editJson: "/edit/main/data/platforms.json"
};

export function bindGitHubLinks() {
  const base = String(githubRepo || "").replace(/\/$/, "");

  document.querySelectorAll("[data-github]").forEach((el) => {
    const path = paths[el.getAttribute("data-github")];
    if (path === undefined) return;

    el.addEventListener("click", (event) => {
      if (!base) event.preventDefault();
    });

    if (!base) {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.tabIndex = -1;
      return;
    }

    el.href = `${base}${path}`;
    el.removeAttribute("aria-disabled");
    el.tabIndex = 0;
  });
}
