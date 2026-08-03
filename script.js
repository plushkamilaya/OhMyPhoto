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

// Keyed by the session tile's data-session-id (see generateSessionTilesJson
// in build.js) — lets a Mini/Story Sessions tile embedded in a photo grid
// render its title/meta/description in the lightbox without threading that
// copy through HTML attributes.
const SESSION_TILES = SESSION_TILES_PLACEHOLDER;

const ENQUIRY_LABELS = {
    'book-similar-session': 'Book a similar session',
    'request-similar-shoot': 'Request a similar shoot',
    'ask-print': 'Ask about a print',
    'license-image': 'License this image',
    'book-mini-session': 'Book a Mini Session',
    'book-story-session': 'Book a Story Session'
};

const ENQUIRY_BUTTON_VARIANTS = {
    'book-similar-session': [
        'Book a similar session',
        'I want this too',
        'Get us a session like this',
        'Make this happen for us'
    ],
    'request-similar-shoot': [
        'Request a similar shoot',
        'We want this too',
        'Get us something like this',
        'Set us up with the same'
    ],
    'ask-print': [
        'Ask about a print',
        'I want this on my wall',
        'Get me a print like this'
    ],
    'license-image': [
        'License this image',
        "I'd like to use this photo",
        'Clear this image for use'
    ]
};

function pickEnquiryButtonLabel(action) {
    const variants = ENQUIRY_BUTTON_VARIANTS[action];
    if (!variants || variants.length === 0) {
        return ENQUIRY_LABELS[action] || '';
    }
    return variants[Math.floor(Math.random() * variants.length)];
}

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
    images = Array.from(document.querySelectorAll(".gallery-item img, .community-photo img, .session-tile")).map(el => {
        if (el.classList.contains('session-tile')) {
            const tile = SESSION_TILES[el.dataset.sessionId] || {};
            return {
                name: el.dataset.sessionId,
                isSession: true,
                title: tile.title || '',
                duration: tile.duration || '',
                price: tile.price || '',
                description: tile.description || '',
                enquiryAction: tile.enquiryAction || null
            };
        }
        return {
            src: el.src,
            fullSrc: el.dataset.fullSrc,
            name: el.dataset.imgName,
            cameraId: el.dataset.camera || null,
            lensId: el.dataset.lens || null,
            title: el.dataset.title || null,
            caption: el.dataset.caption || null,
            enquiryAction: el.dataset.enquiry || null
        };
    });
}

function setupEventListeners() {
    document.querySelectorAll('.gallery-item img, .community-photo img').forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.dataset.imgName);
        });
    });

    document.querySelectorAll('.session-tile').forEach(tile => {
        tile.addEventListener('click', function() {
            openLightbox(this.dataset.sessionId);
        });
        tile.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(this.dataset.sessionId);
            }
        });
    });

    bindMailtoLinks(document.getElementById('page-content'));
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
    const sessionMetaEl = document.getElementById('lightbox-session-meta');
    const sessionDurationEl = document.getElementById('lightbox-session-duration');
    const sessionPriceEl = document.getElementById('lightbox-session-price');

    titleEl.hidden = !image.title;
    titleEl.textContent = image.title || '';

    if (image.isSession) {
        captionEl.hidden = !image.description;
        captionEl.innerHTML = image.description || '';
    } else {
        captionEl.hidden = !image.caption;
        captionEl.textContent = image.caption || '';
    }

    sessionMetaEl.hidden = !image.isSession || (!image.duration && !image.price);
    sessionDurationEl.textContent = image.isSession ? (image.duration || '') : '';
    sessionPriceEl.textContent = image.isSession ? (image.price || '') : '';

    gearEl.hidden = !image.cameraId;
    if (image.cameraId) {
        renderGearRow(cameraRow, image.cameraId);
        renderGearRow(lensRow, image.lensId);
    }

    enquiryForm.hidden = true;
    enquiryForm.reset();

    if (image.enquiryAction && ENQUIRY_LABELS[image.enquiryAction]) {
        enquiryBtn.hidden = false;
        enquiryBtn.textContent = image.isSession ? ENQUIRY_LABELS[image.enquiryAction] : pickEnquiryButtonLabel(image.enquiryAction);
        enquiryBtn.dataset.action = image.enquiryAction;
    } else {
        enquiryBtn.hidden = true;
        delete enquiryBtn.dataset.action;
    }
}

// For a session-tile slide, the title/meta/description move into the
// content area (where the photo would normally sit) so they read as the
// thing "in place of the photo"; for a regular photo they move back into
// their usual spot in the side panel, right before the gear section. Safe
// to call on every render regardless of where they currently are.
function placeSessionInfo(isSession) {
    const titleEl = document.getElementById('lightbox-title');
    const metaEl = document.getElementById('lightbox-session-meta');
    const captionEl = document.getElementById('lightbox-caption');

    if (isSession) {
        const content = document.querySelector('.lightbox-content');
        content.appendChild(titleEl);
        content.appendChild(metaEl);
        content.appendChild(captionEl);
    } else {
        const panel = document.getElementById('lightbox-panel');
        const gearEl = document.getElementById('lightbox-gear');
        panel.insertBefore(titleEl, gearEl);
        panel.insertBefore(metaEl, gearEl);
        panel.insertBefore(captionEl, gearEl);
    }
}

// Photo slides show the image beside a side panel (title/gear/enquiry);
// session-tile slides (Mini/Story Sessions, embedded among the photos) have
// no image at all — the side panel is left holding just the enquiry
// button, and the title/meta/description appear instead as centered text
// on a plain white background standing in for the photo (see
// .lightbox--session in styles.css).
function renderLightboxSlide(image) {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightbox = document.getElementById('lightbox');

    lightbox.classList.toggle('lightbox--session', !!image.isSession);
    placeSessionInfo(!!image.isSession);
    if (image.isSession) {
        lightboxImg.style.display = 'none';
        lightboxImg.removeAttribute('src');
    } else {
        lightboxImg.style.display = '';
        lightboxImg.src = image.fullSrc;
    }
    renderLightboxPanel(image);
}

function openLightbox(imgName) {
    try {
        currentImageIndex = images.findIndex(img => img.name === imgName);
        if (currentImageIndex === -1) return;

        const lightboxImg = document.getElementById("lightbox-img");
        const lightbox = document.getElementById("lightbox");

        if (lightboxImg && lightbox) {
            renderLightboxSlide(images[currentImageIndex]);
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
    renderLightboxSlide(images[currentImageIndex]);

    const url = new URL(window.location);
    url.searchParams.set("image", images[currentImageIndex].name);
    window.history.pushState({}, "", url);
}

function nextImage(event) {
    if (event) {
        event.stopPropagation();
    }
    currentImageIndex = (currentImageIndex + 1) % images.length;
    renderLightboxSlide(images[currentImageIndex]);

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

function parseMailtoUrl(url) {
    const withoutScheme = url.replace(/^mailto:/, '');
    const [address, query] = withoutScheme.split('?');
    const params = new URLSearchParams(query || '');
    return {
        address: address || '',
        subject: params.get('subject') || '',
        body: params.get('body') || ''
    };
}

function showMailtoFallback(details) {
    document.getElementById('mailto-fallback-address').textContent = details.address;
    document.getElementById('mailto-fallback-subject').textContent = details.subject;
    document.getElementById('mailto-fallback-body').value = details.body;
    document.getElementById('mailto-fallback').hidden = false;
}

function closeMailtoFallback() {
    document.getElementById('mailto-fallback').hidden = true;
}

// mailto: links don't produce a normal navigation, so there's no error event
// to hook into when a device has no mail app configured. Instead we watch
// for the window losing focus (native app took over) or the tab going
// hidden (a web-based handler like Gmail opened in a new tab) shortly after
// the click; if neither happens, we assume nothing opened and show the
// details in a modal so the visitor can copy them by hand.
function openMailtoWithFallback(url) {
    const details = parseMailtoUrl(url);
    let handled = false;

    function markHandled() {
        handled = true;
    }
    function onVisibilityChange() {
        if (document.hidden) markHandled();
    }

    window.addEventListener('blur', markHandled);
    document.addEventListener('visibilitychange', onVisibilityChange);

    window.location.href = url;

    setTimeout(function() {
        window.removeEventListener('blur', markHandled);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        if (!handled) {
            showMailtoFallback(details);
        }
    }, 1500);
}

function bindMailtoLinks(root) {
    if (!root) return;
    root.querySelectorAll('a[href^="mailto:"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openMailtoWithFallback(link.getAttribute('href'));
        });
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
    const camera = !image.isSession && EQUIPMENT_BY_ID[image.cameraId] ? EQUIPMENT_BY_ID[image.cameraId].name : '';
    const lens = !image.isSession && EQUIPMENT_BY_ID[image.lensId] ? EQUIPMENT_BY_ID[image.lensId].name : '';

    form.photoId.value = image.isSession ? '' : (image.name || '');
    form.page.value = currentPage;
    form.enquiryAction.value = action;
    form.camera.value = camera;
    form.lens.value = lens;

    const subject = image.isSession
        ? `Enquiry: ${ENQUIRY_LABELS[action] || image.title || 'Session enquiry'}`
        : `Enquiry: ${ENQUIRY_LABELS[action] || 'Photo enquiry'} (${image.name || ''})`;

    const bodyLines = [
        `Name: ${form.name.value}`,
        `Email: ${form.email.value}`,
        `Phone: ${form.phone.value}`,
        '',
        form.message.value,
        '',
        '---'
    ];
    if (image.isSession) {
        bodyLines.push(`Session: ${image.title || ''}`, `Page: ${currentPage}`, `Action: ${action}`);
    } else {
        bodyLines.push(
            `Photo: ${image.name || ''}`,
            `Page: ${currentPage}`,
            `Action: ${action}`,
            `Camera: ${camera}`,
            `Lens: ${lens || 'n/a'}`
        );
    }

    const mailtoUrl = `mailto:hello@plushka.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    openMailtoWithFallback(mailtoUrl);
});

document.addEventListener("keydown", function(event) {
    const mailtoFallback = document.getElementById("mailto-fallback");
    if (mailtoFallback && !mailtoFallback.hidden && event.key === "Escape") {
        closeMailtoFallback();
        return;
    }

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

    bindMailtoLinks(document.querySelector('.footer'));

    document.querySelector('.mailto-fallback-close').addEventListener('click', closeMailtoFallback);
    document.querySelector('.mailto-fallback-backdrop').addEventListener('click', closeMailtoFallback);

    document.getElementById('mailto-fallback-copy').addEventListener('click', function() {
        const address = document.getElementById('mailto-fallback-address').textContent;
        const subject = document.getElementById('mailto-fallback-subject').textContent;
        const body = document.getElementById('mailto-fallback-body').value;
        const text = `To: ${address}\nSubject: ${subject}\n\n${body}`;
        const btn = this;

        navigator.clipboard.writeText(text).then(function() {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('mailto-fallback-copied');
            setTimeout(function() {
                btn.textContent = original;
                btn.classList.remove('mailto-fallback-copied');
            }, 1500);
        });
    });
    
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