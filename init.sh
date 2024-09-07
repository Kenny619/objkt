#!/bin/bash

# Example commands in your shell script
echo "Running npm init"
npm init -y

# echo "Installing dependencies with pnpm"
pnpm i -D typescript @biomejs/biome @types/node rimraf tsc-alias tsx vite-tsconfig-paths vitest
pnpm i --save fs path 

echo "Creating tsconfig.json"
tsc --init

echo "Creating biome.json"
npx @biomejs/biome init

echo "Update directory structure"
mkdir dist
mkdir src
mkdir tests
mkdir types
touch .env
touch vite.config.ts

echo "Running init.js"
node init.js