// js/main.js
import { initProjectsFlip } from "./projects-flip.js";
import { initResumeSection } from "./resume.js";
import { initSkillsSection } from "./skills.js";

document.getElementById("year").textContent = new Date().getFullYear();

initProjectsFlip({ jsonUrl: "./data/projects.json" }).catch((err) => {
  console.error("Projects failed to load:", err);
});

initResumeSection({ jsonUrl: "./data/resume.json" }).catch((err) => {
  console.error("Resume failed to load:", err);
});

initSkillsSection({ jsonUrl: "./data/skills.json" }).catch((err) => console.error("Skills failed to load:", err));
