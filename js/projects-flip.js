// js/projects-flip.js
// Renders 3D flip project cards from projects.json
// Usage: import { initProjectsFlip } from "./projects-flip.js"; initProjectsFlip();

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "style") node.setAttribute("style", v);
    else if (k.startsWith("data-")) node.setAttribute(k, v);
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function buildButtons(links = {}) {
  const btns = [];
  const map = [
    ["Live Demo", links.liveDemo],
    ["GitHub", links.github],
    ["Case Study", links.caseStudy],
  ];
  for (const [label, href] of map) {
    if (!href) continue;
    
    const isExternal = 
      href.startsWith("http://") ||
      href.startsWith("https://");

    const a = el("a", {
      class: "btn btn-outline btn-small flipBtn",
      href,
      ...(isExternal && {
          target: "_blank",
          rel: "noopener",
      }),
    }, [label]);
    // Don't flip when clicking links
    a.addEventListener("click", (e) => e.stopPropagation());
    btns.push(a);
  }
  return btns;
}

function createFlipCard(project, isFeatured = false) {
  const tech = safeArray(project.tech).slice(0, 6);
  const highlights = safeArray(project.expanded?.highlights).slice(0, 5);

  const imgStyle = project.image
    ? `background-image: url('${project.image}');`
    : "";

  const container = el("article", {
    class: `flipCardContainer ${isFeatured ? "flipCardContainer--featured" : ""}`,
  });

  const card = el("div", {
    class: "flipCard",
    tabindex: "0",
    role: "button",
    "aria-label": `Flip card for ${project.title}`,
    "aria-pressed": "false",
  });

  const front = el("div", { class: "flipSide flipFront" }, [
    el("div", { class: `flipImg ${isFeatured ? "flipImg--featured" : ""}`, style: imgStyle }),
    el("div", { class: "flipInfo" }, [
      el("h3", { class: "flipTitle" }, [project.title || "Project"]),
      project.subtitle ? el("p", { class: "flipSubtitle" }, [project.subtitle]) : null,
      tech.length
        ? el("p", { class: "flipTech" }, [tech.join(" • ")])
        : null,
      // mimic mock: show quick buttons on the featured card front
      ...(isFeatured ? [el("div", { class: "flipFrontBtns" }, buildButtons(project.links))] : []),
      el("div", { class: "flipHint" }, ["Click to flip →"]),
    ]),
  ]);

  const back = el("div", { class: "flipSide flipBack" }, [
    el("div", { class: "flipInfo" }, [
      el("h3", { class: "flipBackTitle" }, ["At a glance"]),
      project.expanded?.description
        ? el("p", { class: "flipDesc" }, [project.expanded.description])
        : null,
      (isFeatured && highlights.length)
        ? el("ul", { class: "flipList" }, highlights.map((h) => el("li", {}, [h])))
          : null,
      isFeatured
        ? el("div", { class: "flipBackBtns" }, buildButtons(project.links))
          : null,
      el("div", { class: "flipHint flipHint--back" }, ["← Click to close"]),
    ]),
  ]);

  card.append(front, back);

  const toggle = () => {
    const flipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", flipped ? "true" : "false");
  };

  // click + keyboard
  card.addEventListener("click", toggle);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  container.appendChild(card);
  return container;
}

async function loadProjectsJson(url = "./projects.json") {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

function equalizeMiniCardHeights(gridMountId = "project-grid") {
  // ✅ On mobile, don't equalize; let cards size naturally
  if (window.matchMedia("(max-width: 600px)").matches) {
    const grid = document.getElementById(gridMountId);
    grid?.querySelectorAll(".flipCardContainer").forEach((c) => (c.style.height = ""));
    return;
  }
  
  const grid = document.getElementById(gridMountId);
  if (!grid) return;

  const miniContainers = Array.from(
    grid.querySelectorAll(".flipCardContainer:not(.flipCardContainer--featured)")
  );

  if (!miniContainers.length) return;

  // Reset heights first so we can measure naturally
  miniContainers.forEach((c) => (c.style.height = ""));

  let max = 0;

  miniContainers.forEach((container) => {
    const card = container.querySelector(".flipCard");
    const front = card?.querySelector(".flipFront");
    const img = front?.querySelector(".flipImg");
    const info = front?.querySelector(".flipInfo");

    if (!img || !info) return;

    // Required height = image height + text block height
    const required = img.offsetHeight + info.scrollHeight;
    if (required > max) max = required;
  });

  // Add a small buffer for borders/shadows
  const finalHeight = Math.ceil(max + 2);

  miniContainers.forEach((c) => {
    c.style.height = `${finalHeight}px`;
  });
}
// for mobile, change size of card to fit the front 
function sizeCardsToFront(featuredMountId = "featured-project", gridMountId = "project-grid") {
  const mounts = [
    document.getElementById(featuredMountId),
    document.getElementById(gridMountId),
  ].filter(Boolean);

  mounts.forEach((mount) => {
    mount.querySelectorAll(".flipCardContainer").forEach((container) => {
      const card = container.querySelector(".flipCard");
      const front = card?.querySelector(".flipFront");
      const img = front?.querySelector(".flipImg");
      const info = front?.querySelector(".flipInfo");
      if (!img || !info) return;

      // ✅ Reliable: image block + text block
      const required = img.offsetHeight + info.scrollHeight;

      // buffer for borders + the hint baseline
      const buffer = 0;

      container.style.height = `${Math.ceil(required + buffer)}px`;
      
      console.log("Set height:", container.style.height, container.className);
    });
  });
}



export async function initProjectsFlip(options = {}) {
  const {
    jsonUrl = "./data/projects.json",
    featuredMountId = "featured-project",
    gridMountId = "project-grid",
  } = options;

  const featuredMount = document.getElementById(featuredMountId);
  const gridMount = document.getElementById(gridMountId);

  if (!featuredMount || !gridMount) return;

  featuredMount.innerHTML = "";
  gridMount.innerHTML = "";

  // Ensure grid class
  gridMount.classList.add("projectsFlipGrid");

  const data = await loadProjectsJson(jsonUrl);
  const projects = safeArray(data.projects);

  const featuredId = data.featuredId;
  const featured = featuredId ? projects.find((p) => p.id === featuredId) : projects[0];
  const others = projects.filter((p) => p !== featured);

  if (featured) {
    featuredMount.appendChild(createFlipCard(featured, true));
  }

  for (const p of others) {
    gridMount.appendChild(createFlipCard(p, false));
  }

  // After rendering, equalize mini card heights so front text never clips or adjust the front for mobile
  const isMobile = window.matchMedia("(max-width: 800px)").matches;
  if (isMobile) sizeCardsToFront(featuredMountId, gridMountId);
  else equalizeMiniCardHeights(gridMountId);


  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const isMobile = window.matchMedia("(max-width: 600px)").matches;

      if (isMobile) {
        sizeCardsToFront(featuredMountId, gridMountId);
      } else {
        equalizeMiniCardHeights(gridMountId);
      }
    }, 100);
  });
}
