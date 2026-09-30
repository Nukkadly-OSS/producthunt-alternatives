export function currentTheme() {
  return document.body.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  const themeButton = document.querySelector("#theme-button");
  const themeColor = document.querySelector("meta[name='theme-color']");
  document.body.dataset.theme = theme;
  document.documentElement.dataset.directoryTheme = theme;
  const next = theme === "dark" ? "light" : "dark";
  if (themeButton) themeButton.setAttribute("aria-label", `Switch to ${next} mode`);
  if (themeColor) themeColor.content = theme === "dark" ? "#000000" : "#ffffff";
}

export function initThemeControls() {
  const themeButton = document.querySelector("#theme-button");
  applyTheme(currentTheme());
  themeButton?.addEventListener("click", () => {
    const theme = currentTheme() === "dark" ? "light" : "dark";
    localStorage.setItem("directory-theme", theme);
    applyTheme(theme);
  });
}
