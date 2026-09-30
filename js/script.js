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
