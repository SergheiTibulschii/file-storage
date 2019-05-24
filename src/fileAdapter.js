const fs = require('fs')
const path = require('path')

const storagePath = path.join(__dirname, '../data')

const formatFilePath = fileName => `${storagePath}\\${fileName}`

const getFileStats = async fileName => {
  const pathToFile = formatFilePath(fileName)

  return new Promise((resolve, reject) => {
    fs.stat(pathToFile, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve({ size: stats.size, pathToFile })
      }
    })
  })
}

const fileOrDirectoryExists = pathToFile => {
  return new Promise(async resolve => {
    await fs.stat(pathToFile, err => {
      resolve(!(err && err.errno === -4058))
    })
  })
}

const saveFile = (fileName, fileStream) => {
  const pathToFile = formatFilePath(fileName)

  return new Promise(async (resolve, reject) => {
    if (!(await fileOrDirectoryExists(storagePath))) {
      fs.mkdirSync(storagePath)
    }

    const ws = fs.createWriteStream(pathToFile)

    ws.on('pipe', () => process.stdout.write(`Starting piping ${fileName + '\n'}`))
    ws.on('close', async () => process.stdout.write('Closing underlying resources' + '\n'))
    ws.on('finish', async () => {
      try {
        const stats = await getFileStats(fileName)
        resolve(stats)
      } catch (err) {
        reject(err)
      } finally {
        process.stdout.write(`Write of the ${fileName} completed${'\n'}`)
      }
    })

    fileStream.pipe(ws)
  })
}

const getFile = fileName => {
  const pathToFile = formatFilePath(fileName)

  return new Promise(async (resolve, reject) => {
    try {
      if (await fileOrDirectoryExists(pathToFile)) {
        resolve(fs.createReadStream(pathToFile))
      } else { resolve(null) }
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { saveFile, getFile, getFileStats }
