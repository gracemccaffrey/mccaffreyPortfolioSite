// js/nav.js
export function initMobileNav() {
    const panel = document.getElementById("mobileNav");
    const toggle = document.querySelector(".nav-toggle");
    const closeBtn = document.querySelector(".mobileNav-close");

    if (!panel || !toggle) return;

    const open = () => {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-open");
    };

    const close = () => {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        if (panel.hidden) open();
        else close();
    });

    closeBtn?.addEventListener("click", close);

  // close when clicking the dark backdrop
    panel.addEventListener("click", (e) => {
        if (e.target === panel) close();
    });

  // close when choosing a link
    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  // close on Escape
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !panel.hidden) close();
    });
}
