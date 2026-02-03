// js/main.js
import { initProjectsFlip } from "./projects-flip.js";

document.getElementById("year").textContent = new Date().getFullYear();

initProjectsFlip().catch((err) => {
  console.error(err);
});
