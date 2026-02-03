// js/resume.js
// Renders Experience timeline + Resume preview/download from data/resume.json

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
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

function renderTimeline(mount, items) {
  mount.innerHTML = "";
  mount.classList.add("timeline");

  const list = Array.isArray(items) ? items : [];

  list.forEach((item, idx) => {
    const header = el("div", { class: "timeline-header" }, [
      el("div", { class: "timeline-role" }, [item.title || "Role"]),
      el("div", { class: "timeline-meta" }, [
        [item.company, item.dates].filter(Boolean).join(" • ")
      ])
    ]);

    const bullets = Array.isArray(item.bullets) ? item.bullets : [];
    const ul = bullets.length
      ? el("ul", { class: "timeline-bullets" }, bullets.map(b => el("li", {}, [b])))
      : null;

    const node = el("article", { class: "timeline-item" }, [
      el("div", { class: "timeline-dotWrap" }, [
        el("span", { class: "timeline-dot", "aria-hidden": "true" })
      ]),
      el("div", { class: "timeline-content" }, [
        header,
        ul,
        // divider between items (except last)
        (idx !== list.length - 1) ? el("div", { class: "timeline-divider", "aria-hidden": "true" }) : null
      ])
    ]);

    mount.appendChild(node);
  });
}

function renderResumePreview(previewMount, resume) {
  previewMount.innerHTML = "";

  const frame = el("div", { class: "resumeFrame" }, [
    el("div", { class: "resumeTopbar" }, [
      el("div", { class: "resumeTopbarTitle" }, [resume.title || "My Resume"]),
      el("div", { class: "resumeTopbarDots", "aria-hidden": "true" }, ["⋯"])
    ])
  ]);

  const placeholder = el("div", { class: "resume-placeholder" }, ["Resume preview"]);

  if (resume.previewImage) {
    const img = el("img", {
      class: "resumeImg",
      src: resume.previewImage,
      alt: "Resume preview"
    });
    img.addEventListener("error", () => {
      // If the file path is wrong, show a clean placeholder (no broken image icon)
      img.remove();
      frame.appendChild(placeholder);
    });
    frame.appendChild(img);
  } else {
    frame.appendChild(placeholder);
  }

  previewMount.appendChild(frame);
}

function renderDownloads(downloadMount, resume) {
  downloadMount.innerHTML = "";

  const href = resume.primaryDownload;
  if (!href) return;

  const a = el("a", {
    class: "btn btn-primary",
    href,
    target: "_blank",
    rel: "noopener"
  }, ["Download PDF"]);

  downloadMount.appendChild(a);
}

export async function initResumeSection(options = {}) {
  const {
    jsonUrl = "./data/resume.json",
    timelineId = "experience-timeline",
    previewId = "resume-preview",
    downloadId = "resume-download"
  } = options;

  const timelineMount = document.getElementById(timelineId);
  const previewMount = document.getElementById(previewId);
  const downloadMount = document.getElementById(downloadId);

  if (!timelineMount || !previewMount || !downloadMount) return;

  const data = await loadJson(jsonUrl);

  renderTimeline(timelineMount, data.experience || []);
  renderResumePreview(previewMount, data.resume || {});
  renderDownloads(downloadMount, data.resume || {});
}
