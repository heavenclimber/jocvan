const opentype = require('opentype.js');
const https = require('https');
const fs = require('fs');

const fontUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/dancingscript/DancingScript%5Bwght%5D.ttf';

https.get(fontUrl, (res) => {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync('temp-font.ttf', buffer);

    opentype.load('temp-font.ttf', function(err, font) {
      if (err) {
        console.error('Font could not be loaded: ' + err);
        return;
      }
      
      const fontSize = 150;
      
      // Get paths
      // getPath(text, x, y, fontSize, options)
      // To center text visually, we can measure it
      // For now we just get the paths with x=0, y=0 and use GSAP/SVG to center
      const path1 = font.getPath('Jovan', 0, 0, fontSize);
      const path2 = font.getPath('Bastian', 0, 0, fontSize);
      
      console.log('JOVAN_PATH:', path1.toPathData(2));
      console.log('BASTIAN_PATH:', path2.toPathData(2));
      
      fs.unlinkSync('temp-font.ttf');
    });
  });
}).on('error', (err) => {
  console.error('Error downloading font:', err);
});
