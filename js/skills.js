// js/skills.js
// Renders the Skills section from data/skills.json

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") node.className = v;
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    if (child == null) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

async function loadJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

function renderSkills(mount, skills) {
  mount.innerHTML = "";
  const list = Array.isArray(skills) ? skills : [];

  list.forEach((block) => {
    const card = el("article", { class: "skillsCard" }, [
      el("h3", { class: "skillsTitle" }, [block.category || "Category"]),
      el("div", { class: "skillsRule", "aria-hidden": "true" }),
      el(
        "ul",
        { class: "skillsList" },
        (Array.isArray(block.items) ? block.items : []).map((item) =>
          el("li", { class: "skillsItem" }, [item])
        )
      ),
    ]);

    mount.appendChild(card);
  });
}

export async function initSkillsSection(options = {}) {
  const { jsonUrl = "./data/skills.json", mountId = "skills-grid" } = options;
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const data = await loadJson(jsonUrl);
  renderSkills(mount, data.skills);
}
