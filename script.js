let currentImageIndex = 0;
let images = [];
let currentPage = 'index';

const allSiteImages = ALL_SITE_IMAGES;

const PAGES_DATA = PAGES_DATA_PLACEHOLDER;

const pages = {};
PAGES_DATA.forEach(page => {
    pages[page.name] = {
        title: page.title,
        content: page.content || ''
    };
});

function navigateToPage(pageName) {
    if (!pages[pageName]) return;
    
    currentPage = pageName;
    const page = pages[pageName];
    
    document.querySelector('.header-page-title').textContent = page.title || '';
    document.getElementById('page-content').innerHTML = page.content;
    
    updateNavigation();
    updateImages();
    setupEventListeners();
    
    window.scrollTo(0, 0);
    
    window.history.pushState({page: pageName}, '', `#${pageName}`);
}

function updateNavigation() {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
    
    document.querySelector('.logo').classList.remove('active');
    if (currentPage === 'index') {
        document.querySelector('.logo').classList.add('active');
    }
}

function updateImages() {
    images = Array.from(document.querySelectorAll(".gallery-item img")).map(img => ({
        src: img.src,
        fullSrc: img.dataset.fullSrc,
        name: img.dataset.imgName
    }));
}

function setupEventListeners() {
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.dataset.imgName);
        });
    });
}

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;



function setupLightboxTouchEvents() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        
        lightboxImg.style.transform = 'translateX(0)';
    }, { passive: true });
    
    lightbox.addEventListener('touchmove', function(e) {
        const touchX = e.changedTouches[0].screenX;
        const deltaX = touchX - touchStartX;
        
        const maxDelta = Math.min(Math.abs(deltaX) * 0.3, 100);
        const direction = deltaX > 0 ? 1 : -1;
        
        lightboxImg.style.transform = `translateX(${direction * maxDelta}px)`;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        lightboxImg.style.transform = 'translateX(0)';
        
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const minSwipeDistance = 50;
    const deltaX = touchEndX - touchStartX;
    const deltaY = Math.abs(touchEndY - touchStartY);
    
    if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
            previousImage();
        } else {
            nextImage();
        }
    }
}

function setupLightboxDoubleTap() {
    const lightbox = document.getElementById('lightbox');
    let lastTap = 0;
    
    lightbox.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            closeLightbox();
            e.preventDefault();
        }
        lastTap = currentTime;
    });
}



function openLightbox(imgName) {
    try {
        currentImageIndex = images.findIndex(img => img.name === imgName);
        if (currentImageIndex === -1) return;
        
        const lightboxImg = document.getElementById("lightbox-img");
        const lightbox = document.getElementById("lightbox");
        
        if (lightboxImg && lightbox) {
            lightboxImg.src = images[currentImageIndex].fullSrc;
            lightbox.style.display = "block";
            document.body.style.overflow = "hidden";
            
            setupLightboxTouchEvents();
            setupLightboxDoubleTap();
            
            const url = new URL(window.location);
            url.searchParams.set("image", images[currentImageIndex].name);
            window.history.pushState({}, "", url);
        }
    } catch (error) {
        console.warn('Error opening lightbox:', error);
    }
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
    document.body.style.overflow = "auto";
    
    const url = new URL(window.location);
    url.searchParams.delete("image");
    window.history.pushState({}, "", url);
}

function previousImage(event) {
    if (event) {
        event.stopPropagation();
    }
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    document.getElementById("lightbox-img").src = images[currentImageIndex].fullSrc;
    
    const url = new URL(window.location);
    url.searchParams.set("image", images[currentImageIndex].name);
    window.history.pushState({}, "", url);
}

function nextImage(event) {
    if (event) {
        event.stopPropagation();
    }
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById("lightbox-img").src = images[currentImageIndex].fullSrc;
    
    const url = new URL(window.location);
    url.searchParams.set("image", images[currentImageIndex].name);
    window.history.pushState({}, "", url);
}

function preloadAllSiteImages() {
    console.log("Starting preload of all site images...");
    console.log(`Total images to preload: ${allSiteImages.length}`);
    
    let loadedCount = 0;
    allSiteImages.forEach((image, index) => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            console.log(`Preview loaded: ${image.name} (${loadedCount}/${allSiteImages.length})`);
            if (loadedCount === allSiteImages.length) {
                console.log("All previews loaded, starting full versions...");
                preloadAllFullImages();
            }
        };
        img.onerror = () => {
            console.warn(`Failed to load preview: ${image.name}`);
            loadedCount++;
            if (loadedCount === allSiteImages.length) {
                preloadAllFullImages();
            }
        };
        img.src = image.preview;
    });
}

function preloadAllFullImages() {
    console.log("Preloading all full images for lightbox...");
    let loadedCount = 0;
    allSiteImages.forEach((image, index) => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            console.log(`Full image loaded: ${image.name} (${loadedCount}/${allSiteImages.length})`);
        };
        img.onerror = () => {
            console.warn(`Failed to load full image: ${image.name}`);
            loadedCount++;
        };
        img.src = image.full;
    });
}

document.getElementById("lightbox").addEventListener("click", function(event) {
    const lightboxContent = document.querySelector(".lightbox-content");
    if (event.target === lightboxContent) {
        event.preventDefault();
        event.stopPropagation();
        closeLightbox();
    }
});

document.addEventListener("keydown", function(event) {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && lightbox.style.display === "block") {
        if (event.key === "Escape" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowLeft") {
            previousImage(event);
        } else if (event.key === "ArrowRight") {
            nextImage(event);
        } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();
        }
    }
});

window.addEventListener("load", function() {
    preloadAllSiteImages();
    
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateToPage(this.dataset.page);
        });
    });
    
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.slice(1);
        if (pages[hash]) {
            navigateToPage(hash);
        }
    });
    

    
    let hash = window.location.hash.slice(1);
    if (!hash) {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') {
            hash = 'index';
        }
    }
    navigateToPage(hash || 'index');
    
    const urlParams = new URLSearchParams(window.location.search);
    const imageParam = urlParams.get("image");
    if (imageParam !== null) {
        setTimeout(() => {
            const imageIndex = images.findIndex(img => img.name === imageParam);
            if (imageIndex >= 0 && imageIndex < images.length) {
                currentImageIndex = imageIndex;
                openLightbox(images[imageIndex].name);
            }
        }, 100);
    }
});

window.addEventListener("popstate", function(event) {
    let hash = window.location.hash.slice(1);
    if (!hash) {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') {
            hash = 'index';
        }
    }
    navigateToPage(hash || 'index');
    
    const urlParams = new URLSearchParams(window.location.search);
    const imageParam = urlParams.get("image");
    if (imageParam !== null) {
        setTimeout(() => {
            const imageIndex = images.findIndex(img => img.name === imageParam);
            if (imageIndex >= 0 && imageIndex < images.length) {
                currentImageIndex = imageIndex;
                openLightbox(images[imageIndex].name);
            }
        }, 100);
    }
}); 