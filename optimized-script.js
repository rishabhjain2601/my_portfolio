// Optimized image sequence animation

function locomotive() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },

    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },

    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}
locomotive();

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Set canvas size for bottom positioning
function setCanvasSize() {
  const maxHeight = window.innerHeight * 0.6; // 60% of viewport height
  const aspectRatio = 16 / 9; // Adjust based on your image aspect ratio
  
  canvas.height = maxHeight;
  canvas.width = maxHeight * aspectRatio;
}

setCanvasSize();

window.addEventListener("resize", function () {
  setCanvasSize();
  render();
});

// Optimized image loading with reduced frame count and preloading
const frameCount = 60; // Reduced from 300 to 60 for better performance
const images = [];
const imageSeq = { frame: 1 };
let imagesLoaded = 0;
let allImagesLoaded = false;

// Create a loading progress indicator
function showLoadingProgress(loaded, total) {
  const progress = (loaded / total) * 100;
  console.log(`Loading images: ${progress.toFixed(1)}%`);
  
  // You can add a visual loading indicator here if needed
  if (progress === 100) {
    console.log("All images loaded successfully!");
    allImagesLoaded = true;
    render(); // Initial render when all images are loaded
  }
}

// Optimized image file paths - using every 5th image for smoother but efficient animation
function getImagePath(index) {
  const actualIndex = Math.floor((index * 300) / frameCount) + 1;
  const paddedIndex = actualIndex.toString().padStart(4, '0');
  return `./Images/male${paddedIndex}.png`;
}

// Preload images with better error handling and progress tracking
function preloadImages() {
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle CORS if needed
    
    img.onload = function() {
      imagesLoaded++;
      showLoadingProgress(imagesLoaded, frameCount);
    };
    
    img.onerror = function() {
      console.warn(`Failed to load image: ${img.src}`);
      imagesLoaded++;
      showLoadingProgress(imagesLoaded, frameCount);
    };
    
    img.src = getImagePath(i);
    images.push(img);
  }
}

// Start preloading
preloadImages();

// GSAP Animation with optimized settings
gsap.to(imageSeq, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.5,
    trigger: "#main",
    start: "top top",
    end: "bottom bottom",
    scroller: "#main",
    onUpdate: function() {
      if (allImagesLoaded) {
        render();
      }
    }
  },
});

function render() {
  if (images[imageSeq.frame] && images[imageSeq.frame].complete) {
    scaleImage(images[imageSeq.frame], context);
  }
}

function scaleImage(img, ctx) {
  if (!img || !img.complete || !img.naturalWidth) return;
  
  const canvas = ctx.canvas;
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio); // Changed from Math.max to Math.min for better fitting
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );
}

// Remove the canvas pinning since we're using fixed positioning in CSS
