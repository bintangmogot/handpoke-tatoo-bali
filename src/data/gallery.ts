export type GalleryItem = { id: string; src: string; title: string; category: 'Custom'; span: 'tall' | 'normal' };

const cloudinaryUrls = [
  'https://res.cloudinary.com/workstation-/image/upload/v1789931064/Dotlinetattu/Gallery/custom-balinese-ornament-lotus-crafting.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931063/Dotlinetattu/Gallery/custom-bunga-terung-dayak-iconic-2.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931061/Dotlinetattu/Gallery/custom-titi-mentawai-courage.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931061/Dotlinetattu/Gallery/custom-geometric-ornament-seven-cakras.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931028/Dotlinetattu/Gallery/custom-geometric-ornament-bamboo-shot-growth-resistance.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931028/Dotlinetattu/Gallery/outrigger-boat-symbol-custom-titi-mentawai.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931028/Dotlinetattu/Gallery/custom-geometric-ornament-leluhukh-social-harmony.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931028/Dotlinetattu/Gallery/custom-motif-kebung-tikhai-harmonious-relationship.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931029/Dotlinetattu/Gallery/custom-geometric-ornament-social-adventure.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931053/Dotlinetattu/Gallery/custom-titi-gagai-expertise-agility.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931030/Dotlinetattu/Gallery/outrigger-boat-symbol-custom-titi-mentawai-2.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931054/Dotlinetattu/Gallery/custom-geometric-ornament-snake-tree-of-life.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931053/Dotlinetattu/Gallery/custom-titi-saliou-balance-of-nature-harmony-of-life.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931055/Dotlinetattu/Gallery/custom-geometric-ornament-rooted-hook-harmonize-2.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931055/Dotlinetattu/Gallery/custom-geometric-ornament-rooted-hook-harmonize.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931055/Dotlinetattu/Gallery/custom-geometric-ornament-process-of-ripening.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931055/Dotlinetattu/Gallery/custom-geometric-ornament-melayu-scattered-stars.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931055/Dotlinetattu/Gallery/custom-geometric-ornament-rooted-harmonies.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931057/Dotlinetattu/Gallery/custom-geometric-ornament-lotus-flower-resilience-transformation-2.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931056/Dotlinetattu/Gallery/custom-geometric-ornament-lotus-flower-resilience-transformation.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931057/Dotlinetattu/Gallery/custom-geometric-ornament-lotus-flower-resilience-transformation-3.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931059/Dotlinetattu/Gallery/custom-geometric-ornament-agile-justice-skilled.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931059/Dotlinetattu/Gallery/custom-geometric-ornament-lotus-flower-7-elements-rebirth.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931061/Dotlinetattu/Gallery/custom-geometric-balinese-ornament-patra-flower-2.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931060/Dotlinetattu/Gallery/custom-geometric-ornament-agile-decisive.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931060/Dotlinetattu/Gallery/custom-geometric-balinese-ornament-patra-flower.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931061/Dotlinetattu/Gallery/custom-geometric-balinese-ornament-patra-flower-process-of-ripening.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931065/Dotlinetattu/Gallery/custom-arrow-titi-mentawai-courage-2.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931065/Dotlinetattu/Gallery/custom-arrow-titi-mentawai-courage.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931066/Dotlinetattu/Gallery/tattoo-artist.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931063/Dotlinetattu/Gallery/custom-geometric-ornament-monkey-mask.webp',
  'https://res.cloudinary.com/workstation-/image/upload/v1789931075/Dotlinetattu/Gallery/custom-bunga-terung-dayak-iconic.webp',
] as const;

function titleFromUrl(url: string) {
  const filename = decodeURIComponent(url.split('/').pop() || '').replace(/\.[^.]+$/, '');
  return filename.replace(/^(custom-|outrigger-boat-symbol-|tattoo-artist)/, '').replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function createGalleryItems(urls: readonly string[] = cloudinaryUrls): GalleryItem[] {
  return [...new Set(urls)].map((src, index) => ({ id: `cloudinary-${index + 1}`, src, title: titleFromUrl(src), category: 'Custom', span: index % 5 === 0 ? 'tall' : 'normal' }));
}

export const galleryData = createGalleryItems();
export const galleryCategories = ['All', 'Custom'] as const;
