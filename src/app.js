const express = require('express')
const mime = require('mime')
const fileStorage = require('./fileStorage')

const app = express()

const readBinary = function(req, res, next) {
  var data = ''

  req.setEncoding('binary')
  req.on('data', function(chunk) {
    data += chunk
  })

  req.on('end', function() {
    req.body = data
    next()
  })
}

app.get('/files/:fileName', async (req, res) => {
  const fileName = req.params.fileName

  try {
    const file = await fileStorage.getFile(fileName)

    if (!file.fileStream) {
      res.status(404).send()
    } else {
      file.fileStream.on('end', () => res.end())
      res.header('content-type', mime.lookup(file.fileExtension))
      res.header('content-length', file.fileSize)
      file.fileStream.pipe(res)
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
})

app.put('/files/:fileName', readBinary, async (req, res) => {
  const fileName = req.params.fileName

  try {
    var fileDataBuffer = Buffer.from(req.body, 'binary')
    const result =  await fileStorage.saveFile(fileName, fileDataBuffer)
    
    if(result){
      res.status(201).end() 
    }else{
      res.status(204).end() 
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = app
