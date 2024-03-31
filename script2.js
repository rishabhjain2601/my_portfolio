gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Toggle class of .about-button element based on scrolling
gsap.to(".about-button", {
    scrollTrigger: {
        trigger: "#main", // Trigger element
        start: "top center", // Start position of trigger element
        end: "bottom center", // End position of trigger element
        toggleClass: { className: "hidden" }, // Toggle class name
        markers: true // Add markers for debugging (optional)
    }
});

// Change background color of #main
gsap.to("#main", {
    backgroundColor: "orange", // Target background color
    scrollTrigger: {
        trigger: "#main", // Trigger element
        start: "top top", // Start position of trigger element
        end: "200% top", // End position of trigger element
        scrub: true, // Smooth scrubbing effect
        markers: true // Add markers for debugging (optional)
    }
});
