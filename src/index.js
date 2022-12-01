/* eslint-disable prettier/prettier */
const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

function generate({ shouldGenerateId, withExtension, sourcePath, outputPath, name, includePath, ignore_files }) {
  const concat = (source, target) => {
    return path.join(source, target);
  };

  const isDirectory = (directory, name) => {
    const dir = concat(directory, name);

    return fs.lstatSync(dir).isDirectory();
  };

  const getExtenstion = (directory, file) => {
    if (!fs.lstatSync(concat(directory, file)).isDirectory() && file.startsWith('.') && file.split('.').length <= 2) {
      return null;
    }

    return path.extname(file).split('.').at(-1);
  };

  const applyExtension = (directory, name) => {
    if (withExtension) {
      return name;
    }

    if (!fs.lstatSync(concat(directory, name)).isDirectory() && name.startsWith('.')) {
      return name;
    }

    const splitted = name.split('.');
    splitted.pop();
    return splitted.join('.');
  };

  const generateId = () => {
    if (!shouldGenerateId) return;
    return randomBytes(12).toString('base64');
  };

  const filePath = (directory, name) => {
    if (!includePath) return;
    return concat(directory, name);
  };

  function graph(directory) {
    const files = fs.readdirSync(directory, {
      encoding: 'utf8',
    });

    return files
      .map((name) => {
        const id = generateId();

        if (ignore_files.includes(name.trim())) return;

        if (isDirectory(directory, name)) {
          return {
            id,
            name,
            extension: null,
            path: filePath(directory, name),
            isDirectory: true,
            subFiles: graph(concat(directory, name)),
          };
        }
        return {
          id,
          name: applyExtension(directory, name),
          extension: getExtenstion(directory, name),
          path: filePath(directory, name),
          isDirectory: false,
          subFiles: [],
        };
      })
      .filter(Boolean);
  }

  const entries = graph(sourcePath);

  fs.writeFileSync(`${outputPath}/${name.trim()}.json`, JSON.stringify(entries));
}

module.exports = { generate };
