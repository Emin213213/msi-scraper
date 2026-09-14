export async function extractCategories(page) {
    const breadcrumb = page.locator('.breadcrumb').first();

    if (!(await breadcrumb.count())) {
        return {
            productCategory: null,
            categoryTree: [],
        };
    }

    const items = breadcrumb.locator('.breadcrumb-item');
    const count = await items.count();

    const categoryTree = [];

    for (let i = 0; i < count; i++) {
        const item = items.nth(i);

        const name = (await item.textContent())?.trim();

        if (!name) {
            continue;
        }

        if (name.toLowerCase() === 'home') {
            continue;
        }

        const link = item.locator('a');

        const url = (await link.count())
            ? await link.getAttribute('href')
            : null;

        categoryTree.push({
            name,
            url: url ? new URL(url, page.url()).href : null,
        });
    }

    const categoriesOnly = categoryTree.slice(0, -1);

    return {
        productCategory:
            categoriesOnly.map(category => category.name).join(' > ') || null,

        categoryTree: categoriesOnly,
    };
}