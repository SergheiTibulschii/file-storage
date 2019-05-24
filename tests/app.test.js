const supertest = require('supertest')
const app = require('../src/app')
const path = require('path')
const mime = require('mime')
const {getFileExtension, getFileName} = require('../src/utils')

jest.mock('../src/fileStorage.js')
const fileStorage = require('../src/fileStorage.js')

test('File successfully uploads and returns 201', async () => {
  const fileName = 'test.pdf'
  fileStorage.saveFile = (fileName, dataBuffer) => Promise.resolve({})
  
    await supertest(app)
    .put(`/files/${fileName}`)
    .attach('document', path.join(__filename, `../testFiles/${fileName}`))
    .expect(201)
})

test('File successfully uploads and returns 204', async () => {
  const fileName = 'test.pdf'
  fileStorage.saveFile = (fileName, dataBuffer) => Promise.resolve()
  
    await supertest(app)
    .put(`/files/${fileName}`)
    .attach('document', path.join(__filename, `../testFiles/${fileName}`))
    .expect(204)
})

test('File storage gets called on saveFile', async () => {
  const fileName = 'test.pdf'
  const saveFile = jest.spyOn(fileStorage, 'saveFile').mockImplementation(() => {})

  await supertest(app)
    .put(`/files/${fileName}`)

    expect(saveFile).toHaveBeenCalledWith(fileName, expect.any(Buffer))
})

test('File not found', async () => {
    const fileName = 'non-existingfile.png'

    fileStorage.getFile = (fileName) => Promise.resolve({fileStream: null})

    await supertest(app)
    .get(`/files/${fileName}`)
    .expect(404)
})

test("getFile receive ok result", async () => {
  const fileName = 'image.png'
  const fileSize = '5000'

  const fs = require('fs')
  const readAble = fs.createReadStream(path.join(__dirname, './testFiles/test.pdf'))


  fileStorage.getFile = (fileName) => Promise.resolve({
    fileStream: readAble,
    fileName: getFileName(fileName),
    fileExtension: getFileExtension(fileName),
    fileSize
  })

  await supertest(app)
  .get('/files/image.png')
  .expect('content-type', mime.lookup(fileName))
  .expect('content-length', fileSize)
  .expect(200)
})