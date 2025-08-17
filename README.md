# Mary Rytikova Photography Portfolio

A modern, responsive photography portfolio website built as a Single Page Application (SPA) with instant navigation, optimized images, and a beautiful lightbox gallery.

## ✨ Features

- **Single Page Application** - Seamless navigation without page reloads
- **Responsive Design** - Optimized for all devices and screen sizes
- **Image Optimization** - Automatic generation of previews and full-size images
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
cd photos

# Install dependencies
npm install

# Build the website
npm run build

# Open the built website
open build/index.html
```

## 📁 Project Structure

```
photos/
├── template.html          # SPA template
├── script.js             # SPA JavaScript logic
├── styles.css            # Main stylesheet
├── build.js              # Build configuration
├── package.json          # Node.js configuration
├── photos/               # Source images
│   ├── H58A0655.jpg
│   ├── H58A0738.jpg
│   └── ...
├── build/                # Generated website (after build)
│   ├── index.html        # Complete SPA website
│   ├── script.js         # Minified JavaScript
│   ├── styles.css        # Minified CSS
│   └── photos/           # Optimized images
│       ├── H58A0655.jpg           # Full-size version
│       ├── preview_H58A0655.jpg   # Thumbnail
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

Configure your portfolio pages in `build.js`:

```javascript
const pages = [
    {
        name: 'index',           // Page identifier
        title: null,             // null for homepage (no title)
        template: 'gallery',     // Template type
        images: [
            { 
                src: './photos/H58A0655.jpg', 
                name: 'H58A0655', 
                alt: 'Portrait photography' 
            }
        ]
    },
    {
        name: 'things',
        title: 'Things',
        template: 'gallery',
        images: [/* your images */]
    },
    {
        name: 'about',
        title: 'About',
        template: 'about',
        images: [
            { 
                src: './photos/mary-rytikova-photo.jpg', 
                name: 'about-photo', 
                alt: 'Mary Rytikova portrait' 
            }
        ]
    }
];
```

## 🖼️ Image Configuration

Each image requires three properties:

```javascript
{
    src: './photos/image.jpg',     // Source file path
    name: 'unique-name',           // Unique identifier for lightbox
    alt: 'Description'             // Alt text for accessibility
}
```

## 🎯 Available Templates

### Gallery Template (`gallery`)
- Responsive grid layout (4 columns → 2 columns on mobile)
- Interactive lightbox with navigation
- Optimized thumbnails for fast loading
- Keyboard navigation support

### About Template (`about`)
- Author portrait display
- Text content area
- Responsive design

## ⚡ Image Optimization

The build system automatically creates two versions of each image:

### Thumbnails
- **Size**: Max 1000x1000px
- **Quality**: 85%
- **Format**: JPEG
- **Usage**: Gallery display

### Full-size Images
- **Size**: Original dimensions
- **Quality**: 95%
- **Format**: JPEG
- **Usage**: Lightbox viewing

### Example Optimization
```
Original: H58A0655.jpg (1.3MB)
Thumbnail: preview_H58A0655.jpg (189KB) - 7x smaller!
Full-size: H58A0655.jpg (1.3MB) - for lightbox
```

## 🌐 Navigation & Routing

The SPA uses hash-based routing for instant navigation:

- **Home** → `#index` (or `/`)
- **Things** → `#things`
- **People** → `#people`
- **Places** → `#places`
- **About** → `#about`

### Direct Image Links
- `#things?image=H58A0655` - Opens specific image in lightbox

## 🔧 Adding New Pages

1. **Configure the page** in `build.js`:
```javascript
{
    name: 'new-page',
    title: 'New Page',
    template: 'gallery', // or 'about'
    images: [
        { 
            src: './photos/image1.jpg', 
            name: 'image1', 
            alt: 'Description' 
        }
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
- **Touch-friendly** - Optimized for mobile interactions
- **Fast loading** - Optimized images and assets

## ⚡ Performance Features

- **Lazy loading** - Images load as needed
- **Asset minification** - CSS and JavaScript optimization
- **Image optimization** - Automatic compression and resizing
- **Versioned files** - Efficient caching with automatic updates
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