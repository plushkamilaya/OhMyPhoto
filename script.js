let currentImageIndex = 0;
let images = [];
let currentPage = 'index';

const REDIRECTS = { Restaurants: 'for-business', Kids: 'private-sessions' };

function resolveHash(hash) {
    return REDIRECTS[hash] || hash;
}

const allSiteImages = ALL_SITE_IMAGES;

const PAGES_DATA = PAGES_DATA_PLACEHOLDER;

const pages = {};
PAGES_DATA.forEach(page => {
    pages[page.name] = {
        title: page.title,
        content: page.content || ''
    };
});

const EQUIPMENT_CATALOG = EQUIPMENT_CATALOG_PLACEHOLDER;

const EQUIPMENT_BY_ID = {};
EQUIPMENT_CATALOG.forEach(item => {
    EQUIPMENT_BY_ID[item.id] = item;
});

const ENQUIRY_LABELS = {
    'book-similar-session': 'Book a similar session',
    'request-similar-shoot': 'Request a similar shoot',
    'ask-print': 'Ask about a print',
    'license-image': 'License this image'
};

function navigateToPage(pageName) {
    if (!pages[pageName]) return;
    
    currentPage = pageName;
    const page = pages[pageName];
    
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
    images = Array.from(document.querySelectorAll(".gallery-item img, .community-photo img")).map(img => ({
        src: img.src,
        fullSrc: img.dataset.fullSrc,
        name: img.dataset.imgName,
        cameraId: img.dataset.camera || null,
        lensId: img.dataset.lens || null,
        title: img.dataset.title || null,
        caption: img.dataset.caption || null,
        enquiryAction: img.dataset.enquiry || null
    }));
}

function setupEventListeners() {
    document.querySelectorAll('.gallery-item img, .community-photo img').forEach(img => {
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



function renderGearRow(rowEl, equipmentId) {
    if (!equipmentId || !EQUIPMENT_BY_ID[equipmentId]) {
        rowEl.hidden = true;
        rowEl.innerHTML = '';
        return;
    }

    const item = EQUIPMENT_BY_ID[equipmentId];
    rowEl.hidden = false;
    rowEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <span>
            <span class="lightbox-gear-name">${item.name}</span>
            <span class="lightbox-gear-desc">${item.description}</span>
        </span>`;
}

function renderLightboxPanel(image) {
    const titleEl = document.getElementById('lightbox-title');
    const captionEl = document.getElementById('lightbox-caption');
    const gearEl = document.getElementById('lightbox-gear');
    const cameraRow = document.getElementById('lightbox-gear-camera');
    const lensRow = document.getElementById('lightbox-gear-lens');
    const enquiryBtn = document.getElementById('lightbox-enquiry-btn');
    const enquiryForm = document.getElementById('lightbox-enquiry-form');

    titleEl.hidden = !image.title;
    titleEl.textContent = image.title || '';

    captionEl.hidden = !image.caption;
    captionEl.textContent = image.caption || '';

    gearEl.hidden = !image.cameraId;
    if (image.cameraId) {
        renderGearRow(cameraRow, image.cameraId);
        renderGearRow(lensRow, image.lensId);
    }

    enquiryForm.hidden = true;
    enquiryForm.reset();

    if (image.enquiryAction && ENQUIRY_LABELS[image.enquiryAction]) {
        enquiryBtn.hidden = false;
        enquiryBtn.textContent = ENQUIRY_LABELS[image.enquiryAction];
        enquiryBtn.dataset.action = image.enquiryAction;
    } else {
        enquiryBtn.hidden = true;
        delete enquiryBtn.dataset.action;
    }
}

function openLightbox(imgName) {
    try {
        currentImageIndex = images.findIndex(img => img.name === imgName);
        if (currentImageIndex === -1) return;
        
        const lightboxImg = document.getElementById("lightbox-img");
        const lightbox = document.getElementById("lightbox");
        
        if (lightboxImg && lightbox) {
            lightboxImg.src = images[currentImageIndex].fullSrc;
            renderLightboxPanel(images[currentImageIndex]);
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
    renderLightboxPanel(images[currentImageIndex]);

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
    renderLightboxPanel(images[currentImageIndex]);

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

document.getElementById("lightbox-enquiry-btn").addEventListener("click", function(event) {
    event.stopPropagation();
    const form = document.getElementById("lightbox-enquiry-form");
    form.hidden = !form.hidden;
});

document.getElementById("lightbox-enquiry-form").addEventListener("click", function(event) {
    event.stopPropagation();
});

document.getElementById("lightbox-enquiry-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const form = event.target;
    const image = images[currentImageIndex] || {};
    const action = document.getElementById("lightbox-enquiry-btn").dataset.action || '';
    const camera = EQUIPMENT_BY_ID[image.cameraId] ? EQUIPMENT_BY_ID[image.cameraId].name : '';
    const lens = EQUIPMENT_BY_ID[image.lensId] ? EQUIPMENT_BY_ID[image.lensId].name : '';

    form.photoId.value = image.name || '';
    form.page.value = currentPage;
    form.enquiryAction.value = action;
    form.camera.value = camera;
    form.lens.value = lens;

    const subject = `Enquiry: ${ENQUIRY_LABELS[action] || 'Photo enquiry'} (${image.name || ''})`;
    const bodyLines = [
        `Name: ${form.name.value}`,
        `Email: ${form.email.value}`,
        `Phone: ${form.phone.value}`,
        '',
        form.message.value,
        '',
        '---',
        `Photo: ${image.name || ''}`,
        `Page: ${currentPage}`,
        `Action: ${action}`,
        `Camera: ${camera}`,
        `Lens: ${lens || 'n/a'}`
    ];

    const mailtoUrl = `mailto:hello@plushka.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailtoUrl;
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
        const hash = resolveHash(window.location.hash.slice(1));
        if (pages[hash]) {
            navigateToPage(hash);
        }
    });



    let hash = resolveHash(window.location.hash.slice(1));
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
    let hash = resolveHash(window.location.hash.slice(1));
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