const jwt = require("jsonwebtoken");
const config = require("config");

function authorization(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. No Token Provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = authorization;
