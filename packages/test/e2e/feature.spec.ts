import { test, expect } from '@playwright/test';
import fs from 'fs-extra';
const features = fs.readJSONSync('./FeatureConfig.json');
import { compareElAndSave, comparePictureBuffer } from './comparePictureBuffer';
import P from 'pngjs';
const PNG = P.PNG;

for (const iterator of features) {
    test('feature 测试 ' + iterator.featureKey, async ({ page }) => {
        await page.goto(
            'http://localhost:5173/#/feature?test=true&feature=' +
                iterator.featureKey,
        );
        await page.waitForLoadState('networkidle');
        await page.waitForFunction(() => document.fonts.ready);
        // 测试 harfbuzz 版本只需要将 -demo 替换为 -hb 即可
        // 测试 harfbuzz wasm 版本只需要将 -demo 替换为 -hb-wasm 即可
        await compareElAndSave(
            page,
            '.' + iterator.featureKey + '-demo-on',
            '.' + iterator.featureKey + '-on',
            './temp/' +
                iterator.featureKey +
                '/' +
                iterator.featureKey +
                '-on-diff.png',
        );
        await compareElAndSave(
            page,
            '.' + iterator.featureKey + '-demo-off',
            '.' + iterator.featureKey + '-off',
            './temp/' +
                iterator.featureKey +
                '/' +
                iterator.featureKey +
                '-off-diff.png',
        );
    });
}
