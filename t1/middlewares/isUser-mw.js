const { alert } = require('../modules/util');

module.exports = () => {
  return (req, res, next) => {
    if (!req.user && req.path.includes('/admin/login')) {
      next();
    } else if (req.user) {
      next();
    } else {
      res.send(alert('로그인 해주세요', '/admin/login'));
    }
  };
};
