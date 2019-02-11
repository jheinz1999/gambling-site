const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_SECRET || 'a really secure key';

const generateToken = user => {

  const payload = {

    subject: user.id

  }

  const options = {

    expiresIn: 60 * 60 * 24 * 30 // tokens last 30 days

  }

  return new Promise((res, rej) => {

    jwt.sign(payload, jwtKey, options, (err, token) => {

      if (err)
        rej(err);

      else
        res(token);

    });

  });

}

const authenticate = (req, res, next) => {

  const token = req.get('Authorization');

  if (token) {

    jwt.verify(token, jwtKey, (err, decoded) => {

      if (err)
        return res.status(401).json({message: 'You are not authorized! Please log in.'});

      req.decoded = decoded;

      next();

    });

  }

  else {

    res.status(401).json({
      message: 'You are not authorized! Please log in.'
    });

  }

}

module.exports = {

  generateToken,
  authenticate

}
