// Replay section reveals when visitors return while scrolling in either direction.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(
    ".design-navbar, .design-hero-copy > h1, .design-hero-copy > h2, .design-hero-copy > p, .design-hero-actions, .design-portrait, " +
    ".reveal, .featured-heading, .featured-frame, .portfolio-design-heading, " +
    ".portfolio-row, .profile-heading, .profile-design-grid, .technical-heading, " +
    ".technical-pill, .productivity-design, .work-design > h2, .work-entry, .work-image-grid"
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealEls.forEach(function (el) { el.classList.add("motion-reveal"); });
    const revealObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                } else if (entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= window.innerHeight) {
                    entry.target.classList.remove("is-visible");
                }
            });
        },
        { threshold: [0, 0.08], rootMargin: "0px" }
    );

    revealEls.forEach(function (el) {
        revealObserver.observe(el);
    });
} else {
    revealEls.forEach(function (el) {
        el.classList.add("is-visible");
    });
}

// Light / Dark mode toggle
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function applyTheme(theme) {
    if (theme === "light") {
        root.setAttribute("data-theme", "light");
        if (themeToggle) themeToggle.textContent = "☀️";
    } else {
        root.removeAttribute("data-theme");
        if (themeToggle) themeToggle.textContent = "🌙";
    }
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const isLight = root.getAttribute("data-theme") === "light";
        const newTheme = isLight ? "dark" : "light";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

const links = document.querySelectorAll("a");

links.forEach(function (link) {
    link.addEventListener("click", function (e) {
        // Small "press" feedback on every link click.
        link.style.transform = "scale(0.96)";

        setTimeout(function () {
            link.style.transform = "";
        }, 150);

        const href = link.getAttribute("href");

        // Handle same-page section links (e.g. "#about") manually by
        // scrolling to the target element instead of letting the browser
        // change the URL fragment. Changing the fragment on a page opened
        // via file:// can trigger a browser security warning
        // ("Unsafe attempt to load URL... unique security origins"),
        // so we avoid touching the URL entirely and just scroll.
        if (href && href.length > 1 && href.startsWith("#")) {
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
});

// Keep the gallery scrollbar hidden while supporting mouse and touch input.
document.querySelectorAll(".portfolio-track").forEach(function (track) {
    let drag = null;
    let suppressClick = false;
    track.addEventListener("wheel", function (event) {
        if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1;
        const delta = event.deltaY * scale;
        const limit = track.scrollWidth - track.clientWidth;
        if ((delta > 0 && track.scrollLeft < limit - 1) || (delta < 0 && track.scrollLeft > 1)) {
            event.preventDefault();
            track.scrollLeft += delta;
        }
    }, { passive: false });
    track.addEventListener("pointerdown", function (event) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        suppressClick = false;
        drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, moved: false };
    });
    track.addEventListener("pointermove", function (event) {
        if (!drag || event.pointerId !== drag.id) return;
        const distance = event.clientX - drag.x;
        if (!drag.moved && Math.abs(distance) < 5) return;
        if (!drag.moved) {
            drag.moved = true;
            track.setPointerCapture(event.pointerId);
            track.classList.add("is-dragging");
        }
        track.scrollLeft = drag.left - distance;
        event.preventDefault();
    });
    function endDrag(event) {
        if (!drag || event.pointerId !== drag.id) return;
        suppressClick = drag.moved;
        drag = null;
        track.classList.remove("is-dragging");
        if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    }
    window.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("lostpointercapture", endDrag);
    track.addEventListener("dragstart", function (event) { event.preventDefault(); });
    track.addEventListener("click", function (event) {
        if (suppressClick) {
            event.preventDefault();
            event.stopImmediatePropagation();
            suppressClick = false;
        }
    }, true);
});
