const utils = require('loader-utils')
const styleBuilder = require('@qwant/map-style-builder')

module.exports = function(source) {
  if(this.cacheable) {
    this.cacheable()
  }

  const style = JSON.parse(source)

  let options = utils.getOptions(this)
  options = options || {}
  options.styleDir = this.context
  options.output = options.output || 'debug'
  options.conf = require(options.conf)

  return styleBuilder(style, options)
}