import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve('.env'), quiet: true });

const apiBaseUrl = (process.env.API_BASE_URL ?? '').replace(/\/+$/, '');
const dealershipUrl = (process.env.DEALERSHIP_URL ?? '').replace(/\/+$/, '');
const outputPath = resolve('src/environments/environment.generated.ts');
const output = `// Generated from .env by scripts/generate-environment.mjs.
export const environment = {
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
  dealershipUrl: ${JSON.stringify(dealershipUrl)},
} as const;
`;

writeFileSync(outputPath, output, 'utf8');
