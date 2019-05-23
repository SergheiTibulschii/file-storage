const request = require('supertest')
const app = require('../src/app')
const path = require('path')
const mime = require('mime')
const {getFileExtension, getFileName} = require('../src/utils')
const {Stream} = require('stream')

jest.mock('../src/fileStorage.js')

const fileStorage = require('../src/fileStorage.js')


test('File successfully uploads', async () => {
  const fileName = 'test.pdf'
  fileStorage.saveFile = (fileName, dataBuffer) => Promise.resolve()
  
    await request(app)
    .put(`/files/${fileName}`)
    .attach('document', path.join(__filename, `../testFiles/${fileName}`))
    .expect(200)
})

test('File storage gets called on saveFile', async () => {
  const fileName = 'test.pdf'
  const saveFile = jest.spyOn(fileStorage, 'saveFile').mockImplementation(() => {})

  await request(app)
    .put(`/files/${fileName}`)
    .end()

    expect(saveFile).toHaveBeenCalledWith(fileName, expect.any(Buffer))
})


test('File not found', async () => {
    const fileName = 'non-existingfile.png'

    fileStorage.getFile = (fileName) => Promise.resolve({fileStream: null})

    await request(app)
    .get(`/files/${fileName}`)
    .expect(404)
})