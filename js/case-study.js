// js/case-study.js
// Lightweight interactivity for the case study page:
// - Set year in footer
// - Wire buttons for demo/report URLs
// - Simple accordion behavior
// - (Optional) read ?id=healthhub for future scalability
import { initMobileNav } from "./nav.js";

initMobileNav();

const DEMO_URL = "#";   // TODO: replace with your real demo URL
const REPORT_URL = "./assets/HHFinalReport.docx"; // TODO: replace with your PDF path, e.g. "assets/HealthHubFinalReport.pdf"

document.getElementById("year").textContent = new Date().getFullYear();

// Update buttons (top + bottom)
const liveDemoBtn = document.getElementById("liveDemoBtn");
const reportBtn = document.getElementById("reportBtn");
const reportBtnBottom = document.getElementById("reportBtnBottom");

if (liveDemoBtn) liveDemoBtn.href = DEMO_URL;
if (reportBtn) reportBtn.href = REPORT_URL;
if (reportBtnBottom) reportBtnBottom.href = REPORT_URL;

// If you want the demo/report to open in a new tab:
[liveDemoBtn, reportBtn, reportBtnBottom].forEach((a) => {
  if (!a) return;
  if (a.href && !a.href.endsWith("#")) {
    a.target = "_blank";
    a.rel = "noopener";
  }
});

// Basic accordion
function initAccordion(root) {
  const items = root.querySelectorAll(".accItem");
  items.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const panel = btn.nextElementSibling;

      // close all first (keeps it tidy)
      items.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const p = b.nextElementSibling;
        if (p) p.hidden = true;
      });

      // open clicked if it was closed
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });
}

document.querySelectorAll("[data-accordion]").forEach(initAccordion);

// Optional: if you add more case studies later, use the query param.
// For now we just guard against wrong ids.
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
if (id && id !== "healthhub") {
  console.warn("Unknown case study id:", id);
}
