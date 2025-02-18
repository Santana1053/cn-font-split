import fs from 'fs-extra';
import _ from 'lodash-es';
import { fontSplit, convert } from 'cn-font-split';
const features = fs.readJSONSync('./FeatureConfig.json');
const allKey = new Set();

features.forEach((i) => {
    if (allKey.has(i.featureKey)) throw new Error('重复键 ' + i.featureKey);
    allKey.add(i.featureKey);
});

// fs.emptyDirSync('./temp');
for (const i of features) {
    console.log(i.featureKey);
    // if (fs.existsSync('./temp/' + i.featureKey)) continue
    const buffer = fs.readFileSync(
        './temp/' +
        i.featureKey +
        '/' +
        i.featureKey +
        i.fontLink.replace(/.*\.(.*?)/g, '.$1'),
    );
    const b = await convert(new Uint8Array(buffer), 'ttf');
    const charset = [...i.splitText]
        .filter(Boolean)
        .map((i) => i.codePointAt(0));
    await fontSplit({
        outDir: './temp/' + i.featureKey,
        input: Buffer.from(b),
        reporter: false,
        testHTML: false,
        css: {
            localFamily: false,
            fontFamily: i.featureKey + '-demo',
            comment: {
                base: false,
                nameTable: false,
                unicodes: true,
            },
        },
        autoChunk: false,
        subsetRemainChars: false,
        reduceMins: false,
        languageAreas: false,
        targetType: 'woff2',
        // subsets: chunk(
        //     charset,
        //     i.splitCount ?? 3
        // ),
        subsets: [[...new Set(charset)]],
    });
}
