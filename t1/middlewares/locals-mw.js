module.exports = (req, res, next) => {
  if (req.user) {
    console.log(req.user);
    res.locals.user = {
      id: req.user.id,
      userid: req.user.userid,
      username: req.user.username,
      email: req.user.email,
      status: req.user.status,
    };
  } else res.locals.user = null;

  res.locals.user = req.user || null;
  next();
};
