const fs = require('fs').promises;
const path = require('path');

const ROOT_DIR = path.join(process.cwd(), 'public', 'finder-data');

// Helper to get default icon based on type and extension
function getIcon(type, filename) {
  if (type === 'folder') return 'folder';
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.webp':
      return 'image';
    case '.txt':
    case '.md':
    case '.pdf':
      return 'document';
    case '.zip':
    case '.tar':
    case '.gz':
      return 'archive';
    case '.mp3':
    case '.wav':
      return 'audio';
    case '.mp4':
    case '.mov':
      return 'video';
    default:
      return 'file';
  }
}

async function processDirectory(currentDir) {
  let entries;
  try {
    entries = await fs.readdir(currentDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`Directory not found: ${currentDir}`);
      return [];
    }
    throw err;
  }

  const metadata = [];
  
  const filteredEntries = entries.filter(entry => entry.name !== 'metadata.json');

  for (const entry of filteredEntries) {
    const fullPath = path.join(currentDir, entry.name);
    const publicPath = '/' + path.relative(path.join(process.cwd(), 'public'), fullPath).replace(/\\/g, '/');
    
    const type = entry.isDirectory() ? 'folder' : 'file';
    
    metadata.push({
      name: entry.name,
      type: type,
      path: publicPath,
      icon: getIcon(type, entry.name)
    });

    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    }
  }

  const metadataPath = path.join(currentDir, 'metadata.json');
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`Generated metadata.json for ${currentDir}`);
  return metadata;
}

async function main() {
  try {
    console.log('Scanning Finder Data directory...');
    await processDirectory(ROOT_DIR);
    console.log('Success! All metadata.json files updated.');
  } catch (error) {
    console.error('Error updating finder data:', error);
    process.exit(1);
  }
}

main();
