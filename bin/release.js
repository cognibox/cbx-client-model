/* global require, __dirname */

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'version',
      message: 'Which version you want to release (ex: 1.0.0)?',
    },
    {
      type: 'input',
      name: 'remote',
      message: 'Which remote you want to push (ex: origin, upstream)?',
    },
  ])
  .then(answers => {
    const remote = answers.remote;

    const basePath = path.resolve(__dirname, '..');
    const pkgPath = path.resolve(basePath, 'package.json');
    const packageJsonIndent = 2;

    const packageJson = require(pkgPath);
    packageJson.version = answers.version;

    fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, packageJsonIndent), 'utf8');

    execSync(`npm i && git commit -am "${answers.version}" && git push ${remote} HEAD:master`);
    execSync(`npm run build && git add -f dist && git commit -m "build ${answers.version}"`);
    execSync(`git tag ${answers.version} && git push ${remote} ${answers.version}`);
    execSync('npm publish');
  });
