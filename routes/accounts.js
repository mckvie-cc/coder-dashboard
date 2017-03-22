var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer');
router.get('/getUsers', (req, res) => {
  let db = req.db
  db.collection('users', function(err, results) {
    if (err) {
      console.log(err);
      res.send({ status: 0 });
    } else {
      results.find({}).toArray(function(err, items) {
        if (err) {
          console.log(err)
          res.send({ status: 0 });
        }
        res.send(items);
      });
    }
  });
})

router.post('/register', (req, res) => {
  var email = req.body.email;
  var authKey = req.body.authKey;
  let db = req.db
  db.collection('signups_temp', function(err, collection) {
    if (err) {
      res.send({ status: 0 });
      console.log(err);
    } else {
      collection.find({ email: email, authKey: authKey }).toArray(function(err, items) {
        if (err) {
          res.send({ status: 0 });
        } else if (items.length === 0) {
          res.send("no Maching email and password found");
        } else {
          if (items[0].registered === false) {
            //make registered key true for email, authKey
            //add a new user to database with response.body object
            newUserInsert(email, authKey, req.body);
            res.send("Good job");
          } else {
            res.send("Already Registered");
          }

        }
      });
    }
  });
})

router.get('/varifyEmail/:email/:authKey', (req, res) => {
  var email = req.params.email;
  var authKey = req.params.authKey;
  let db = req.db
  db.collection('signups_temp', function(err, collection) {
    if (err) {
      res.send({ status: 0 });
      console.log(err);
    } else {
      collection.find({ email: email, authKey: authKey }).toArray(function(err, items) {
        if (err) {
          res.send({ status: 0 });
        } else if (items.length === 0) {
          res.send({ status: 2 });
        } else if (items[0].registered === true) {
          res.send({ status: 3 });
        } else {
          res.send({ status: 1, user: items[0] });
        }
      });
    }
  })
})

router.get('/sendMails', (req, res) => {
  let db = req.db
  db.collection('signups_temp', function(err, collection) {
    if (err) {
      res.send({ status: 0 });
      console.log(err);
    } else {
      collection.find({}).toArray(function(err, items) {
        items.forEach(function(item) {
          mailer(item.email, item.authKey);
        });
      });
    }
  })
})

function makeRegisteredKeyTrue(email, authKey, userInfo, callback) {
  let db = req.db
  db.collection('signups_temp', function(err, collection) {
    if (err) {
      console.log(err);
    } else {
      collection.update({ email: email }, { $set: { registered: true } });
    }
  })
  callback(userInfo);
}

function newUserInsert(email, authKey, userInfo) {
  makeRegisteredKeyTrue(email, authKey, userInfo, function(userData) {
    let db = req.db
    db.collection('users', function(err, collection) {
      if (err) {
        console.log(err);
      } else {
        collection.insert({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          sex: userData.sex,
          profile_url: userData.github_profile
        });
      }
    })
  });
}

function mailer(email, authKey) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: '50daysofcode@gmail.com', // Your email id
      pass: 'joysa000' // Your password
    }
  });
  var registration_link = 'http://localhost:3000/signup.html?email=' + email + '&authKey=' + authKey;
  var text = '<h3>Hello coders</h3>' +
    '<em>Congratulations</em> for taking first step toward your coding careers' +
    '“<p><em>To embark on the journey towards your goals and dreams requires bravery. To remain on that path requires courage. The bridge that merges the two is commitment.</em></p>”' +
    '<p>Use the following link to register for 50 Days Of Code : <a href="' + registration_link + '">Registration Link</a></p>';
  var mailOptions = {
    from: '50daysofcode@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Registration for 50 Days Of Code', // Subject line
    html: text //, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      throw new Error(error);
    } else {
      console.log('Message sent: ' + info.response);
    };
  });
}

module.exports = router
