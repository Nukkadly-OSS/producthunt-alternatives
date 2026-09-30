const catalogs = {
  access: [
    { value: "all", label: "All" },
    { value: "Free", label: "Free" },
    { value: "Free option", label: "Free option" },
    { value: "Paid", label: "Paid" },
    { value: "n/a", label: "n/a" }
  ],
  linkType: [
    { value: "all", label: "All" },
    { value: "Dofollow", label: "Dofollow" },
    { value: "Nofollow", label: "Nofollow" },
    { value: "Unknown", label: "Unknown" }
  ],
  dr: [
    { value: "all", label: "All" },
    { value: "rated", label: "Has DR" },
    { value: "unrated", label: "No DR" }
  ],
  sort: [
    { value: "name-asc", label: "Name A to Z" },
    { value: "name-desc", label: "Name Z to A" },
    { value: "dr-desc", label: "DR high" },
    { value: "dr-asc", label: "DR low" }
  ]
};

const instances = new Map();

function optionLabel(name, value) {
  return catalogs[name].find((option) => option.value === value)?.label || value;
}

function checkMark() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "dir-menu-check");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("d", "M4.5 10.25 8 13.75l7.5-7.5");
  svg.append(path);
  return svg;
}

function closeAll(except) {
  instances.forEach((instance) => {
    if (instance !== except) instance.close();
  });
}

export function setDropdownValue(name, value) {
  instances.get(name)?.setValue(value, false);
}

export function bindDropdowns(onChange) {
  document.querySelectorAll("[data-dropdown]").forEach((root) => {
    const name = root.dataset.dropdown;
    const options = catalogs[name];
    const trigger = root.querySelector(".dir-dropdown-trigger");
    const valueNode = root.querySelector(".dir-dropdown-value");
    const menu = document.createElement("div");
    menu.className = "dir-menu";
    menu.id = `${name}-menu`;
    menu.hidden = true;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("tabindex", "-1");
    trigger.setAttribute("aria-controls", menu.id);
    root.append(menu);

    let activeIndex = 0;

    function value() {
      return trigger.dataset.value;
    }

    function selectedIndex() {
      const index = options.findIndex((option) => option.value === value());
      return index < 0 ? 0 : index;
    }

    function paint() {
      const current = value();
      menu.replaceChildren(
        ...options.map((option, index) => {
          const item = document.createElement("div");
          item.className = "dir-menu-item";
          item.id = `${name}-option-${index}`;
          item.setAttribute("role", "option");
          item.dataset.value = option.value;
          item.setAttribute("aria-selected", option.value === current ? "true" : "false");
          const label = document.createElement("span");
          label.textContent = option.label;
          item.append(label);
          if (option.value === current) item.append(checkMark());
          item.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            choose(option.value);
          });
          return item;
        })
      );
      syncActive();
    }

    function syncActive() {
      const items = [...menu.children];
      items.forEach((item, index) => {
        item.toggleAttribute("data-active", index === activeIndex);
      });
      const active = items[activeIndex];
      if (active) menu.setAttribute("aria-activedescendant", active.id);
    }

    function setValue(next, emit) {
      trigger.dataset.value = next;
      valueNode.textContent = optionLabel(name, next);
      paint();
      if (emit) onChange(name, next);
      else close();
    }

    function close() {
      if (menu.hidden) return;
      menu.hidden = true;
      root.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function open() {
      closeAll(instance);
      menu.hidden = false;
      root.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      activeIndex = selectedIndex();
      paint();
    }

    function choose(next) {
      setValue(next, true);
      close();
      trigger.focus();
    }

    const instance = { close, setValue };
    instances.set(name, instance);

    trigger.addEventListener("click", () => {
      if (menu.hidden) open();
      else close();
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (menu.hidden) open();
        else if (event.key === "Enter" || event.key === " ") choose(options[activeIndex].value);
        else {
          activeIndex = Math.min(options.length - 1, activeIndex + 1);
          syncActive();
        }
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (menu.hidden) open();
        else {
          activeIndex = Math.max(0, activeIndex - 1);
          syncActive();
        }
      }
      if (event.key === "Home") {
        event.preventDefault();
        activeIndex = 0;
        if (!menu.hidden) syncActive();
      }
      if (event.key === "End") {
        event.preventDefault();
        activeIndex = options.length - 1;
        if (!menu.hidden) syncActive();
      }
      if (event.key === "Escape") {
        close();
      }
    });

    paint();
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-dropdown]")) return;
    closeAll();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
}
