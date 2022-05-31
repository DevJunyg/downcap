import fs from 'fs';

export function loadJson<T>(path: string): T {
  return JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
};