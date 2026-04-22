import { resolve } from 'path';
import { importListings } from './importers/ListingsImporter.js';

const filePath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve('../../temp/Listings.txt');

const apiBaseUrl = process.env['API_BASE_URL'] ?? 'http://localhost:5154';

console.log(`Importing from: ${filePath}`);
console.log(`API: ${apiBaseUrl}`);

await importListings(filePath, apiBaseUrl);
