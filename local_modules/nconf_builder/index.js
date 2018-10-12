const path = require('path')
const nconf = require('nconf')
const nconfYml = require('nconf-yaml')

const PREFIX = 'TILEVIEW_'

nconf
  .env({
    transform : (configObject) => {
      if(configObject.value === 'false') {
        configObject.value = false
      }
      if(configObject.value === 'true') {
        configObject.value = true
      }
      if(configObject.key.indexOf(PREFIX) === 0) {
        configObject.key = configObject.key.replace(PREFIX, '')
        return configObject
      }
    },
    separator : '_'
  })
  .file({file : path.resolve(`${__dirname}/../../config/default_config.yml`), format : nconfYml})

module.exports = (function() {
  return nconf
})()
