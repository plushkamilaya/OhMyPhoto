const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');
const crypto = require('crypto');

const PHOTOS_PATH = '/photos';

const pages = require('./pages');

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

async function copyImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .jpeg({ quality: 95 })
            .toFile(outputPath);

        return true
    } catch (error) {
        console.error(`Error copying ${inputPath}:`, error.message);
        return false;
    }
}

async function processImages() {
    const allImages = new Set();
    
    pages.forEach(page => {
        if (page.images && page.images.length > 0) {
            page.images.forEach(img => {
                allImages.add(img);
            });
        }
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
                const fullSuccess = await copyImage(inputPath, fullPath);
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
        const filename = path.basename(image);
        const previewSrc = `${PHOTOS_PATH}/preview_${filename}`;
        const fullSrc = `${PHOTOS_PATH}/${filename}`;
        
        const previewHash = fs.existsSync(path.join(buildDir, previewSrc)) ? 
            getFileHash(path.join(buildDir, previewSrc)) : '';
        const fullHash = fs.existsSync(path.join(buildDir, fullSrc)) ? 
            getFileHash(path.join(buildDir, fullSrc)) : '';

        return `
                <div class="gallery-item">
                    <img src="${previewSrc}${previewHash ? `?v=${previewHash}` : ''}" data-img-name="${image}" data-full-src="${fullSrc}${fullHash ? `?v=${fullHash}` : ''}" alt="${page.title ? page.title + ' photography' : 'Photography'}">
                </div>`;
    }).join('');
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
                    <p>📷 You can see more of my work on <a href="https://www.google.com/maps/contrib/110279442478436443087/photos" target="_blank" rel="noopener noreferrer">Google Maps</a>.</p>
                </div>
            </div>
            <div class="about-content" style="gap: 0; padding-top: 30px;">
                <h2>My Gear Essentials</h2>
            </div>
            <div class="about-content" style="gap: 0;">
                <iframe src="https://kit.co/embed?url=https%3A%2F%2Fkit.co%2Fplushka%2Fplushka-s-photo-kit" style="display: block; border: 0px; margin: 0 auto; width: 100%; height: 100vw; max-width: 1160px; max-height: 1160px" scrolling="no"></iframe>
            </div>`;
}



function generateContent(page) {
    switch (page.template) {
        case 'gallery':
            return `<div class="gallery-grid">\n                ${generateGalleryHTML(page.images, page)}\n            </div>`;
        case 'about':
            return generateAboutHTML(page);
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
            if (!allImages.has(image)) {
                const originalExtension = path.extname(image);
                const previewPath = `${PHOTOS_PATH}/preview_${path.basename(image, originalExtension)}${originalExtension}`;
                const fullPath = `${PHOTOS_PATH}/${path.basename(image, originalExtension)}${originalExtension}`;
                
                const previewHash = fs.existsSync(path.join(buildDir, previewPath)) ? 
                    getFileHash(path.join(buildDir, previewPath)) : '';
                const fullHash = fs.existsSync(path.join(buildDir, fullPath)) ? 
                    getFileHash(path.join(buildDir, fullPath)) : '';
                
                allImages.set(image, {
                    preview: `${previewPath}${previewHash ? `?v=${previewHash}` : ''}`,
                    full: `${fullPath}${fullHash ? `?v=${fullHash}` : ''}`,
                    name: path.basename(image, originalExtension),
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
        page.images.forEach(image => {
            if (!allImages.has(image)) {
                const originalExtension = path.extname(image);
                const previewPath = `${PHOTOS_PATH}/preview_${path.basename(image, originalExtension)}${originalExtension}`;
                const fullPath = `${PHOTOS_PATH}/${path.basename(image, originalExtension)}${originalExtension}`;
                
                const previewHash = fs.existsSync(path.join(buildDir, previewPath)) ? 
                    getFileHash(path.join(buildDir, previewPath)) : '';
                const fullHash = fs.existsSync(path.join(buildDir, fullPath)) ? 
                    getFileHash(path.join(buildDir, fullPath)) : '';
                
                allImages.set(image, {
                    preview: `${previewPath}${previewHash ? `?v=${previewHash}` : ''}`,
                    full: `${fullPath}${fullHash ? `?v=${fullHash}` : ''}`,
                    name: path.basename(image, originalExtension),
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
        if (page.images && page.images.length > 0) {
            page.images.forEach(img => {
                const filename = path.basename(img);
                usedPhotos.add(filename);
            });
        }
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
        .filter(page => page.name !== 'index')
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
