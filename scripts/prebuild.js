#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const config = require('../.angular-cli.json');

const targetEnvironmentFile = path.join(__dirname, `../src/${config.apps[0].environments.prod}`);
const targetEnvironmentTemplateFile = `${targetEnvironmentFile}.template`;

// Define default values in case there are no defined ones,
// but you should define only non-crucial values here,
// because build should fail if you don't provide the correct values
// for your production environment
const defaultEnvValues = {
  // PREFIX_STORAGE_TYPE: 'localStorage',
  // PREFIX_USER_TOKEN_FIELD_NAME: 'userToken',
};

if(process.argv.includes('-create')) {
  // Load template file
  const environmentTemplate = fs.readFileSync(
    targetEnvironmentTemplateFile,
    {encoding: 'utf-8'}
  );

// Generate output data
  const output = ejs.render(environmentTemplate, Object.assign({}, defaultEnvValues, process.env));
// Write environment file
  fs.writeFileSync(targetEnvironmentFile, output);
} else if(process.argv.includes('-delete')) {
  fs.unlinkSync(targetEnvironmentFile);
} else {
  throw new Error('Prebuild ran with not arguments!');
}


process.exit(0);
