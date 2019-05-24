const { getDb } = require('./dbContext')
const { getFileExtension, getFileName } = require('./utils')

const tableName = process.env.FILE_METADATA_TABLE

const saveFileMetadata = fileMetadata => {
  return new Promise((resolve, reject) => {
    getDb()
      .collection(tableName)
      .replaceOne({ fileName: fileMetadata.fileName }, fileMetadata, { upsert: true }, (err, result) => {
        if (err) {
          reject(err)
        }

        if ((result.message.documents[0].nModified)) {
          resolve(null)
        } else {
          resolve(result.ops[0])
        }
      })
  })
}

const getFileMetadata = fileName => {
  const query = {
    fileName: getFileName(fileName),
    fileExtension: getFileExtension(fileName)
  }

  return new Promise((resolve, reject) => {
    getDb()
      .collection(tableName)
      .findOne(query, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
  })
}

const deleteMany = () => {
  getDb()
    .collection(tableName)
    .deleteMany()
}

module.exports = { saveFileMetadata, getFileMetadata, deleteMany }
