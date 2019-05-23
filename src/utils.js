const path = require('path')

const getFileExtension = fileName => path.parse(fileName).ext.replace('.', '')

const getFileName = fileName => path.parse(fileName).name

module.exports = { getFileExtension, getFileName }
