const yaml = require('js-yaml')
const fs = require('fs')

const getConfiguration = function () {
  try {
    return yaml.safeLoad(fs.readFileSync('./config/freschissimo.config.yaml', 'utf8'));
  } catch (e) {
    return false;
  }
}

module.exports = getConfiguration;