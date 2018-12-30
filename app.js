const express       = require('express'),
      passport      = require('passport'),
      localStrategy = require('passport-local').Strategy; //username,passwordでの認証
      session = require('express-session'),
      bodyParser = require('body-parser'), //req.bodyをパースしてくれる
      User = require('./User') //自分で定義する

const app = new express();

passport.use(new localStrategy(
    function(username, password, done) {
        //usernameとpasswordが正しいか判断する。第2引数はcallback関数で引数にuserを渡す
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err)}
            if (!user) {
                return done(null, false, { message: 'Incorrect username'})
            }

            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password'})
            }

            return done(null, user)
        })
    }
));

app.use(express.static('public'))
app.use(session({ secret: "secret word"}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user, done) {
    //useridをセッションにシリアライズ
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    //セッションに格納されたシリアライズされたidをデシリアライズして取り出す。
    User.findById(id, function(err, user) {
        done(err, user)
    })
})

app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/login.html' })
)

app.get('/', function(req, res) {
    console.log(req.user)

    if (req.user) res.send(req.user.name)
    else res.send('login failure')
})

app.get('/login', function(req, res) {
    res.send()
})

app.listen(3000)