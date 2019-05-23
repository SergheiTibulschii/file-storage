class FileMetadata {
  constructor(fileName, fileExtension, pathToFile, createdOn, fileSize) {
    this.fileName = fileName
    this.fileExtension = fileExtension
    this.pathToFile = pathToFile
    this.createdOn = createdOn
    this.fileSize = fileSize
  }
}

module.exports = FileMetadata
