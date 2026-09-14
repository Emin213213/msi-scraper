export async function extractImages(page) {
    const mainImage = page.locator('#imagePopup').first();

    let imageUrl = null;

    if (await mainImage.count()) {
        imageUrl = await mainImage.getAttribute('src');
    }

    const images = page.locator(
        '.product-detail img[src*="Z890TOMAHAWKWIFI"]'
    );

    const count = await images.count();

    const additionalImageUrls = [];

    for (let i = 0; i < count; i++) {
        const src = await images.nth(i).getAttribute('src');

        if (!src) {
            continue;
        }

        const absoluteUrl = new URL(src, page.url()).href;

        if (absoluteUrl === imageUrl) {
            continue;
        }

        if (additionalImageUrls.includes(absoluteUrl)) {
            continue;
        }

        additionalImageUrls.push(absoluteUrl);
    }

    return {
        imageUrl,
        additionalImageUrls,
    };
}