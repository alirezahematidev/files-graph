#!/usr/bin/env node

import { getArgs } from '../src/args/index.mjs';
import { generate } from '../src/index.js';

const args = process.argv;

const props = getArgs(args);

generate(props);