const express = require('express')
const app = express()
const port = 5000

const db = require('./config/keys')

const mongoose = require('mongoose');
// 몽고db에 연결
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

  app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Example app listening on port ${port}`))