export async function extractSpecs(page) {
    const rows = page.locator('.table tbody tr');

    const count = await rows.count();

    const specs = [];

    for (let i = 0; i < count; i++) {
        const row = rows.nth(i);

        const nameElement = row.locator('th').first();
        const valueElement = row.locator('td').first();

        if (!(await nameElement.count()) || !(await valueElement.count())) {
            continue;
        }

        const name = (await nameElement.textContent())?.trim() || null;
        const value = (await valueElement.textContent())?.trim() || null;

        if (!name) {
            continue;
        }

        specs.push({
            name,
            value,
        });
    }

    return specs;
}