const { Readable } = require('stream')
const FileMetada = require('../src/models/FileMetadata')

jest.mock('../src/fileAdapter.js')

jest.mock('../src/fileRepository.js', () => (
    {
        saveFileMetadata (metadata) {
            return new Promise((resolve) => {
                resolve()
            })
        }
    }
))

const fileAdapter = require('../src/fileAdapter.js')
const fileRepository = require('../src/fileRepository.js')

const fileStorage = require('../src/fileStorage.js')


describe("Test fileStorage.js", () => {


    test('saveFile sucessfully resolves', async () => {
        const fileName = 'testFile'
        const fileBuffer = Buffer.from('')

        fileAdapter.saveFile = (fileName, fileStream) => Promise.resolve({ size: 5000, pathToFile: "path" })

        const result = await fileStorage.saveFile(fileName, fileBuffer)

        expect(result).not.toBeDefined()
    })

    test('Proper functions being called on saveFile', async () => {
        const fileName = 'testFile'
        const fileBuffer = Buffer.from('')

        fileAdapter.saveFile = (fileName, fileStream) =>  Promise.resolve({ size: 5000, pathToFile: "path" }) 

        const spyOnSaveFile = jest.spyOn(fileAdapter, 'saveFile')
        const spyOnSaveFileMetadata = jest.spyOn(fileRepository, 'saveFileMetadata')

        await fileStorage.saveFile(fileName, fileBuffer)

        expect(spyOnSaveFile).toHaveBeenCalledWith('testFile', expect.any(Readable))
        expect(spyOnSaveFileMetadata).toHaveBeenCalledWith(expect.any(FileMetada))
    })

    test('Exception is properly processed on saveFile', () => {
        const fileName = 'testFile'
        const message = 'Unexpected system error'

        fileAdapter.getFile = (fileName) => Promise.reject(new Error(message))

        const result = fileStorage.getFile(fileName)

        expect(result).rejects.toThrow(message)
    })

    test('Proper functions being called on getFile', async () => {
        const fileName = 'fileName'
        const stream = new Readable()
        const metadata = new FileMetada(fileName)

        fileAdapter.getFile = (fileName) => Promise.resolve(stream)

        fileRepository.getFileMetadata = (fileName) => Promise.resolve(metadata)

        const spyOnGetFile = jest.spyOn(fileAdapter, 'getFile')
        const spyOnGetFileMetadata = jest.spyOn(fileRepository, 'getFileMetadata')

        const result = await fileStorage.getFile(fileName)

        expect(spyOnGetFile).toHaveBeenCalledWith(fileName)
        expect(spyOnGetFileMetadata).toHaveBeenCalledWith(fileName)
        expect(result.fileStream).toBe(stream)
        expect(result.fileName).toBe(fileName)
    })
})
