import { promises as fs } from 'fs'
import { parse } from '@vue/compiler-sfc'

const cache = new Map();
export async function parseSFC (filename: string, saveCache = false) {
    const content = await fs.readFile(filename, 'utf8');
    const {descriptor, errors} = parse(content, {filename});

    const prev = cache.get(filename);

    if (saveCache) {
        cache.set(filename, descriptor);
    }

    return [descriptor, prev];
}