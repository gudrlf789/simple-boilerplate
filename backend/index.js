const express = require('express')
const app = express()
const port = 5000

const db = require('./config/keys')

const bodyParser = require('body-parser')
const { User } = require('./models/User');

//application/x-www-form-urlencoded 를 분석해서 가져올수 있게 도와준다.
app.use(bodyParser.urlencoded({extended: true}));
//application/json 타입을 분석해서 가져올수 있게 도와준다.
app.use(bodyParser.json());

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

  app.post('/register', (req, res) => {

    //회원 가입 할때 필요한 정보들을 client에서 가져오면 그 정보들을 db에 넣어준다.
    const user = new User(req.body);

    user.save((err, userInfo) => {
      if(err) return res.json({ sucess: false, err })

      return res.status(200).json({
        sucess: true
      })
    })
  })

app.listen(port, () => console.log(`Example app listening on port ${port}`))