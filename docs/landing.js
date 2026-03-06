const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const root = document.documentElement;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
const themeColorMeta = qs('meta[name="theme-color"]');

const storageKeys = {
  theme: "novapulse.theme",
  accent: "novapulse.accent"
};

const siteHeader = qs("#siteHeader");
const scrollProgress = qs("#scrollProgress");
const menuToggle = qs("#menuToggle");
const nav = qs("#primaryNav");
const themeToggle = qs("#themeToggle");
const commandPalette = qs("#commandPalette");
const commandInput = qs("#commandInput");
const commandList = qs("#commandList");
const cmdButton = qs("#cmdButton");
const timeChip = qs("#timeChip");
const visitorCountEl = qs("#visitorCount");
const engagementScoreEl = qs("#engagementScore");
const teamSizeInput = qs("#teamSize");
const teamSizeValue = qs("#teamSizeValue");
const planPrice = qs("#planPrice");
const planSavings = qs("#planSavings");
const accentContainer = qs("#accentSwatches");
const accentButtons = accentContainer ? qsa(".swatch", accentContainer) : [];
const activityFeed = qs("#activityFeed");
const activityTemplate = qs("#activityTemplate");
const toast = qs("#toast");
const copyEmailButton = qs("#copyEmail");
const shareButton = qs("#shareButton");
const yearEl = qs("#year");

const contactEmail = "hello@novapulse.dev";
const idle = window.requestIdleCallback
  ? window.requestIdleCallback.bind(window)
  : (callback) => setTimeout(callback, 1);

const state = {
  commandIndex: 0,
  visibleCommands: [],
  previousFocus: null,
  explicitThemePreference: false,
  stopLoops: [],
  toastTimer: null,
  toastOpen: false
};

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage write errors.
  }
}

function createLoop(callback, delay) {
  let cancelled = false;
  let timerId = 0;

  const tick = () => {
    if (cancelled) {
      return;
    }
    if (!document.hidden) {
      callback();
    }
    timerId = window.setTimeout(tick, delay);
  };

  timerId = window.setTimeout(tick, delay);
  return () => {
    cancelled = true;
    clearTimeout(timerId);
  };
}

function normalizeTheme(value) {
  return value === "dark" || value === "light" ? value : null;
}

function updateThemeControl(theme) {
  if (!themeToggle) {
    return;
  }
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.textContent = nextTheme === "dark" ? "Dark" : "Light";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
}

function updateThemeColor(theme) {
  if (!themeColorMeta) {
    return;
  }
  themeColorMeta.setAttribute("content", theme === "dark" ? "#080e18" : "#f4f7fc");
}

function applyTheme(theme, options = {}) {
  const { persist = true } = options;
  const normalized = normalizeTheme(theme) || "dark";
  root.dataset.theme = normalized;
  updateThemeControl(normalized);
  updateThemeColor(normalized);

  if (persist) {
    writeStorage(storageKeys.theme, normalized);
    state.explicitThemePreference = true;
  }
}

function toggleTheme() {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  const performToggle = () => applyTheme(nextTheme, { persist: true });
  if (typeof document.startViewTransition === "function" && !reducedMotionQuery.matches) {
    document.startViewTransition(performToggle);
  } else {
    performToggle();
  }
}

function getAccentChoices() {
  return accentButtons.map((button) => button.dataset.accent).filter(Boolean);
}

function normalizeAccent(value) {
  const choices = getAccentChoices();
  if (choices.includes(value)) {
    return value;
  }
  return choices[0] || "#5bf4b3";
}

function applyAccent(color, options = {}) {
  const { persist = true } = options;
  const normalized = normalizeAccent(color);

  root.style.setProperty("--accent", normalized);
  accentButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.accent === normalized);
  });

  if (persist) {
    writeStorage(storageKeys.accent, normalized);
  }
}

function setMenuState(open) {
  if (!nav || !menuToggle) {
    return;
  }
  nav.dataset.open = String(open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Close" : "Menu";
}

function closeMenuIfOutsideClick(event) {
  if (!nav || nav.dataset.open !== "true" || !siteHeader) {
    return;
  }
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }
  if (!siteHeader.contains(target)) {
    setMenuState(false);
  }
}

function updateScrollProgress() {
  if (!scrollProgress) {
    return;
  }
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const ratio = maxScrollable > 0 ? scrollTop / maxScrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
}

function formatCount(value, decimals) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function animateCounter(node) {
  const target = Number(node.dataset.count || 0);
  const decimals = Number(node.dataset.decimals || 0);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    node.textContent = `${prefix}${formatCount(value, decimals)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function updateTimeChip() {
  if (!timeChip) {
    return;
  }

  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const zoneFormatter = new Intl.DateTimeFormat(undefined, {
    timeZoneName: "short"
  });
  const zone = zoneFormatter
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName")?.value || "";

  timeChip.textContent = `${timeFormatter.format(now)} ${zone}`;
}

function discountForSeats(seats) {
  if (seats >= 300) {
    return 0.3;
  }
  if (seats >= 200) {
    return 0.24;
  }
  if (seats >= 120) {
    return 0.18;
  }
  if (seats >= 60) {
    return 0.12;
  }
  return 0.05;
}

function updatePricing() {
  if (!teamSizeInput || !teamSizeValue || !planPrice || !planSavings) {
    return;
  }

  const seats = Number(teamSizeInput.value);
  const unitPrice = 29;
  const discount = discountForSeats(seats);
  const monthlyCost = seats * unitPrice * (1 - discount);
  const annualSavings = monthlyCost * 12 * 0.18;

  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  teamSizeValue.textContent = `${seats} seats`;
  planPrice.textContent = dollars.format(monthlyCost);
  planSavings.textContent = dollars.format(annualSavings);
}

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const activityActors = ["A growth team", "A designer", "A PM", "An engineer", "A startup founder", "A product lead"];
const activityVerbs = ["deployed", "published", "validated", "launched", "optimized", "benchmarked"];
const activityObjects = [
  "a conversion experiment",
  "an onboarding variant",
  "a new landing hero",
  "an AI-assisted funnel",
  "a performance patch",
  "a personalization rule"
];

function buildActivityText() {
  return `${randomPick(activityActors)} ${randomPick(activityVerbs)} ${randomPick(activityObjects)}.`;
}

function appendActivity(text) {
  if (!activityFeed || !activityTemplate) {
    return;
  }

  const fragment = activityTemplate.content.cloneNode(true);
  const item = qs(".activity-item", fragment);
  const textNode = qs(".activity-text", fragment);
  const timeNode = qs(".activity-time", fragment);

  if (!textNode || !timeNode) {
    return;
  }

  textNode.textContent = text;
  timeNode.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  activityFeed.prepend(fragment);

  while (activityFeed.children.length > 7) {
    activityFeed.removeChild(activityFeed.lastElementChild);
  }

  if (!reducedMotionQuery.matches && item) {
    item.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 320,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)"
      }
    );
  }
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  clearTimeout(state.toastTimer);

  if (typeof toast.showPopover === "function") {
    if (!state.toastOpen) {
      try {
        toast.showPopover();
        state.toastOpen = true;
      } catch {
        // Ignore invalid state from unsupported environments.
      }
    }
    state.toastTimer = setTimeout(() => {
      try {
        toast.hidePopover();
      } catch {
        // Ignore.
      }
      state.toastOpen = false;
    }, 1800);
    return;
  }

  toast.classList.add("visible");
  state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}

async function copyEmailToClipboard() {
  try {
    await navigator.clipboard.writeText(contactEmail);
    showToast("Email copied to clipboard.");
  } catch {
    showToast(`Email: ${contactEmail}`);
  }
}

async function shareLandingPage() {
  const payload = {
    title: "NovaPulse Landing Page",
    text: "Check out this extraordinary frontend landing page.",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(payload);
      showToast("Shared successfully.");
      return;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard.");
  } catch {
    showToast("Sharing is not available in this browser.");
  }
}

function scrollToSection(hash) {
  const section = qs(hash);
  if (!section) {
    return;
  }
  section.scrollIntoView({
    behavior: reducedMotionQuery.matches ? "auto" : "smooth",
    block: "start"
  });
}

const commands = [
  {
    label: "Go to Features",
    keywords: "section capabilities cards",
    run: () => scrollToSection("#features"),
    announce: "Jumped to Features."
  },
  {
    label: "Go to Playground",
    keywords: "calculator simulator pricing",
    run: () => scrollToSection("#playground"),
    announce: "Jumped to Playground."
  },
  {
    label: "Go to Contact",
    keywords: "cta email brief",
    run: () => scrollToSection("#contact"),
    announce: "Jumped to Contact."
  },
  {
    label: "Back to Top",
    keywords: "home top start",
    run: () => scrollToSection("#top"),
    announce: "Returned to top."
  },
  {
    label: "Toggle Theme",
    keywords: "dark light mode appearance",
    run: () => toggleTheme(),
    announce: "Theme switched."
  },
  {
    label: "Copy Founder Email",
    keywords: "mail clipboard contact",
    run: () => copyEmailToClipboard()
  },
  {
    label: "Randomize Accent",
    keywords: "color palette style",
    run: () => {
      const choices = getAccentChoices();
      if (choices.length > 0) {
        applyAccent(randomPick(choices));
      }
    },
    announce: "Accent updated."
  }
];

function filterCommands(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...commands];
  }
  return commands.filter((command) =>
    `${command.label} ${command.keywords}`.toLowerCase().includes(normalized)
  );
}

function commandButtonId(index) {
  return `command-option-${index}`;
}

function renderCommands() {
  if (!commandList) {
    return;
  }

  commandList.innerHTML = "";

  if (!state.visibleCommands.length) {
    const li = document.createElement("li");
    li.className = "command-empty";
    li.textContent = "No commands found.";
    commandList.append(li);
    if (commandInput) {
      commandInput.removeAttribute("aria-activedescendant");
    }
    return;
  }

  state.visibleCommands.forEach((command, index) => {
    const li = document.createElement("li");
    li.className = "command-item";

    const button = document.createElement("button");
    button.type = "button";
    button.role = "option";
    button.id = commandButtonId(index);
    button.dataset.active = String(index === state.commandIndex);
    button.setAttribute("aria-selected", String(index === state.commandIndex));
    button.textContent = command.label;
    button.addEventListener("click", () => {
      void runCommand(command);
    });

    li.append(button);
    commandList.append(li);
  });

  syncActiveCommand();
}

function syncActiveCommand() {
  if (!commandList || !commandInput) {
    return;
  }

  const buttons = qsa(".command-item button", commandList);
  buttons.forEach((button, index) => {
    const active = index === state.commandIndex;
    button.dataset.active = String(active);
    button.setAttribute("aria-selected", String(active));
    if (active) {
      commandInput.setAttribute("aria-activedescendant", button.id);
      button.scrollIntoView({ block: "nearest" });
    }
  });
}

function openCommandPalette() {
  if (!commandPalette || !commandInput) {
    return;
  }

  state.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  if (typeof commandPalette.showModal === "function") {
    if (!commandPalette.open) {
      commandPalette.showModal();
    }
  } else {
    commandPalette.setAttribute("open", "");
  }

  commandInput.value = "";
  commandInput.setAttribute("aria-expanded", "true");
  state.visibleCommands = [...commands];
  state.commandIndex = 0;
  renderCommands();
  commandInput.focus();
}

function closeCommandPalette() {
  if (!commandPalette) {
    return;
  }

  if (typeof commandPalette.close === "function" && commandPalette.open) {
    commandPalette.close();
  } else {
    commandPalette.removeAttribute("open");
  }

  if (commandInput) {
    commandInput.setAttribute("aria-expanded", "false");
    commandInput.removeAttribute("aria-activedescendant");
  }

  if (state.previousFocus && typeof state.previousFocus.focus === "function") {
    state.previousFocus.focus({ preventScroll: true });
  }
}

async function runCommand(command) {
  closeCommandPalette();
  await Promise.resolve(command.run());
  if (command.announce) {
    showToast(command.announce);
  }
}

function setupReveal() {
  const revealNodes = qsa(".reveal");
  if (!revealNodes.length) {
    return;
  }

  if (CSS.supports("animation-timeline: view()")) {
    revealNodes.forEach((node) => node.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupCounters() {
  const counters = qsa("[data-count]");
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setupScrollSpy() {
  const navLinks = qsa(".nav-links a");
  if (!navLinks.length) {
    return;
  }

  const linkByHash = new Map(navLinks.map((link) => [link.getAttribute("href"), link]));
  const sections = ["#features", "#playground", "#faq", "#contact"]
    .map((hash) => qs(hash))
    .filter(Boolean);

  if (location.hash && linkByHash.has(location.hash)) {
    navLinks.forEach((link) => link.removeAttribute("data-current"));
    linkByHash.get(location.hash)?.setAttribute("data-current", "true");
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.removeAttribute("data-current"));
          const link = linkByHash.get(`#${entry.target.id}`);
          if (link) {
            link.setAttribute("data-current", "true");
          }
        }
      });
    },
    {
      rootMargin: "-40% 0px -48% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupTiltAndMagnetic() {
  if (reducedMotionQuery.matches || coarsePointerQuery.matches) {
    return;
  }

  qsa("[data-tilt]").forEach((card) => {
    const max = 9;
    let rafId = 0;
    let nextRotateX = 0;
    let nextRotateY = 0;

    const render = () => {
      rafId = 0;
      card.style.transform = `perspective(900px) rotateX(${nextRotateX.toFixed(2)}deg) rotateY(${nextRotateY.toFixed(2)}deg)`;
    };

    card.addEventListener(
      "pointermove",
      (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        nextRotateX = (0.5 - py) * max * 2;
        nextRotateY = (px - 0.5) * max * 2;
        if (!rafId) {
          rafId = requestAnimationFrame(render);
        }
      },
      { passive: true }
    );

    card.addEventListener("pointerleave", () => {
      nextRotateX = 0;
      nextRotateY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    });
  });

  qsa(".magnetic").forEach((node) => {
    let rafId = 0;
    let nextX = 0;
    let nextY = 0;

    const render = () => {
      rafId = 0;
      node.style.transform = `translate(${nextX.toFixed(2)}px, ${nextY.toFixed(2)}px)`;
    };

    node.addEventListener(
      "pointermove",
      (event) => {
        const rect = node.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        nextX = dx * 0.11;
        nextY = dy * 0.11;
        if (!rafId) {
          rafId = requestAnimationFrame(render);
        }
      },
      { passive: true }
    );

    node.addEventListener("pointerleave", () => {
      nextX = 0;
      nextY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(render);
      }
    });
  });
}

function setupLiveData() {
  updateTimeChip();
  state.stopLoops.push(createLoop(updateTimeChip, 1000));

  if (visitorCountEl) {
    let visitors = Number(visitorCountEl.textContent.replace(/[^0-9]/g, "")) || 1284;
    state.stopLoops.push(
      createLoop(() => {
        const drift = Math.floor(Math.random() * 19) - 6;
        visitors = Math.max(900, visitors + drift);
        visitorCountEl.textContent = visitors.toLocaleString();
      }, 2400)
    );
  }

  if (engagementScoreEl) {
    let engagement = 98.4;
    state.stopLoops.push(
      createLoop(() => {
        engagement += (Math.random() - 0.5) * 0.12;
        engagement = Math.max(97.8, Math.min(99.3, engagement));
        engagementScoreEl.textContent = `${engagement.toFixed(1)}%`;
      }, 2800)
    );
  }

  idle(() => {
    for (let i = 0; i < 4; i += 1) {
      appendActivity(buildActivityText());
    }
  });

  state.stopLoops.push(createLoop(() => appendActivity(buildActivityText()), 3200));
}

function setupThemeSync() {
  const savedTheme = normalizeTheme(readStorage(storageKeys.theme));
  if (savedTheme) {
    state.explicitThemePreference = true;
    applyTheme(savedTheme, { persist: false });
  } else {
    state.explicitThemePreference = false;
    applyTheme(systemThemeQuery.matches ? "dark" : "light", { persist: false });
  }

  const handleSystemThemeChange = (event) => {
    if (!state.explicitThemePreference) {
      applyTheme(event.matches ? "dark" : "light", { persist: false });
    }
  };

  if (typeof systemThemeQuery.addEventListener === "function") {
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof systemThemeQuery.addListener === "function") {
    systemThemeQuery.addListener(handleSystemThemeChange);
  }
}

function setupCommandPalette() {
  if (!commandPalette || !commandInput || !commandList) {
    return;
  }

  if (cmdButton) {
    cmdButton.addEventListener("click", openCommandPalette);
  }

  commandInput.addEventListener("input", () => {
    state.visibleCommands = filterCommands(commandInput.value);
    state.commandIndex = 0;
    renderCommands();
  });

  commandInput.addEventListener("keydown", (event) => {
    if (!state.visibleCommands.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      state.commandIndex = (state.commandIndex + 1) % state.visibleCommands.length;
      syncActiveCommand();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      state.commandIndex = (state.commandIndex - 1 + state.visibleCommands.length) % state.visibleCommands.length;
      syncActiveCommand();
    } else if (event.key === "Enter") {
      event.preventDefault();
      void runCommand(state.visibleCommands[state.commandIndex]);
    }
  });

  commandPalette.addEventListener("click", (event) => {
    if (event.target === commandPalette) {
      closeCommandPalette();
    }
  });

  commandPalette.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCommandPalette();
  });
}

function bootstrap() {
  setupThemeSync();

  const savedAccent = readStorage(storageKeys.accent);
  applyAccent(savedAccent || normalizeAccent(null), { persist: false });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      setMenuState(nav?.dataset.open !== "true");
    });
  }

  qsa(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("click", closeMenuIfOutsideClick);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      setMenuState(false);
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  accentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.accent) {
        applyAccent(button.dataset.accent);
      }
    });
  });

  let scrollTicking = false;
  document.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) {
        return;
      }
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateScrollProgress();
        scrollTicking = false;
      });
    },
    { passive: true }
  );
  updateScrollProgress();

  setupReveal();
  setupCounters();
  setupScrollSpy();
  setupTiltAndMagnetic();
  setupLiveData();
  setupCommandPalette();

  if (teamSizeInput) {
    teamSizeInput.addEventListener("input", updatePricing);
  }
  updatePricing();

  if (copyEmailButton) {
    copyEmailButton.addEventListener("click", copyEmailToClipboard);
  }
  if (shareButton) {
    shareButton.addEventListener("click", shareLandingPage);
  }

  document.addEventListener("keydown", (event) => {
    const isCommandK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
    if (isCommandK) {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if (event.key === "Escape") {
      if (commandPalette?.open) {
        closeCommandPalette();
      } else if (nav?.dataset.open === "true") {
        setMenuState(false);
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateTimeChip();
      updateScrollProgress();
    }
  });

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  window.addEventListener("pagehide", () => {
    state.stopLoops.forEach((stop) => stop());
    state.stopLoops = [];
  });

  window.addEventListener("pageshow", () => {
    if (state.stopLoops.length === 0) {
      setupLiveData();
    }
  });
}

bootstrap();
