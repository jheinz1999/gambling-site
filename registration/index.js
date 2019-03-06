const express = require('express');
const bcrypt = require('bcrypt');

const { generateToken } = require('../common/authentication');
const { db } = require('../data/db');

const server = express.Router();

server.post('/register', async (req, res) => {

  let { username, password, email } = req.body;

  if (!username) {

    res.status(400).json({message: 'no username provided'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'no password provided'});
    return;

  }

  if (!email) {

    res.status(400).json({message: 'no email provided'});
    return;

  }

  try {

    password = await bcrypt.hash(password, 1);

    await db.insert({ username, password, email, cash: 1000 }).into('users');
    const user = await db.select('username', 'id', 'cash').from('users').where('username', username).first();

    const token = await generateToken(user);

    res.status(201).json({
      username: user.username,
      user_id: user.id,
      token
    });

  }

  catch (err) {

    const withName = await db.select().from('users').where({ username }).first();
    const withEmail = await db.select().from('users').where({ email }).first();

    if (withName || withEmail) {

      res.status(400).json({message: 'Duplicate name or email!', duplicateUser: withName !== undefined, duplicateEmail: withEmail !== undefined});

    }

    else {

      res.status(500).json({message: 'internal server error'});

    }

  }

});

server.post('/login', async (req, res) => {

  const { username, password } = req.body;

  if (!username) {

    res.status(400).json({message: 'no username provided'});
    return;

  }

  if (!password) {

    res.status(400).json({message: 'no password provided'});
    return;

  }

  try {

    const user = await db.select('username', 'password', 'id', 'cash').from('users').where('username', username).first();

    if (user) {

      const correct = await bcrypt.compare(password, user.password);

      if (correct) {

        const token = await generateToken(user);

        res.status(200).json({
          user_id: user.id,
          username: user.username,
          token,
          cash: user.cash
        });

      }

    }

    res.status(401).json({message: 'Invalid credentials'});

  }

  catch (err) {

    res.status(500);

  }

});

/*server.post('/passwordreset', async (req, res) => {

  const { email } = req.body;

  try {

    const user = await db.select().from('users').where({ email }).first();

    if (!user) {

      res.status(404).json({message: 'User not found!'});
      return;

    }

    let password = randomstring.generate(8);
    let hashed = await bcrypt.hash(password, 1);
    await db.update('password', hashed).from('users').where({id: user.id});

    const smtpTransport = mailer.createTransport({
      service: "Gmail",
      auth: {
          user: "usemytoolsemailer@gmail.com",
          pass: "usemytools42069"
      }
    });

    var mail = {
        from: "Use My Tools <usemytoolsemailer@gmail.com>",
        to: user.email,
        subject: "Password Reset",
        text: `We've reset your password! Your new password is: ${password}. Please change it as soon as you can!`
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
            res.status(500).json({message: 'Email did not send'});
        }else{
            console.log("Message sent!");
        }

        smtpTransport.close();
    });

    res.status(200).json({message: "email sent"});

  }

  catch (err) {

    console.log(err);
    res.status(500).json({message: 'error'});

  }

});*/

module.exports = server;
