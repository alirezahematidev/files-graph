/* eslint-disable prettier/prettier */
const { randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');

function generate({ shouldGenerateId, withExtension, sourcePath, outputPath, name }) {
  const concat = (source, target) => {
    return path.join(source, target);
  };

  const isDirectory = (directory, name) => {
    const dir = concat(directory, name);

    const _isDir = fs.lstatSync(dir).isDirectory();

    return _isDir || !path.extname(name);
  };

  const getExtenstion = (file) => {
    return path.extname(file).split('.').at(-1);
  };

  const applyExtension = (name) => {
    if (withExtension) {
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

  function graph(directory) {
    const files = fs.readdirSync(directory, {
      encoding: 'utf8',
    });

    return files.map((name) => {
      const id = generateId();

      if (isDirectory(directory, name)) {
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
        name: applyExtension(name),
        extension: getExtenstion(name),
        path: concat(directory, name),
        isDirectory: false,
        subFiles: [],
      };
    });
  }

  const entries = graph(sourcePath);

  fs.writeFileSync(`${outputPath}/${name.trim()}.json`, JSON.stringify(entries));
}

module.exports = { generate };
