import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve('.env'), quiet: true });

const vercelApiBaseUrl = 'https://autoanders-api.onrender.com';
const apiBaseUrl = (
  process.env.API_BASE_URL
  ?? (process.env.VERCEL ? vercelApiBaseUrl : '')
).replace(/\/+$/, '');
const outputPath = resolve('src/environments/environment.generated.ts');
const output = `// Generated from .env by scripts/generate-environment.mjs.
export const environment = {
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
} as const;
`;

writeFileSync(outputPath, output, 'utf8');
