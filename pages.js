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
        name: 'for-business',
        title: 'For Business',
        template: 'gallery-intro',
        intro: {
            heading: 'For Business',
            description: [
                'We create images that make food desirable, spaces memorable and businesses feel more established.',
                'The&nbsp;best part of Plushka is that it is part of <a href="https://lovkoja.se" target="_blank" rel="noopener noreferrer" class="link-lovkoja">Lövkoja<img src="/lovkoja-mark.svg" alt="" class="link-lovkoja-icon"></a>. Your photography can grow into a&nbsp;complete visual system across menus, brochures, advertising, websites, customer-facing menu areas and wider IT systems — all built around one clear understanding of your brand.',
                'With an&nbsp;optional support subscription, we keep that system current: your website stays reliable, your images display beautifully, and new dishes, campaigns, menu items and small updates flow naturally into the&nbsp;work already in place. As your business grows, <a href="https://lovkoja.se" target="_blank" rel="noopener noreferrer" class="link-lovkoja">Lövkoja<img src="/lovkoja-mark.svg" alt="" class="link-lovkoja-icon"></a> can extend the&nbsp;same system into integrations, digital infrastructure and high-load platforms.'
            ]
        },
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
        name: 'private-sessions',
        title: 'Private Sessions',
        template: 'sessions-split',
        intro: {
            heading: 'Private Sessions',
            description: 'I offer a&nbsp;limited number of private photography sessions each season — for children, families and pets — capturing genuine moments in a&nbsp;relaxed, unhurried setting.'
        },
        images: [
            'IMG_4172-1.jpg',
            'IMG_2724.JPG',
            'IMG_3408.jpg',
            'IMG_6146.jpg',
            'IMG_3937-1.jpg',
            'IMG_4152_1.jpg',
            'IMG_2433.JPG',
            'IMG_6213.JPG'
        ],
        sessionOptions: [
            {
                id: 'mini-sessions',
                heading: 'Mini Sessions',
                description: 'Quick, focused sessions built around one clear idea — perfect for a&nbsp;fresh portrait, a&nbsp;seasonal update, or a&nbsp;small milestone.'
            },
            {
                id: 'story-sessions',
                heading: 'Story Sessions',
                description: 'Longer, narrative-style sessions that follow a&nbsp;day, an&nbsp;event, or a&nbsp;milestone from start to finish — the&nbsp;full story, not just a&nbsp;single frame.'
            }
        ]
    },
    {
        name: 'local-commitment',
        title: 'Local Commitment',
        template: 'community',
        images: [
            'google-maps-profile.jpg'
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
                category: 'Lens',
                name: 'Canon RF 85mm F2 Macro IS STM',
                image: 'canon-rf-85.jpg',
                url: 'https://www.canon-europe.com/lenses/rf-85mm-f2-macro-is-stm/',
                description: 'My go-to lens for people, food, and details. Lightweight, fast, and easy to carry all day — yet it delivers glossy, cinematic results.'
            },
            {
                category: 'Lens',
                name: 'Canon EF 50mm f/1.4 USM',
                image: 'canon-ef-50-1.4.jpg',
                url: 'https://www.canon-europe.com/lenses/ef-50mm-f-1-4-usm-lens/',
                description: 'A compact, fast standard lens — sharp wide open at f/1.4 and always ready for portraits, reportage, and everyday moments.'
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
    },
    {
        name: 'places',
        title: 'Places',
        hidden: true,
        template: 'gallery',
        images: [
            'ES7A3178.JPG',
            'ES7A3332-1.jpg',
            'ES7A2999.jpg',
            'ES7A3168-1.jpg'
        ]
    }
];

module.exports = pages;
