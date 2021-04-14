const express = require('express')
const app = express();

const db = require('./config/keys')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');

//미들웨어
const { auth } = require('./middleware/auth');

//application/x-www-form-urlencoded 를 분석해서 가져올수 있게 도와준다.
app.use(bodyParser.urlencoded({extended: true}));
//application/json 타입을 분석해서 가져올수 있게 도와준다.
app.use(bodyParser.json());
app.use(cookieParser());

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

  app.get('/api/hello', (req, res) => {
    res.send("안녕하세요");
  })

  app.post('/api/users/register', (req, res) => {

    //회원 가입 할때 필요한 정보들을 client에서 가져오면 그 정보들을 db에 넣어준다.
    const user = new User(req.body);

    user.save((err, userInfo) => {
      if(err) return res.json({ sucess: false, err })
      return res.status(200).json({
        sucess: true
      })
    })
  })

  app.post('/api/users/login', (req, res) => {

     User.findOne({ email: req.body.email }, (err, user) => {
      // user는 스키마

       if(!user){
         return res.json({
           loginSuccess: false,
           message: "해당하는 유저가 없습니다."
         })
       }

       user.comparePassword(req.body.password, (err, isMatch) => {
          if(!isMatch)
            return res.json({ loginSuccess: false, message: "비밀번호가 틀림" });

          // 비밀번호까지 맞다면 토큰 생성
          user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);

            // 토큰을 저장한다
            res.cookie("x_auth", user.token)
              .status(200)
              .json({ loginSuccess: true,  userId: user._id})
          })
       })

     })
  })

  //auth는 미들웨어
  app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image
    });
  })

  app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: ""}, (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
  })

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}`))