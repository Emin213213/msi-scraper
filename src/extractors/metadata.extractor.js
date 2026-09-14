export async function extractItemId(page) {
    const scripts = page.locator('script');

    const count = await scripts.count();

    for (let i = 0; i < count; i++) {
        const content = await scripts.nth(i).textContent();

        if (!content || !content.includes('view_item')) {
            continue;
        }

        const match = content.match(/"id":"([^"]+)"/);

        if (match) {
            return match[1];
        }
    }

    return null;
}

export function extractMpn(specs) {
    const manufacturerNumber = specs.find(
        spec => spec.name.toLowerCase() === 'manufacturer number'
    );

    return manufacturerNumber?.value ?? null;
}

export async function extractRating(page) {
    const element = page.locator('#average-rating-info').first();

    if (!(await element.count())) {
        return {
            starRating: null,
            reviewCount: null,
        };
    }

    const text = (await element.textContent())?.trim();

    if (!text) {
        return {
            starRating: null,
            reviewCount: null,
        };
    }

    const match = text.match(/([\d.]+)\s*\((\d+)\)/);

    if (!match) {
        return {
            starRating: null,
            reviewCount: null,
        };
    }

    return {
        starRating: Number.parseFloat(match[1]),
        reviewCount: Number.parseInt(match[2], 10),
    };
}