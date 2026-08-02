# Maria Rytikova Photography Portfolio

A modern, responsive photography portfolio website built as a Single Page Application (SPA) with instant navigation, optimized images, and a beautiful lightbox gallery.

## ✨ Features

- **Single Page Application** - Seamless navigation without page reloads
- **Responsive Design** - Optimized for all devices and screen sizes
- **Image Optimization** - Automatic generation of previews and full-size images with hash-based versioning
- **Lightbox Gallery** - Interactive image viewing with navigation
- **Hash-based Routing** - Direct links to pages and specific images
- **Performance Optimized** - Lazy loading, minified assets, and efficient caching

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd OhMyPhoto

# Install dependencies
npm install

# Build the website
npm run build

# Open the built website
open build/index.html
```

## 📁 Project Structure

```
OhMyPhoto/
├── template.html          # SPA template
├── script.js             # SPA JavaScript logic
├── styles.css            # Main stylesheet
├── build.js              # Build configuration
├── pages.js              # Page configuration
├── package.json          # Node.js configuration
├── photos/               # Source images
│   ├── ES7A3625.JPG
│   ├── ES7A6160.JPG
│   └── ...
├── build/                # Generated website (after build)
│   ├── index.html        # Complete SPA website
│   ├── script.js         # Minified JavaScript
│   ├── styles.css        # Minified CSS
│   └── photos/           # Optimized images
│       ├── ES7A3625.JPG           # Full-size version
│       ├── preview_ES7A3625.JPG   # Thumbnail
│       └── ...
└── README.md             # This file
```

## 🛠️ Available Scripts

```bash
# Build the website
npm run build

# Force rebuild all images
npm run build:force

# Clean build directory
npm run clean

# Open built website
npm run open
```

## 🎨 Page Configuration

Configure your portfolio pages in `pages.js`:

```javascript
const pages = [
    {
        name: 'index',           // Page identifier
        title: null,             // null for homepage (no title)
        template: 'gallery',     // Template type
        images: [
            'ES7A3625.JPG',
            'ES7A6160.JPG',
            'ES7A6143.JPG'
            // ... more images
        ]
    },
    {
        name: 'Restaurants',
        title: 'Restaurants',
        template: 'gallery',
        images: [
            'ES7A6101.JPG',
            'ES7A6118.JPG',
            'ES7A6137-1.jpg'
            // ... more images
        ]
    },
    {
        name: 'Kids',
        title: 'Kids',
        template: 'gallery',
        images: [
            'IMG_2433.JPG',
            'IMG_2724.JPG',
            'IMG_3408.jpg'
            // ... more images
        ]
    },
    {
        name: 'places',
        title: 'Places',
        template: 'gallery',
        images: [
            'ES7A3178.JPG',
            'ES7A3332-1.jpg',
            'ES7A2999.jpg'
            // ... more images
        ]
    },
    {
        name: 'about',
        title: 'About',
        template: 'about',
        images: [
            'mary-rytikova-photo.jpg'
        ]
    }
];
```

## 🖼️ Image Configuration

Images are now configured as simple filename strings in the `images` array:

```javascript
// Old format (no longer used):
// {
//     src: './photos/image.jpg',
//     name: 'unique-name',
//     alt: 'Description'
// }

// New format:
images: [
    'ES7A3625.JPG',
    'ES7A6160.JPG',
    'IMG_2433.JPG'
]
```

The build system automatically:
- Generates preview thumbnails (max 1000x1000px, 85% quality)
- Creates optimized full-size versions (95% quality)
- Adds hash-based versioning for cache busting
- Handles all image processing automatically

## 🎯 Available Templates

### Gallery Template (`gallery`)
- Responsive grid layout (4 columns → 2 columns on mobile)
- Interactive lightbox with navigation
- Optimized thumbnails for fast loading
- Keyboard navigation support
- Touch-friendly swipe gestures

### About Template (`about`)
- Author portrait display
- Text content area with personal information
- Gear showcase with Kit.co integration
- Responsive design

## ⚡ Image Optimization

The build system automatically creates two versions of each image with hash-based versioning:

### Thumbnails
- **Size**: Max 1000x1000px
- **Quality**: 85%
- **Format**: JPEG
- **Usage**: Gallery display
- **Versioning**: Automatic hash-based cache busting

### Full-size Images
- **Size**: Original dimensions
- **Quality**: 95%
- **Format**: JPEG
- **Usage**: Lightbox viewing
- **Versioning**: Automatic hash-based cache busting

### Example Optimization
```
Original: ES7A3625.JPG (2.1MB)
Thumbnail: preview_ES7A3625.JPG (245KB) - 8.5x smaller!
Full-size: ES7A3625.JPG (2.1MB) - for lightbox
Versioned URLs: /photos/preview_ES7A3625.JPG?v=a1b2c3d4
```

## 🌐 Navigation & Routing

The SPA uses hash-based routing for instant navigation:

- **Home** → `#index` (or `/`)
- **Restaurants** → `#Restaurants`
- **Kids** → `#Kids`
- **Places** → `#places`
- **About** → `#about`

### Direct Image Links
- `#Restaurants?image=ES7A6101` - Opens specific image in lightbox

## 🔧 Adding New Pages

1. **Configure the page** in `pages.js`:
```javascript
{
    name: 'new-page',
    title: 'New Page',
    template: 'gallery', // or 'about'
    images: [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
    ]
}
```

2. **Build the website**:
```bash
npm run build
```

3. **Access the page** at `#new-page`

## 🚀 Deployment

After building (`npm run build`), the `build/` folder contains your production-ready website:

### GitHub Actions Deployment

This project includes GitHub Actions workflow for automatic deployment to Cloudflare Pages. The workflow is located at `.github/workflows/deploy.yml`.

#### Required GitHub Secrets

To enable automatic deployment, you need to configure the following secrets in your GitHub repository:

1. **Go to your repository** → **Settings** → **Secrets and variables** → **Actions**

2. **Add the following secrets:**

   | Secret Name | Description | Required |
   |-------------|-------------|----------|
   | `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token with Pages deployment permissions | ✅ |
   | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | ✅ |

3. **Add the following variables:**

   | Variable Name | Description | Required |
   |---------------|-------------|----------|
   | `CLOUDFLARE_PROJECT_NAME` | Your Cloudflare Pages project name | ✅ |
   | `WEBSITE_URL` | Your production website URL (e.g., https://your-project-name.pages.dev) | ✅ |

#### How to Get Cloudflare Credentials

1. **API Token**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **My Profile** → **API Tokens**
   - Click **Create Token**
   - Use **Custom token** template
   - Add permissions: **Cloudflare Pages** → **Edit**
   - Add account resources: **Include** → **All accounts**

2. **Account ID**:
   - In Cloudflare Dashboard, look at the right sidebar
   - Your Account ID is displayed there

3. **Project Name**:
   - Go to **Pages** in Cloudflare Dashboard
   - Create a new project or use existing one
   - The project name is what you'll use for `CLOUDFLARE_PROJECT_NAME`

#### Automatic Deployment

Once secrets are configured:
- Every push to `main` branch triggers automatic build and deployment
- The workflow builds your site and deploys to Cloudflare Pages
- Your portfolio will be available at `https://your-project-name.pages.dev`

### Static Hosting

```bash
# Copy to web server
scp -r build/* user@server:/var/www/html/

# GitHub Pages
cp -r build/* docs/

# Netlify/Vercel
# Upload the build/ folder
```

### Local Testing
```bash
# Open built website
open build/index.html

# Or serve with a local server
npx serve build/
```

## 📱 Responsive Features

- **Mobile-first design** - Optimized for all screen sizes
- **Adaptive navigation** - Collapsible menu on mobile
- **Responsive gallery** - Grid adjusts from 4 to 2 columns
- **Touch-friendly** - Optimized for mobile interactions with swipe gestures
- **Fast loading** - Optimized images and assets

## ⚡ Performance Features

- **Lazy loading** - Images load as needed
- **Asset minification** - CSS and JavaScript optimization
- **Image optimization** - Automatic compression and resizing
- **Hash-based versioning** - Efficient caching with automatic cache busting
- **Lightweight** - Minimal dependencies and optimized code

## 🔍 SEO & Accessibility

- **Semantic HTML** - Proper heading structure and landmarks
- **Alt text support** - Descriptive text for all images
- **Keyboard navigation** - Full keyboard support
- **Screen reader friendly** - Proper ARIA labels and structure
- **Meta tags** - Optimized for search engines

## 📦 Dependencies

- **Node.js** - Runtime environment
- **sharp** - High-performance image processing
- **clean-css-cli** - CSS minification
- **terser** - JavaScript minification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm run build`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For questions or support, please open an issue in the repository or contact the maintainer.

---

**Built with ❤️ for showcasing beautiful photography** 