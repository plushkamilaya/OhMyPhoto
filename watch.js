const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let building = false;

function build() {
    if (building) return;
    building = true;
    console.log('\n[watch] pages.js changed — rebuilding...');
    const proc = spawn('node', ['build.js'], { stdio: 'inherit' });
    proc.on('close', code => {
        building = false;
        if (code === 0) console.log('[watch] Done. Watching for changes...');
        else console.log(`[watch] Build failed (exit ${code})`);
    });
}

// Initial build, then start server
console.log('[watch] Building...');
const init = spawn('node', ['build.js'], { stdio: 'inherit' });
init.on('close', () => {
    const server = spawn('node', ['server.js'], { stdio: 'inherit' });
    server.on('close', code => process.exit(code));

    const target = path.resolve(__dirname, 'pages.js');
    fs.watch(target, () => build());
    console.log('\n[watch] Server running at http://localhost:3000');
    console.log('[watch] Watching pages.js... (Ctrl+C to stop)');
});
