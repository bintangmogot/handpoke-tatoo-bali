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
        max_results: 500,
        next_cursor: nextCursor,
        resource_type: 'image'
      });
      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    nextCursor = null;
    do {
      const result = await cloudinary.api.resources({
        max_results: 500,
        next_cursor: nextCursor,
        resource_type: 'video'
      });
      allResources = allResources.concat(result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    const mapping = {};
    for (const res of allResources) {
      // Just map display_name or original_filename to secure_url
      // Also map public_id just in case
      let key = res.public_id.split('/').pop();
      if (res.original_filename) {
         mapping[res.original_filename] = res.secure_url;
      }
      mapping[key] = res.secure_url;
    }
    
    fs.writeFileSync('cloudinary_mapping.json', JSON.stringify(mapping, null, 2));
    console.log(`Saved mapping for ${allResources.length} assets.`);
  } catch (error) {
    console.error(error);
  }
}

run();
