const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'workstation-',
  api_key: '269168136788184',
  api_secret: 'nKsVY6Eervp4ljypBJRUIBNUXSU'
});

async function run() {
  try {
    let allResources = [];
    let nextCursor = null;

    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'Dotlinetattu/',
        max_results: 500,
        next_cursor: nextCursor,
        resource_type: 'video' // Fetch videos
      });
      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    nextCursor = null;
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'Dotlinetattu/',
        max_results: 500,
        next_cursor: nextCursor,
        resource_type: 'image' // Fetch images
      });
      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    fs.writeFileSync('cloudinary_assets.json', JSON.stringify(allResources, null, 2));
    console.log(`Saved ${allResources.length} assets.`);
  } catch (error) {
    console.error(error);
  }
}

run();
