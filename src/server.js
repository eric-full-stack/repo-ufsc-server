const app = require('./index')

app.listen(process.env.PORT || 3333)
console.log(`Server runing on port ${process.env.PORT}`)