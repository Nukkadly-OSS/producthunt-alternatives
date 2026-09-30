export function currentTheme() {
  return document.body.dataset.theme === "dark" ? "dark" : "light";
}

function themeButtons() {
  return document.querySelectorAll("[data-theme-toggle]");
}

export function applyTheme(theme) {
  const themeColor = document.querySelector("meta[name='theme-color']");
  document.body.dataset.theme = theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.directoryTheme = theme;
  const next = theme === "dark" ? "light" : "dark";
  themeButtons().forEach((button) => {
    button.setAttribute("aria-label", `Switch to ${next} mode`);
  });
  if (themeColor) themeColor.content = theme === "dark" ? "#000000" : "#ffffff";
}

export function initThemeControls() {
  applyTheme(currentTheme());
  themeButtons().forEach((button) => {
    button.addEventListener("click", () => {
      const theme = currentTheme() === "dark" ? "light" : "dark";
      localStorage.setItem("directory-theme", theme);
      applyTheme(theme);
    });
  });
}
