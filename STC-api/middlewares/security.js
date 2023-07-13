const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;
const logger = require("../utils/logger");

exports.checkJWT = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!!token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
      if (err) {
        logger.warn("Invalid token");
        return res.status(401).json("Token not valid");
      } else {
        req.decoded = decoded;
        if (
          req.url.startsWith("/garbages") &&
          decoded.role !== "ADMIN" &&
          decoded.role !== "IOT"
        ) {
          logger.warn("Unauthorized, only specific role can do this");
          return res
            .status(401)
            .json("Unauthorized, only specific role can do this");
        }
        if (req.url.startsWith("/users") && decoded.role !== "ADMIN") {
          logger.warn("Unauthorized, only Admin can access !");
          return res.status(401).json("Unauthorized, only Admin can access !");
        }
        const expiresIn = 24 * 60 * 60;
        const newToken = jwt.sign(
          {
            user: decoded.user,
          },
          TOKEN_KEY,
          {
            expiresIn: expiresIn,
          }
        );

        res.header("Authorization", "Bearer " + newToken);
        next();
      }
    });
  } else {
    logger.warn("Unauthorized: Token is required");
    return res.status(401).json("Token required");
  }
};
