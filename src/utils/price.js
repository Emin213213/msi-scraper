export async function extractBrand(page) {
    const brand = await page
        .locator('meta[property="product:brand"]')
        .getAttribute('content')
        .catch(() => null);

    return brand?.trim() || 'MSI';
}


export function normalizePrice(value) {
    if (!value) {
        return null;
    }

    const normalized = value
        .replace(/[^0-9.,]/g, '')
        .replace(',', '');

    const price = Number.parseFloat(normalized);

    return Number.isNaN(price) ? null : price;
}