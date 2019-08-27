/* global require, __dirname */

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const basePath = path.resolve(__dirname, '..');
const { execSync } = require('child_process');
const pkgPath = path.resolve(basePath, 'package.json');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'version',
      message: 'Which version you want to release?',
    },
  ])
  .then(answers => {
    let pkgJson = fs.readFileSync(pkgPath, 'utf8');
    pkgJson = pkgJson.replace(/"version":(.*)/i, `"version": "${answers.version}",`);
    fs.writeFileSync(pkgPath, pkgJson, 'utf8');

    execSync(`npm i && git commit -am "${answers.version}" && git push origin HEAD:master`);
    execSync(`npm run build && git add -f dist && git commit -m "build ${answers.version}"`);
    execSync(`git tag ${answers.version} && git push upstream ${answers.version}`);
    execSync('npm publish');
  });
