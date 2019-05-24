let { Readable } = require('stream')

const fileAdapter = require('./fileAdapter')
const fileRepository = require('./fileRepository')
const FileMetadata = require('./models/FileMetadata')
const { getFileExtension, getFileName } = require('./utils')

const bufferToReadbleStream = buffer => {
  const duplesStream = new Readable()
  duplesStream.push(buffer)
  duplesStream.push(null)
  return duplesStream
}

const saveFile = (fileName, dataBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileStream = bufferToReadbleStream(dataBuffer)
      const fileStat = await fileAdapter.saveFile(fileName, fileStream)

      const fileMetadata = new FileMetadata(
        getFileName(fileName),
        getFileExtension(fileName),
        fileStat.pathToFile,
        new Date(),
        fileStat.size
      )

      const result = await fileRepository.saveFileMetadata(fileMetadata)
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

const getFile = fileName => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileStream = await fileAdapter.getFile(fileName)
      let metadata = await fileRepository.getFileMetadata(fileName)

      if (fileStream && !metadata) {
        const fileStat = await fileAdapter.getFileStats(fileName)

        const fileMetadata = new FileMetadata(
          getFileName(fileName),
          getFileExtension(fileName),
          fileStat.pathToFile,
          new Date(),
          fileStat.size
        )

        metadata = await fileRepository.saveFileMetadata(fileMetadata)
      }

      resolve({
        fileStream,
        ...metadata
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { saveFile, getFile }
