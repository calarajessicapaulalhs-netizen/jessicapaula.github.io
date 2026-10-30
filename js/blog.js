// Replay editorial reveals in both scroll directions, respecting reduced motion.
(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const elements = document.querySelectorAll('.intro-copy > h1, .intro-copy > p, .intro-portrait, .college-banner, .college-photo, .college-outro, .beyond-section > h2, .music-band, .hobbies-story, .creative-layout > *, .blog-closing');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else if (entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= window.innerHeight) {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: [0, 0.08], rootMargin: '0px' });
    elements.forEach(element => {
        element.classList.add('blog-motion');
        observer.observe(element);
    });
})();
