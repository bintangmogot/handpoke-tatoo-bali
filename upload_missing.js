const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'workstation-',
  api_key: '269168136788184',
  api_secret: 'nKsVY6Eervp4ljypBJRUIBNUXSU'
});

const missingFiles = [
  'public/assets/Gallery/handpoke-tattoo-artist-bali-dotlinetattu-5-BAzWV2pMQk8hGWkY.avif',
  'public/assets/Gallery/handpoke-tattoo-artist-bali-dotlinetattu-6-BAzWV96sq1gcvgD6.avif',
  'public/assets/Gallery/handpoke-tattoo-artist-bali-dotlinetattu-2-BAzWVxWsO33InmRz.avif',
  'public/assets/Gallery/handpoke-tattoo-artist-bali-dotlinetattu-8-BAzWV9B2M3iM5eWg.avif'
];

async function run() {
  for (const file of missingFiles) {
    console.log(`Uploading ${file}...`);
    const res = await cloudinary.uploader.upload(file, {
      folder: 'Dotlinetattu',
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });
    console.log(`Uploaded! URL: ${res.secure_url}`);
    
    // update codebase
    let fileContent = fs.readFileSync('src/app/page.tsx', 'utf8');
    fileContent = fileContent.replace(new RegExp('/assets/Gallery/' + file.split('/').pop(), 'g'), res.secure_url);
    fs.writeFileSync('src/app/page.tsx', fileContent);
    
    let aboutContent = fs.readFileSync('src/app/about/page.tsx', 'utf8');
    aboutContent = aboutContent.replace(new RegExp('/assets/Gallery/' + file.split('/').pop(), 'g'), res.secure_url);
    fs.writeFileSync('src/app/about/page.tsx', aboutContent);
  }
}

run();
