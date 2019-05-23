const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionUrl = process.env.MONGODB_URL
const database = process.env.DB_NAME

const state = {
  db: null
}

const connect = cb => {
  if (state.db) cb()
  else {
    MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (err, client) => {
      if (err) return cb(err)
      else {
        state.db = client.db(database)
        cb()
      }
    })
  }
}

const getDb = () => state.db

module.exports = { getDb, connect}
