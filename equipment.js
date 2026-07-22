// Central, editable equipment catalogue. Camera/lens EXIF values are
// resolved against `aliases` during the build (see resolveEquipment in
// build.js) and only the matching `id` is ever embedded per-photo — the
// full name/image/description below is embedded once and looked up by id
// in the browser.
const equipment = [
    {
        id: 'canon-eos-r6',
        type: 'camera',
        aliases: ['Canon EOS R6'],
        name: 'Canon EOS R6',
        image: 'canon-eos-r6.jpg',
        description: 'Main full-frame body. Fast, precise autofocus and in-body stabilisation for sharp, clean images even in low light.'
    },
    {
        id: 'canon-eos-6d',
        type: 'camera',
        aliases: ['Canon EOS 6D'],
        name: 'Canon EOS 6D',
        image: 'canon-eos-6d.jpg',
        description: 'A reliable, time-proven full-frame body, used as a dependable second setup.'
    },
    {
        id: 'canon-rf-24-70',
        type: 'lens',
        aliases: ['RF24-70mm F2.8 L IS USM'],
        name: 'Canon RF 24–70mm F2.8L IS USM',
        image: 'canon-rf-24-70.jpg',
        description: 'Sharp, flexible everyday zoom for portraits, food, and unpredictable moments.'
    },
    {
        id: 'canon-rf-70-200',
        type: 'lens',
        aliases: ['RF70-200mm F2.8 L IS USM'],
        name: 'Canon RF 70–200mm F2.8L IS USM',
        image: 'canon-rf-70-200.jpg',
        description: 'Discreet from a distance, fast in action — events, sports, and portraits.'
    },
    {
        id: 'canon-rf-85-macro',
        type: 'lens',
        aliases: ['RF85mm F2 MACRO IS STM'],
        name: 'Canon RF 85mm F2 Macro IS STM',
        image: 'canon-rf-85.jpg',
        description: 'Lightweight portrait and detail lens with glossy, cinematic results.'
    },
    {
        id: 'canon-ef-50-1-4',
        type: 'lens',
        aliases: ['EF50mm f/1.4 USM'],
        name: 'Canon EF 50mm F1.4 USM',
        image: 'canon-ef-50-1.4.jpg',
        description: 'Fast, lightweight prime for people and available-light work.'
    },
    {
        id: 'canon-ef-24-70',
        type: 'lens',
        aliases: ['EF24-70mm f/2.8L USM'],
        name: 'Canon EF 24–70mm F2.8L USM',
        image: 'canon-ef-24-70.jpg',
        description: 'The 6D’s trusted everyday zoom — sharp and dependable shoot after shoot.'
    }
];

module.exports = equipment;
