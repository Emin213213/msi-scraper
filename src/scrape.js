import {chromium} from 'playwright';

import {TARGET_URL} from './config/constants.js';
import {
    extractAvailability,
    extractBrand,
    extractDescription,
    extractPrice,
    extractTitle,
} from './extractors/ product.extractor.js';

import {
    extractItemId,
    extractMpn,
    extractRating,
} from './extractors/metadata.extractor.js';
import { extractCategories } from  './extractors/category.extractor.js'
import { extractSpecs } from './extractors/specs.extractor.js';
import { extractImages } from './extractors/images.extractor.js';
import { OUTPUT_PATH } from './config/constants.js';
import { saveJson } from './utils/file.js';


async function scrapeProduct() {
    const browser = await chromium.launch({
        headless: false,
    });

    try {
        const context = await browser.newContext({
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            viewport: {
                width: 1440,
                height: 900,
            },
        });

        const page = await context.newPage();

        await page.goto(TARGET_URL, {
            waitUntil: 'domcontentloaded',
            timeout: 60_000,
        });

        console.log('Extracting categories...');

        const {
            productCategory,
            categoryTree,
        } = await extractCategories(page);


        console.log('Extracting specs...');
        const specs = await extractSpecs(page);

        console.log('Extracting metadata...');
        const itemId = await extractItemId(page);
        const mpn = extractMpn(specs);

        const {
            starRating,
            reviewCount,
        } = await extractRating(page);

        console.log('Extracting images...');

        const {
            imageUrl,
            additionalImageUrls,
        } = await extractImages(page);


        console.log('Extracting title...');
        const title = await extractTitle(page);

        console.log('Extracting availability...');
        const availability = await extractAvailability(page);

        console.log('Extracting brand...');
        const brand = await extractBrand(page);

        console.log('Extracting description...');
        const description = await extractDescription(page);

        console.log('Extracting price...');
        const price = await extractPrice(page);

        console.log('Extracting specs...');
        console.log('Specs:', specs);


        console.log('Item ID:', itemId);
        console.log('MPN:', mpn);
        console.log('Star rating:', starRating);
        console.log('Review count:', reviewCount);

        console.log('Title:', title);
        console.log('Brand:', brand);
        console.log('Price:', price);
        console.log('Availability:', availability);
        console.log('Description:', description);
        console.log('Product category:', productCategory);
        console.log('Category tree:', categoryTree);

        console.log('Page opened:', page.url());


        console.log('Title:', title);


        const result = {
            url: page.url(),
            item_id: itemId,
            title,
            brand,
            product_category: productCategory,
            category_tree: categoryTree,
            description,
            price,
            sale_price: null,
            availability,
            image_url: imageUrl,
            additional_image_urls: additionalImageUrls,
            specs,
            star_rating: starRating,
            review_count: reviewCount,
            gtin: null,
            mpn,
            scraped_at: new Date().toISOString(),
        };

        console.log(result);

        await saveJson(OUTPUT_PATH, result);

        console.log(`Saved to ${OUTPUT_PATH}`);


    } catch (error) {
        console.error('Scraping failed:', error);
    } finally {
        await browser.close();
    }
}

scrapeProduct();