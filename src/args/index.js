const { existsSync, lstatSync } = require('fs');

function getArgs(args) {
  function checkBool(booleanLike) {
    if (booleanLike === '' || booleanLike === undefined) return;

    return 'true' === booleanLike.toString();
  }

  /**
   * GENERATE ID ARG
   */
  const gId_flags_abbr = args.includes('-g');

  const gId = args.find((arg) => arg.startsWith('--generateId='));

  const gId_flags_command = gId ? checkBool(gId.split('=')[1]) : false;

  const shouldGenerateId = gId_flags_abbr || gId_flags_command;

  /**
   * EXTENSION ARG
   */
  const ext_flags_abbr = args.includes('-e');

  const ext = args.find((arg) => arg.startsWith('--extension='));

  const ext_flags_command = ext ? checkBool(ext.split('=')[1]) : false;

  const withExtension = ext_flags_abbr || ext_flags_command;

  /**
   * NAME ARG
   */

  let name = 'graph';

  const name_flags_abbr = args.findIndex((arg) => arg === '-n');
  const name_flags = args.find((arg) => arg.startsWith('--name='));

  if (name_flags_abbr !== -1) {
    name = args[name_flags_abbr + 1];
  } else if (name_flags) {
    const _name = name_flags.split('=')[1];

    if (_name) {
      name = _name;
    }
  }

  /**
   * OUTPUT ARG
   */

  let outputPath;

  const output_flags_abbr = args.findIndex((arg) => arg === '-o');
  const output_flags = args.find((arg) => arg.startsWith('--output='));

  if (output_flags_abbr !== -1) {
    const path = args[output_flags_abbr + 1];

    if (path && existsSync(path)) {
      if (!lstatSync(path).isDirectory()) {
        console.error('The output path must be a directory');
        process.exit(1);
      }
      outputPath = path;
    } else {
      console.error('No or invalid output path found');
      process.exit(1);
    }
  } else if (output_flags) {
    const path = output_flags.split('=')[1];

    if (path && existsSync(path)) {
      if (!lstatSync(path).isDirectory()) {
        console.error('The output path must be a directory');
        process.exit(1);
      }
      outputPath = path;
    } else {
      console.error('No or invalid output path found');
      process.exit(1);
    }
  } else {
    if (existsSync('src')) {
      if (!lstatSync('src').isDirectory()) {
        console.error('The output path must be a directory');
        process.exit(1);
      }
      outputPath = 'src';
      console.warn('The src directory is automatically set to output path');
    } else {
      console.error('No or invalid output path found');
      process.exit(1);
    }
  }

  /**
   * SOURCE ARG
   */
  let sourcePath;

  const src_flags_abbr = args.findIndex((arg) => arg === '-s');
  const src_flags = args.find((arg) => arg.startsWith('--source='));

  if (src_flags_abbr !== -1) {
    const path = args[src_flags_abbr + 1];

    if (path && existsSync(path)) {
      if (!lstatSync(path).isDirectory()) {
        console.error('The src path must be a directory');
        process.exit(1);
      }
      sourcePath = path;
    } else {
      console.error('No or invalid src path found');
      process.exit(1);
    }
  } else if (src_flags) {
    const path = src_flags.split('=')[1];

    if (path && existsSync(path)) {
      if (!lstatSync(path).isDirectory()) {
        console.error('The src path must be a directory');
        process.exit(1);
      }
      sourcePath = path;
    } else {
      console.error('No or invalid src path found');
      process.exit(1);
    }
  } else {
    if (existsSync('src')) {
      if (!lstatSync('src').isDirectory()) {
        console.error('The src path must be a directory');
        process.exit(1);
      }
      sourcePath = 'src';
      console.warn('The src directory is automatically set to src path');
    } else {
      console.error('No or invalid src path found');
      process.exit(1);
    }
  }

  return { shouldGenerateId, withExtension, sourcePath, outputPath, name };
}

module.exports = { getArgs };
