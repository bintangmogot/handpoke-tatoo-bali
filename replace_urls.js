const fs = require('fs');
const path = require('path');

const mapping = JSON.parse(fs.readFileSync('cloudinary_mapping.json', 'utf8'));

// Special mapping for the video which might have spaces
const videoKey = 'Handpoke-tattoo-Bali-Dotlinetattu 2 Dotlinetattu Handpoke bali';
const videoUrl = 'https://res.cloudinary.com/workstation-/video/upload/v1788876421/Handpoke-tattoo-Bali-Dotlinetattu_2_Dotlinetattu_Handpoke_bali.mp4';
// Let's actually find the video URL from mapping dynamically
let foundVideoUrl = Object.values(mapping).find(url => url.includes('Handpoke-tattoo-Bali-Dotlinetattu'));

function normalize(filename) {
  // Remove extension
  let base = filename.replace(/\.[^/.]+$/, "");
  // Replace " (1)" with "_1"
  base = base.replace(/ \((1)\)/g, "_1");
  // Replace spaces with underscores
  base = base.replace(/ /g, "_");
  return base;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Regex to find /assets/... strings
  const regex = /["'`]\/assets\/(.*?)(["'`])/g;
  
  content = content.replace(regex, (match, assetPath, quote) => {
    const filename = path.basename(assetPath);
    const normalized = normalize(filename);
    
    let url = mapping[normalized];
    if (!url && filename === 'Handpoke-tattoo-Bali-Dotlinetattu 2 Dotlinetattu Handpoke bali.MP4') {
       url = foundVideoUrl || mapping['Handpoke-tattoo-Bali-Dotlinetattu_2_Dotlinetattu_Handpoke_bali'];
    }
    
    if (url) {
      console.log(`Replaced: ${assetPath} -> ${url}`);
      return `${quote}${url}${quote}`;
    } else {
      console.log(`NOT FOUND IN MAPPING: ${assetPath} (normalized: ${normalized})`);
      return match;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
  }
}

const filesToProcess = [
  'src/app/page.tsx',
  'src/app/about/page.tsx',
  'src/app/gallery/page.tsx',
  'src/components/booking/BookingEngine.tsx',
  'src/components/layout/EnterOverlay.tsx'
];

filesToProcess.forEach(processFile);
