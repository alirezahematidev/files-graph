/* eslint-disable prettier/prettier */
import { randomBytes } from 'crypto';
import fs from 'fs';
import path from 'path';

function generate() {
    const isDirectory = (file) => {
        return !path.extname(file);
    };

    const getExtenstion = (file) => {
        return path.extname(file).split('.').at(-1);
    };

    const concat = (source, target) => {
        return path.join(source, target);
    };

    const withoutExtension = (file) => {
        const toArray = file.split('.');
        toArray.pop();
        return toArray.join('.');
    };

    function graph(directory) {
        const files = fs.readdirSync(directory, {
            encoding: 'utf8',
        });

        return files.map((name) => {
            const id = randomBytes(12).toString('base64');

            if (isDirectory(name)) {
                return {
                    id,
                    name,
                    extension: null,
                    path: concat(directory, name),
                    isDirectory: true,
                    subFiles: graph(concat(directory, name)),
                };
            }
            return {
                id,
                name: withoutExtension(name),
                extension: getExtenstion(name),
                path: concat(directory, name),
                isDirectory: false,
                subFiles: [],
            };
        });
    }

    const entries = graph('src');

    fs.writeFileSync('graph.json', JSON.stringify(entries));
}

export { generate };