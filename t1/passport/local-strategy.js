const LocalStrategy = require('passport-local').Strategy;
const { login, updateLoginIp } = require('../models/login/Login');

const cb = async (req, member_id, member_pw, done) => {
  try {
    const { success, user } = await login(member_id, member_pw);
    if (success) {
      done(null, user);
      await updateLoginIp(req.body.loginIp, member_id);
    } else {
      done(null, false, '아이디와 패스워드를 확인하세요.');
    }
  } catch (err) {
    done(err);
  }
};

const fields = {
  usernameField: 'member_id',
  passwordField: 'member_pw',
  passReqToCallback: true,
};

const localStrategy = new LocalStrategy(fields, cb);

module.exports = (passport) => passport.use(localStrategy);
