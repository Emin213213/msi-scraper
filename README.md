# MSI Product Scraper

A simple web scraper built with **Node.js** and **Playwright** for extracting product information from an MSI product page.

The scraper collects product data such as:

* Product title
* Brand
* Description
* Price
* Availability
* Categories
* Images
* Product specifications
* Rating
* Review count
* MPN / Manufacturer number

The extracted data is saved as a JSON file.

## Technologies

* Node.js
* JavaScript
* Playwright

## Installation

Clone the repository:

```bash
git clone https://github.com/Emin213213/msi-scraper.git
```

Go to the project directory:

```bash
cd msi-scraper
```

Install dependencies:

```bash
npm install
```

Install the Playwright browser:

```bash
npx playwright install
```

## Running the scraper

Run:

```bash
npm run scrape
```

The scraper will open the target product page, extract the required information and save the result to:

```text
output/product.json
```

## Project Structure

```text
msi-scraper/
│
├── src/
│   ├── extractors/
│   ├── parsers/
│   ├── storage/
│   └── scrape.js
│
├── output/
│   └── product.json
│
├── package.json
├── package-lock.json
└── README.md
```

## Output

Example structure of the generated JSON:

```json
{
  "title": "MAG Z890 TOMAHAWK WIFI",
  "brand": "MSI",
  "price": "$259.99",
  "availability": "Out of stock",
  "description": "...",
  "categories": [],
  "images": [],
  "specs": []
}
```

The actual output contains the complete data extracted from the product page.

## Author

Emin Bashyrov
