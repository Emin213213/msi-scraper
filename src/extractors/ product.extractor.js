import { normalizePrice } from '../utils/price.js'


export async function extractTitle(page) {
    const headings = page.locator('h1, h2, h3');

    const count = await headings.count();

    for (let i = 0; i < count; i++) {
        const text = await headings.nth(i).textContent();
        const normalized = text?.trim();

        if (!normalized) {
            continue;
        }

        if (
            normalized.toLowerCase().includes('cookies') ||
            normalized.toLowerCase().includes('privacy')
        ) {
            continue;
        }

        if (normalized.length > 5) {
            return normalized;
        }
    }

    return null;
}
// ================

export async function extractBrand(page) {
    const brand = await page
        .locator('meta[property="product:brand"]')
        .getAttribute('content')
        .catch(() => null);

    return brand?.trim() || 'MSI';
}

// ================

export async function extractPrice(page) {
    const selectors = [
        '#prices-new',
        '.prices-new',
    ];

    for (const selector of selectors) {
        const element = page.locator(selector).first();

        if (!(await element.count())) {
            continue;
        }

        const text = await element.textContent();
        const price = normalizePrice(text);

        if (price !== null) {
            return price;
        }
    }

    return null;
}

// ================

async function extractStructuredPrice(page) {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();

    for (let i = 0; i < count; i++) {
        const content = await scripts.nth(i).textContent();

        if (!content) {
            continue;
        }

        try {
            const data = JSON.parse(content);
            const items = Array.isArray(data) ? data : [data];

            for (const item of items) {
                if (item['@type'] !== 'Product') {
                    continue;
                }

                const offers = Array.isArray(item.offers)
                    ? item.offers[0]
                    : item.offers;

                const price = normalizePrice(
                    String(offers?.price ?? '')
                );

                if (price !== null) {
                    return price;
                }
            }
        } catch {
            continue;
        }
    }

    return null;
}

// ===============

async function getProductContainer(page) {
    const title = await extractTitle(page);

    if (!title) {
        return null;
    }

    const heading = page.getByText(title, { exact: true }).first();

    return heading.locator('xpath=ancestor::*[.//*[contains(text(), "$")]][1]');
}

// ==========
export async function extractAvailability(page) {
    const bodyText = (await page.locator('body').textContent())?.toLowerCase() || '';

    if (bodyText.includes('out of stock')) {
        return 'out_of_stock';
    }

    if (bodyText.includes('pre-order') || bodyText.includes('pre order')) {
        return 'pre_order';
    }

    if (bodyText.includes('in stock') || bodyText.includes('add to cart')) {
        return 'in_stock';
    }

    return null;
}

// ==================

export async function extractDescription(page) {
    const title = await extractTitle(page);

    if (!title) {
        return null;
    }

    const paragraphs = page.locator('p');
    const count = await paragraphs.count();

    for (let i = 0; i < count; i++) {
        const text = (await paragraphs.nth(i).textContent())?.trim();

        if (!text) {
            continue;
        }

        if (text.includes(title) && text.length > title.length) {
            return text;
        }
    }

    return null;
}