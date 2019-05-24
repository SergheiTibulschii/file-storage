const app = require('./app')
const { connect } = require('./dbContext')

connect(() => {
  app.listen(process.env.PORT, () => {
    process.stdout.write(`Server is up on port ${process.env.PORT}` + '\n')
  })
})
