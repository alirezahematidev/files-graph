#!/usr/bin/env node

import { getArgs } from '../src/args/index.js';
import { generate } from '../src/index.js';

const args = process.argv;

const props = getArgs(args);

generate(props);