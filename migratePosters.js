const fs = require('fs');
const path = require('path');

const POSTERS_DIR = path.join(__dirname, 'src', 'imgs', 'posters');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function createMarkdownForImage(imageFilename, index) {
  const title = `Poster ${index + 1}`;
  const order = index + 1;
  const imagePath = `/imgs/posters/${imageFilename}`;
  const mdFilename = path.parse(imageFilename).name + '.md';
  const mdPath = path.join(POSTERS_DIR, mdFilename);
  const frontMatter = `---
title: "${title}"
order: ${order}
image: "${imagePath}"
description: ""
---
`;

  if (!fs.existsSync(mdPath)) {
    fs.writeFileSync(mdPath, frontMatter, 'utf8');
    console.log(`Created: ${mdPath}`);
  } else {
    console.log(`Skipped (already exists): ${mdPath}`);
  }
}

function main() {
  const files = fs.readdirSync(POSTERS_DIR);
  const images = files.filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));
  images.sort(); // alphabetical order
  images.forEach((image, idx) => createMarkdownForImage(image, idx));
}

main();