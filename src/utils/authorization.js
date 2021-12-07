const jwt = require("jsonwebtoken");

exports.authorize = function (role) {
  return async function (req, res, next) {
    const { authorization } = req.headers;
    if (role == "guest") {
      if (authorization)
        return res.status(302).json({ message: "User Authorized" });

      next();
    } else {
      if (!authorization)
        return res.status(403).json({ message: "User Unauthorized" });
      const [authType, token] = authorization.split(" ");

      if (authType != "Bearer" || !token)
        return res.status(403).json({ message: "User Unauthorized" });

      jwt.verify(token, process.env.ACCESS_TOKEN, (err, auth) => {
        const roles = ["employee", "admin", "superadmin"];

        if (
          req.query.userId &&
          auth._id != req.query.userId &&
          !/admin/.test(auth.role)
        )
          return res.status(403).json({ message: "User Unauthorized" });

        if (err || roles.indexOf(auth.role) < roles.indexOf(role))
          return res.status(403).json({ message: "User Unauthorized" });

        res.locals = auth;
        next();
      });
    }
  };
};
