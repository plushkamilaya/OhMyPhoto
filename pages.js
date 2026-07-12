const pages = [
    {
        name: 'index',
        title: null,
        template: 'gallery',
        images: [
            'ES7A6137-1.jpg',
            'ES7A6143.JPG',
            'ES7A3590.JPG',
            'IMG_6213.JPG',
            'ES7A3612-1.jpg',
            'ES7A3168-1.jpg',
            'IMG_3408.jpg',
            'IMG_6146.jpg',
            'ES7A3332-1.jpg',
            'ES7A2999.jpg',
            'IMG_2724.JPG',
            'IMG_4172-1.jpg',
            'IMG_2433.JPG',
            'ES7A3625.JPG',
            'ES7A6160.JPG',
            'ES7A3178.JPG'
        ]
    },
    {
        name: 'Restaurants',
        title: 'Restaurants',
        template: 'gallery',
        images: [
            'ES7A6101.JPG',
            'ES7A6118.JPG',
            'ES7A6137-1.jpg',
            'ES7A6120.JPG',
            'ES7A4271-3.jpg',
            { src: 'ES7A3590.JPG', wide: 2 },
            'ES7A3612-1.jpg',
            'ES7A6160.JPG',
            'ES7A6143.JPG',
            'ES7A3625.JPG',
            'ES7A6156.JPG',
            'ES7A6124.jpg'
        ]
    },
    {
        name: 'Kids',
        title: 'Kids',
        template: 'gallery',
        images: [
            'IMG_2433.JPG',
            'IMG_2724.JPG',
            'IMG_3408.jpg',
            'IMG_6213.JPG',
            'IMG_3937-1.jpg',
            'IMG_4152_1.jpg',
            'IMG_4172-1.jpg',
            'IMG_6146.jpg'
        ]
    },
    {
        name: 'places',
        title: 'Places',
        template: 'gallery',
        images: [
            'ES7A3178.JPG',
            'ES7A3332-1.jpg',
            'ES7A2999.jpg',
            'ES7A3168-1.jpg'
        ]
    },
    {
        name: 'local-commitment',
        title: 'Local Commitment',
        template: 'community',
        hidden: true,
        images: [
            'google-maps-local-guide.jpg'
        ]
    },
    {
        name: 'about',
        title: 'About',
        template: 'about',
        images: [
            'mary-rytikova-photo.jpg'
        ],
        gear: [
            {
                category: 'Camera',
                name: 'Canon EOS R6',
                image: 'canon-eos-r6.jpg',
                url: 'https://www.canon-europe.com/cameras/eos-r6/',
                description: 'My main full-frame camera body. Fast, precise autofocus and in-body stabilisation deliver sharp, clean images even in low light — so no moment gets lost.'
            },
            {
                category: 'Lens',
                name: 'Canon RF 24-70mm F2.8L IS USM',
                image: 'canon-rf-24-70.jpg',
                url: 'https://www.canon-europe.com/lenses/rf-24-70mm-f2-8l-usm-lens/',
                description: 'My favorite for portraits, food, and all those moments when you don’t know what to expect. Sharp, flexible, and reliable in any light — this lens does it all with ease.'
            },
            {
                category: 'Lens',
                name: 'Canon RF 70-200mm F2.8L IS USM',
                image: 'canon-rf-70-200.jpg',
                url: 'https://www.canon-europe.com/lenses/rf-70-200mm-f2-8l-is-usm-lens/',
                description: 'Best for events, sports, portraits — and capturing kids without getting in their way. My biggest lens, but also the most discreet: sharp from a distance, fast in action.'
            },
            {
                category: 'Lenses',
                name: 'Canon RF 85mm F2 Macro IS STM & EF 50mm f/1.8 STM',
                image: 'canon-rf-85.jpg',
                url: 'https://www.canon-europe.com/lenses/rf-85mm-f2-macro-is-stm/',
                description: 'My go-to lenses for people, food, and details. Lightweight, fast, and easy to carry all day — yet they deliver glossy, cinematic results.'
            },
            {
                category: 'Second camera',
                name: 'Canon EOS 6D',
                image: 'canon-eos-6d.jpg',
                url: 'https://www.canon-europe.com/for_home/product_finder/cameras/digital_slr/eos_6d/',
                description: 'A reliable, time-proven full-frame camera for when a second body is needed. It has never let me down — always ready to back up the main setup with the same true Canon colours.'
            },
            {
                category: 'Lens',
                name: 'Canon EF 24-70mm f/2.8L II USM',
                image: 'canon-ef-24-70.jpg',
                url: 'https://www.canon-europe.com/lenses/ef-24-70mm-f-2-8l-ii-usm-lens/',
                description: 'The trusted companion to the 6D: a proven workhorse zoom, sharp and dependable shoot after shoot. Together they make a second setup I can always count on.'
            },
            {
                category: 'Stabilizer',
                name: 'DJI RS 3',
                image: 'dji-rs-3.png',
                url: 'https://www.dji.com/rs-3',
                description: 'Professional stabilizer for fluid, cinematic video. Carries heavy camera setups with ease and keeps every shot steady and clean.'
            },
            {
                category: 'Stabilizer',
                name: 'DJI OM 5',
                image: 'dji-om-5.png',
                url: 'https://www.dji.com/om-5',
                description: 'Light & smart phone stabilizer. Turns handheld phone clips into smooth, steady footage — perfect for behind-the-scenes and quick social videos.'
            },
            {
                category: 'Phone',
                name: 'Apple iPhone 16 Pro Max',
                image: 'iphone-16-pro-max.png',
                url: 'https://www.apple.com/iphone-16-pro/',
                description: 'Always with me — great for scouting, mood boards and behind-the-scenes. Paired with the OM 5 it shoots surprisingly cinematic video.'
            },
            {
                category: 'Drone',
                name: 'DJI Mini 2',
                image: 'dji-mini-2.png',
                url: 'https://www.dji.com/mini-2',
                description: 'Lightweight 4K drone. Adds a whole new perspective — crisp aerial shots that show places and venues at their very best.'
            },
            {
                category: 'Pocket camera',
                name: 'DJI Osmo Pocket',
                image: 'dji-osmo-pocket.png',
                url: 'https://www.dji.com/osmo-pocket',
                description: 'Super compact with tracking head — follows the subject smoothly, even if I walk away. Great for wide shots or when I need to move fast.'
            },
            {
                category: 'Action camera',
                name: 'DJI Action 2',
                image: 'dji-action-2.png',
                url: 'https://www.dji.com/action-2',
                description: 'Portable and waterproof — keeps recording even underwater. Super small, always ready for action.'
            },
            {
                category: 'Audio',
                name: 'RØDE Wireless GO II',
                image: 'rode-wireless-go-ii.png',
                url: 'https://rode.com/en/microphones/wireless/wirelessgoii',
                description: 'Mic set for voice and interviews. Wireless, which makes video shoots easy — even when moving or filming at a distance.'
            },
            {
                category: 'Audio',
                name: 'Tascam DR-07X',
                image: 'tascam-dr-07x.jpg',
                url: 'https://tascam.com/us/product/dr-07x/top',
                description: 'Records high-quality sound separately or as backup. Perfect for macro scenes or as a second mic to support wireless audio.'
            },
            {
                category: 'Editing',
                name: 'Apple MacBook Pro',
                image: 'macbook-pro.png',
                url: 'https://www.apple.com/macbook-pro/',
                description: 'Fast, reliable and truly mobile, with a display I can trust for colour. Great for reviewing results on the spot and making quick adjustments.'
            },
            {
                category: 'Tablet',
                name: 'Apple iPad',
                image: 'ipad.png',
                url: 'https://www.apple.com/ipad/',
                description: 'Handy for reviewing shots right on location, even in tight spaces — clients see the results immediately on a beautiful screen.'
            },
            {
                category: 'Editing',
                name: 'Apple Mac mini',
                image: 'mac-mini.png',
                url: 'https://www.apple.com/mac-mini/',
                description: 'My desktop workhorse: handles big full-size RAW files with ease thanks to fast external drives — smooth editing from import to export.'
            },
            {
                category: 'Display',
                name: 'Apple Studio Display',
                image: 'apple-studio-display.png',
                url: 'https://www.apple.com/studio-display/',
                description: 'Superb 5K screen with excellent colour accuracy — what I see while retouching is exactly what clients get.'
            },
            {
                category: 'Storage',
                name: 'Synology DS925+',
                image: 'synology-ds925.png',
                url: 'https://www.synology.com/en-global/products/DS925+',
                description: 'Reliable local storage for the whole photo archive. Files stay safe at home and under my control — nothing leaks to the internet.'
            }
        ]
    }
];

module.exports = pages;
