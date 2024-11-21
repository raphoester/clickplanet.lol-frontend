import * as fs from "node:fs";
import * as path from "node:path";
import Smith from "spritesmith";

const args = process.argv.slice(2);

const spritesDir = args[0] || './static/countries/png100px';

const dest = args[1] || './static/countries';

const pngFiles = fs.readdirSync(spritesDir).filter(file => file.endsWith('.png')).map(file => path.join(spritesDir, file));


Smith.run({src: pngFiles}, (err, result) => {
    if (err) throw err;

    fs.writeFileSync(path.join(dest, 'atlas.png'), result.image);
    fs.writeFileSync(path.join(dest, 'atlas.json'), JSON.stringify(result.coordinates, null, 2));

    console.log('Atlas generated');
})
