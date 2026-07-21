const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');
const crypto = require('crypto');

const PHOTOS_PATH = '/photos';

const pages = require('./pages');

function imgSrc(image) {
    return typeof image === 'string' ? image : image.src;
}

function collectPageImageSrcs(page) {
    const images = [
        ...(page.images || []),
        ...(page.galleryImages || []),
        ...(page.sections || []).flatMap(section => section.images || [])
    ];
    return images.map(imgSrc);
}

const buildDir = './build';
const buildPhotosDir = './build/photos';

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
}

if (!fs.existsSync(buildPhotosDir)) {
    fs.mkdirSync(buildPhotosDir);
}

async function optimizeImage(inputPath, outputPath, maxSize = 1000) {
    try {
        await sharp(inputPath)
            .resize(maxSize, maxSize, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: 85 })
            .toFile(outputPath);

        return true
    } catch (error) {
        console.error(`Error optimizing ${inputPath}:`, error.message);
        return false;
    }
}

async function processImages() {
    const allImages = new Set();
    
    pages.forEach(page => {
        collectPageImageSrcs(page).forEach(src => allImages.add(src));
    });

    let hasErrors = false;
    const errors = [];

    for (const filename of allImages) {
        const inputPath = '.' + PHOTOS_PATH + '/' + filename;
        const previewPath = path.join(buildPhotosDir, `preview_${filename}`);
        const fullPath = path.join(buildPhotosDir, filename);

        try {
            if (fs.existsSync(previewPath)) {
                // Preview already exists, skip
            } else {
                const previewSuccess = await optimizeImage(inputPath, previewPath, 1000);
                if (!previewSuccess) {
                    hasErrors = true;
                    errors.push(`Failed to create preview for ${filename}`);
                }
            }

            if (fs.existsSync(fullPath)) {
                // Full version already exists, skip
            } else {
                const fullSuccess = await optimizeImage(inputPath, fullPath, 3000);
                if (!fullSuccess) {
                    hasErrors = true;
                    errors.push(`Failed to copy full version for ${filename}`);
                }
            }
        } catch (error) {
            hasErrors = true;
            errors.push(`Error processing ${filename}: ${error.message}`);
        }
    }

    if (hasErrors) {
        console.error('❌ Build failed due to image processing errors:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }
}

const template = fs.readFileSync('template.html', 'utf8');

function generateGalleryHTML(images, page) {
    if (!images || images.length === 0) {
        return '';
    }

    return images.map(image => {
        const src = imgSrc(image);
        const filename = path.basename(src);
        const previewSrc = `${PHOTOS_PATH}/preview_${filename}`;
        const fullSrc = `${PHOTOS_PATH}/${filename}`;

        const previewHash = fs.existsSync(path.join(buildDir, previewSrc)) ?
            getFileHash(path.join(buildDir, previewSrc)) : '';
        const fullHash = fs.existsSync(path.join(buildDir, fullSrc)) ?
            getFileHash(path.join(buildDir, fullSrc)) : '';

        const wideSpan = typeof image.wide === 'number' ? image.wide : (image.wide ? 2 : 0);
        const wideClass = wideSpan > 1 ? ` gallery-item--wide-${wideSpan}` : '';

        return `
                <div class="gallery-item${wideClass}">
                    <img src="${previewSrc}${previewHash ? `?v=${previewHash}` : ''}" data-img-name="${src}" data-full-src="${fullSrc}${fullHash ? `?v=${fullHash}` : ''}" alt="${page.title ? page.title + ' photography' : 'Photography'}">
                </div>`;
    }).join('');
}

const gearDir = './gear';

function gearOutputName(image) {
    return `gear_${path.basename(image, path.extname(image))}.jpg`;
}

async function processGearImages() {
    const allGearImages = new Set();

    pages.forEach(page => {
        if (page.gear && page.gear.length > 0) {
            page.gear.forEach(item => {
                if (item.image) {
                    allGearImages.add(item.image);
                }
            });
        }
    });

    const errors = [];

    for (const filename of allGearImages) {
        const inputPath = path.join(gearDir, filename);
        const outputPath = path.join(buildPhotosDir, gearOutputName(filename));

        if (!fs.existsSync(inputPath)) {
            errors.push(`Missing gear image: ${inputPath}`);
            continue;
        }

        if (fs.existsSync(outputPath)) {
            continue;
        }

        try {
            // Two passes: trim runs before flatten/linear inside a single
            // sharp pipeline, so a transparent border has to be trimmed
            // first. The linear multiply pushes near-white backdrops baked
            // into vendor renders (#f5f5f7, #fafafa) to pure white, then the
            // second pass trims the now-white margins.
            const trimmed = await sharp(inputPath)
                .trim({ threshold: 10 })
                .flatten({ background: '#ffffff' })
                .linear(255 / 245, 0)
                .toBuffer();

            await sharp(trimmed)
                .trim({ background: '#ffffff', threshold: 10 })
                .resize(600, 600, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .flatten({ background: '#ffffff' })
                .jpeg({ quality: 85 })
                .toFile(outputPath);
        } catch (error) {
            errors.push(`Error processing gear image ${filename}: ${error.message}`);
        }
    }

    if (errors.length > 0) {
        console.error('❌ Build failed due to gear image errors:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }
}

function generateAboutHTML(page) {
    const aboutPhoto = page.images[0];
    const aboutPhotoHash = fs.existsSync(path.join(buildDir, `${PHOTOS_PATH}/${aboutPhoto}`)) ? 
        getFileHash(path.join(buildDir, `${PHOTOS_PATH}/${aboutPhoto}`)) : '';
        
    return `
            <div class="about-content" style="gap: 0; padding-top: 40px;">
                <h2>Hello, I'm Maria</h2>
            </div>
            <div class="about-content">
                <div class="about-photo">
                    <img src="${PHOTOS_PATH}/${aboutPhoto}${aboutPhotoHash ? `?v=${aboutPhotoHash}` : ''}" alt="${page.title ? page.title + ' photography' : 'Photography'}">
                </div>
                <div class="about-text">
                    <p>I’m a photographer from Täby. I love to notice when everything suddenly comes together in one perfect frame, but I also enjoy imagining stories in advance, thinking about the people, the mood, and how the photos will connect with each other.</p>
                    <p>Before a shoot, I often create mood boards with ideas — not to follow them strictly, but to get into the right mood and let ideas flow. It’s my way of making sure every session has its own special moments, even though those unexpected “magic shots” almost always appear on their own.</p>
                    <p>Whether it’s portraits, events or commercial projects, I always look for authenticity and emotions. For me, a good photograph is one that you can feel, not just see.</p>
                    <p>📷 My photography also documents the neighbourhood — see our <a href="/#local-commitment" data-page="local-commitment">local commitment</a> on Google Maps.</p>
                    <p>Photography portfolio by Mariia Rytikova. Part of <a href="https://lovkoja.se" target="_blank" rel="noopener noreferrer">Lövkoja</a>.</p>
                </div>
            </div>
            <div class="about-content" style="gap: 0; padding-top: 30px;">
                <h2>My Gear Essentials</h2>
            </div>
            <div class="about-content" style="gap: 0;">
                <div class="gear-grid">${generateGearHTML(page.gear)}
                </div>
            </div>`;
}

function generateCommunityHTML(page) {
    const photo = page.images[0];
    const previewSrc = `${PHOTOS_PATH}/preview_${photo}`;
    const fullSrc = `${PHOTOS_PATH}/${photo}`;

    const previewHash = fs.existsSync(path.join(buildDir, previewSrc)) ?
        getFileHash(path.join(buildDir, previewSrc)) : '';
    const fullHash = fs.existsSync(path.join(buildDir, fullSrc)) ?
        getFileHash(path.join(buildDir, fullSrc)) : '';

    return `
            <div class="about-content" style="gap: 0; padding-top: 40px;">
                <h2>Local Commitment</h2>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <p>Lövkoja Studio provides professional photography and visual content for businesses, organisations and local projects.</p>
                    <p>Alongside our commissioned work, we independently document a selected number of public spaces, local destinations and neighbourhood places that deserve better visual representation.</p>
                    <p>The photographs are published on Google Maps, helping people understand, discover and navigate the area while contributing to a more accurate and attractive digital image of the local community.</p>
                    <p>Locations are selected independently by Lövkoja as part of our ongoing commitment to the places where we live and work.</p>
                    <a href="https://www.google.com/maps/contrib/110279442478436443087/photos" target="_blank" rel="noopener noreferrer" class="cta-link">View contributions on Google Maps</a>
                </div>
                <div class="community-photo">
                    <img src="${previewSrc}${previewHash ? `?v=${previewHash}` : ''}" data-img-name="${photo}" data-full-src="${fullSrc}${fullHash ? `?v=${fullHash}` : ''}" alt="Mariia Rytikova's Local Guide contributions on Google Maps">
                </div>
            </div>
            <div class="about-content" style="gap: 0; padding-top: 30px;">
                <h2>Local visual impact</h2>
            </div>
            <div class="about-content" style="gap: 0;">
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">500,000+</span>
                        <span class="stat-label">photo views on Google Maps</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">Local places</span>
                        <span class="stat-label">documented and shared</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">Täby</span>
                        <span class="stat-label">and the Stockholm area</span>
                    </div>
                </div>
            </div>${page.galleryImages && page.galleryImages.length > 0 ? `
            <div class="about-content" style="gap: 0; padding-top: 30px;">
                <h2>From the neighbourhood</h2>
            </div>
            <div class="about-content">
                <div class="gallery-grid neighbourhood-gallery">
                    ${generateGalleryHTML(page.galleryImages, page)}
                </div>
                <div class="about-text">
                    <p>[Placeholder] A couple more frames from the same local places we document — full caption coming soon.</p>
                </div>
            </div>` : ''}`;
}

function generateGalleryIntroHTML(page) {
    const intro = page.intro || {};

    return `
            <div class="about-content" style="gap: 0; padding-top: 40px;">
                <h2>${intro.heading || page.title}</h2>
            </div>
            <div class="about-content" style="gap: 0;">
                <div class="placeholder-box">
                    <p>${intro.description || ''}</p>
                </div>
            </div>
            <div class="gallery-grid">
                ${generateGalleryHTML(page.images, page)}
            </div>`;
}

function generateSessionsSplitHTML(page) {
    const intro = page.intro || {};
    const options = page.sessionOptions || [];

    const buttons = options.map(option => `
                    <button type="button" class="session-btn">
                        <span class="session-btn-title">${option.heading}</span>
                        <span class="session-btn-desc">${option.description}</span>
                    </button>`).join('');

    return `
            <div class="about-content" style="gap: 0; padding-top: 40px;">
                <h2>${intro.heading || page.title}</h2>
            </div>
            <div class="about-content" style="gap: 0;">
                <div class="placeholder-box">
                    <p>${intro.description || ''}</p>
                </div>
            </div>
            <div class="session-split">
                <div class="session-gallery gallery-grid">
                    ${generateGalleryHTML(page.images, page)}
                </div>
                <div class="session-actions">${buttons}
                </div>
            </div>`;
}

function generateGearHTML(gear) {
    if (!gear || gear.length === 0) {
        return '';
    }

    return gear.map(item => {
        const name = item.url
            ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>`
            : item.name;

        let photo = '';
        if (item.image) {
            const outputName = gearOutputName(item.image);
            const outputPath = path.join(buildPhotosDir, outputName);
            const hash = fs.existsSync(outputPath) ? getFileHash(outputPath) : '';
            photo = `
                        <img src="${PHOTOS_PATH}/${outputName}${hash ? `?v=${hash}` : ''}" alt="${item.name}" loading="lazy">`;
        }

        return `
                    <div class="gear-item">${photo}
                        <span class="gear-category">${item.category}</span>
                        <h3 class="gear-name">${name}</h3>
                        <p>${item.description}</p>
                    </div>`;
    }).join('');
}



function generateContent(page) {
    switch (page.template) {
        case 'gallery':
            return `<div class="gallery-grid">\n                ${generateGalleryHTML(page.images, page)}\n            </div>`;
        case 'gallery-intro':
            return generateGalleryIntroHTML(page);
        case 'sessions-split':
            return generateSessionsSplitHTML(page);
        case 'about':
            return generateAboutHTML(page);
        case 'community':
            return generateCommunityHTML(page);
        default:
            return '';
    }
}

function generateSpaContent() {
    const pageContents = {};
    
    pages.forEach(page => {
        const content = generateContent(page);
        pageContents[page.name] = content;
    });
    
    return pageContents;
}



function generateAllSiteImages() {
    const allImages = new Map();

    pages.forEach(page => {
        page.images.forEach(image => {
            const src = imgSrc(image);
            if (!allImages.has(src)) {
                const originalExtension = path.extname(src);
                const previewPath = `${PHOTOS_PATH}/preview_${path.basename(src, originalExtension)}${originalExtension}`;
                const fullPath = `${PHOTOS_PATH}/${path.basename(src, originalExtension)}${originalExtension}`;

                const previewHash = fs.existsSync(path.join(buildDir, previewPath)) ?
                    getFileHash(path.join(buildDir, previewPath)) : '';
                const fullHash = fs.existsSync(path.join(buildDir, fullPath)) ?
                    getFileHash(path.join(buildDir, fullPath)) : '';

                allImages.set(src, {
                    preview: `${previewPath}${previewHash ? `?v=${previewHash}` : ''}`,
                    full: `${fullPath}${fullHash ? `?v=${fullHash}` : ''}`,
                    name: path.basename(src, originalExtension),
                    alt: page.title ? page.title + ' photography' : 'Photography'
                });
            }
        });
    });

    const imagesArray = Array.from(allImages.values());
    const imagesJson = JSON.stringify(imagesArray, null, 8);

    return `        const allSiteImages = ${imagesJson};`;
}

function generateAllSiteImagesJson() {
    const allImages = new Map();

    pages.forEach(page => {
        collectPageImageSrcs(page).forEach(src => {
            if (!allImages.has(src)) {
                const originalExtension = path.extname(src);
                const previewPath = `${PHOTOS_PATH}/preview_${path.basename(src, originalExtension)}${originalExtension}`;
                const fullPath = `${PHOTOS_PATH}/${path.basename(src, originalExtension)}${originalExtension}`;

                const previewHash = fs.existsSync(path.join(buildDir, previewPath)) ?
                    getFileHash(path.join(buildDir, previewPath)) : '';
                const fullHash = fs.existsSync(path.join(buildDir, fullPath)) ?
                    getFileHash(path.join(buildDir, fullPath)) : '';

                allImages.set(src, {
                    preview: `${previewPath}${previewHash ? `?v=${previewHash}` : ''}`,
                    full: `${fullPath}${fullHash ? `?v=${fullHash}` : ''}`,
                    name: path.basename(src, originalExtension),
                    alt: page.title ? page.title + ' photography' : 'Photography'
                });
            }
        });
    });

    const imagesArray = Array.from(allImages.values());
    return JSON.stringify(imagesArray, null, 8);
}

function minifyCSS(inputPath, outputPath) {
    try {
        execSync(`npx clean-css-cli -o ${outputPath} ${inputPath}`, { stdio: 'inherit' });
    } catch (error) {
        console.error('CSS minification failed:', error.message);
        fs.copyFileSync(inputPath, outputPath);
    }
}

function getFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

function minifyJS(inputPath, outputPath) {
    try {
        execSync(`npx terser ${inputPath} -o ${outputPath} --compress --mangle`, { stdio: 'inherit' });
    } catch (error) {
        console.error('JS minification failed:', error.message);
        fs.copyFileSync(inputPath, outputPath);
    }
}

function checkUnusedPhotos() {
    const photosDir = './photos';
    if (!fs.existsSync(photosDir)) {
        const error = 'Photos directory not found';
        console.error(`❌ Error: ${error}`);
        return {
            error: true,
            message: error,
            total_photos: 0,
            used_photos: 0,
            unused_photos: 0,
            unused_found: false,
            unused_list: [],
            total_unused_size_mb: 0
        };
    }
    
    const allPhotoFiles = fs.readdirSync(photosDir)
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].includes(ext);
        })
        .map(file => file);
    
    const usedPhotos = new Set();
    pages.forEach(page => {
        collectPageImageSrcs(page).forEach(src => {
            usedPhotos.add(path.basename(src));
        });
    });
    
    const missingPhotos = [];
    usedPhotos.forEach(photoName => {
        const photoPath = path.join(photosDir, photoName);
        if (!fs.existsSync(photoPath)) {
            missingPhotos.push(photoName);
        }
    });
    
    if (missingPhotos.length > 0) {
        const error = `Missing required photos: ${missingPhotos.join(', ')}`;
        return {
            error: true,
            message: error,
            missing_photos: missingPhotos,
            total_photos: allPhotoFiles.length,
            used_photos: usedPhotos.size,
            unused_photos: 0,
            unused_found: false,
            unused_list: [],
            total_unused_size_mb: 0
        };
    }
    
    const unusedPhotos = allPhotoFiles.filter(file => !usedPhotos.has(file));
    
    let totalUnusedSize = 0;
    const unusedList = unusedPhotos.map(file => {
        const filePath = path.join(photosDir, file);
        const stats = fs.statSync(filePath);
        const sizeInMB = (stats.size / (1024 * 1024));
        totalUnusedSize += sizeInMB;
        return {
            name: file,
            size_mb: sizeInMB,
            size_formatted: `${sizeInMB.toFixed(2)} MB`
        };
    });
    
    if (unusedPhotos.length > 0) {
        console.log(`⚠️  Found ${unusedPhotos.length} unused photos:`);
        unusedList.forEach(item => {
            console.log(`   📸 ${item.name} (${item.size_formatted})`);
        });
    }
    
    let totalSize = 0;
    allPhotoFiles.forEach(file => {
        const filePath = path.join(photosDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
    });
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    let usedSize = 0;
    usedPhotos.forEach(photoName => {
        const photoPath = path.join(photosDir, photoName);
        if (fs.existsSync(photoPath)) {
            const stats = fs.statSync(photoPath);
            usedSize += stats.size;
        }
    });
    const usedSizeMB = (usedSize / (1024 * 1024)).toFixed(2);
    
    console.log(`\n📊 Summary: ${usedPhotos.size} photos used (${usedSizeMB} MB)`);
    
    return {
        error: false,
        total_photos: allPhotoFiles.length,
        used_photos: usedPhotos.size,
        unused_photos: unusedPhotos.length,
        unused_found: unusedPhotos.length > 0,
        unused_list: unusedList,
        total_unused_size_mb: totalUnusedSize,
        total_size_mb: parseFloat(totalSizeMB)
    };
}

async function build() {
    const photoAnalysis = checkUnusedPhotos();
    
    if (photoAnalysis.error) {
        console.error(`❌ Build failed: ${photoAnalysis.message}`);
        process.exit(1);
    }

    await processImages();
    await processGearImages();


    minifyCSS('./styles.css', path.join(buildDir, 'styles.css'));
    const cssHash = getFileHash(path.join(buildDir, 'styles.css'));

    const pageContents = generateSpaContent();
    const allSiteImagesJson = generateAllSiteImagesJson();
    
    let script = fs.readFileSync('./script.js', 'utf8');
    script = script.replace(/ALL_SITE_IMAGES/, allSiteImagesJson);
    
    const pagesWithContent = pages.map(page => ({
        name: page.name,
        title: page.title,
        content: pageContents[page.name] || ''
    }));
    
    const pagesDataJson = JSON.stringify(pagesWithContent, null, 8);
    script = script.replace(/PAGES_DATA_PLACEHOLDER/, pagesDataJson);
    
    const tempScriptPath = path.join(buildDir, 'temp-script.js');
    fs.writeFileSync(tempScriptPath, script);
    minifyJS(tempScriptPath, path.join(buildDir, 'script.js'));
    fs.unlinkSync(tempScriptPath);
    
    const scriptHash = getFileHash(path.join(buildDir, 'script.js'));
    
    let html = template;
    html = html.replace(/href="\/styles\.css\?v=CSS_HASH"/, `href="/styles.css?v=${cssHash}"`);
    html = html.replace(/src="\/script\.js\?v=JS_HASH"/, `src="/script.js?v=${scriptHash}"`);
    html = html.replace(/PAGE_TITLE/, '');
    
    const navigation = pages
        .filter(page => page.name !== 'index' && !page.hidden)
        .map(page => `<li><a href="/#${page.name}" data-page="${page.name}">${page.title}</a></li>`)
        .join('\n                    ');
    html = html.replace(/NAVIGATION_PLACEHOLDER/, navigation);
    
    const indexContent = pageContents.index;
    html = html.replace(/<div id="page-content">\s*<\/div>/, `<div id="page-content">\n                ${indexContent}\n            </div>`);
    
    fs.writeFileSync(path.join(buildDir, 'index.html'), html);
    
    const faviconFiles = [
        'favicon.ico',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-48x48.png',
        'apple-touch-icon.png',
        'manifest.json'
    ];
    
    faviconFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.copyFileSync(file, path.join(buildDir, file));
        }
    });

    console.log('Build completed!');
}

build().catch(console.error); 
