import fs from 'fs';
import { fontSplit } from '../dist/node/lib/bun.js'
const inputBuffer = new Uint8Array(fs.readFileSync("../../../demo/public/SmileySans-Oblique.ttf").buffer);

await fontSplit({
    input: inputBuffer,
    out_dir: "./dist/font"
})
