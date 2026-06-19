import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

const { parsed = {} } = config({ path: resolve('.env'), quiet: true });

const envValue = (name) => process.env[name]?.trim() || parsed[name]?.trim() || '';
const apiBaseUrl = (envValue('API_BASE_URL') || envValue('VITE_API_URL')).replace(/\/+$/, '');
const dealershipUrl = envValue('DEALERSHIP_URL').replace(/\/+$/, '');
const outputPath = resolve('src/environments/environment.generated.ts');
const output = `// Generated from .env by scripts/generate-environment.mjs.
export const environment = {
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
  dealershipUrl: ${JSON.stringify(dealershipUrl)},
} as const;
`;

writeFileSync(outputPath, output, 'utf8');
