import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');

export class ConfigReader {
  static get(key: string, fallback?: string) {
    if (process.env[key]) return process.env[key] as string;
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const [k, ...rest] = line.split('=');
        if (!k) continue;
        if (k.trim() === key) return rest.join('=').trim();
      }
    }
    return fallback;
  }
}
