const express = require('express')
const router = express.Router()
const request = require('request')
const sendMail = require('../utils/mailer')
const json_data = require('../public/commit_data.json')

const authenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/api/logout');
    } else {
        next();
    }
};

router.get('/user_commits', authenticated, (req, res) => {
    const db = req.db
    const options = {
        url: 'https://api.github.com/repos/mckvie-cc/coder-dashboard/commits',
        headers: {
            'User-Agent': 'coder-dashboard',
        }
    };
    request(options, function(error, response, requestResult) {
        if (error) {
            return res.status(404).send(error)
        }

        const commitsDataFromGithub = JSON.parse(requestResult)
        db.collection('users', function(err, collection) {
            if (err) {
                return res.status(500).send(err.message)
            }
            collection.find({}).toArray(function(err, user_list) {
                if (err) {
                    return res.status(500).send(err.message)
                }
                var profile_list = user_list.map((user) => {
                    let commit_count = (commitsDataFromGithub.filter(function(el) {
                        return el.commit.author.email === user.email
                    })).length;

                    let userObj = {
                        id: user._id,
                        name: user.name,
                        profile_url: user.profile_url,
                        team_name: user.team_name,
                        commit_count: commit_count
                    }
                    return userObj;
                }).sort(function(a, b) {
                    return b.commit_count - a.commit_count
                })

                return res.status(200).send(profile_list);
            });
        });
    });

});

router.get('/user', (req, res) => {
    const db = req.db
    db.collection('users', function(err, collection) {
        if (err) {
            return res.status(500).json('Unexpected Error')
        }
        collection.find({}).toArray(function(err, user_list) {
            if (err) {
                return res.status(500).send('Users list could not be retrieved');
            }

            let usersList = user_list.map((user) => {
                const userObj = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile_url: user.profile_url,
                    sex: user.sex,
                    team_name: user.team_name
                }
                return userObj
            })
            return res.status(200).send(usersList);
        });
    });
})

router.get('/user/:userId', (req, res) => {
    const db = req.db
    const ObjectId = req.objectId

    const userId = req.params.userId
    db.collection('users', function(err, collection) {
        if (err) {
            return res.status(500).send('Unexpected error')
        }
        collection.find({ _id: ObjectId(userId).valueOf() }).toArray(function(err, result) {
            if (err) {
                return res.status(500).send('Users list could not be retrieved');
            } else {
                const user = result[0]
                const userObject = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile_url: user.profile_url,
                    sex: user.sex,
                    team_name: user.team_name
                }
                return res.status(200).json(userObject);
            }
        });
    });
})

router.post('/register', (req, res) => {
    const newUserInfo = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        password: req.body.password.trim()
    }
    if(!req.body.name || req.body.name === "" || !req.body.email || req.body.email === ""
        || !req.body.password || req.body.email === ""){
        return res.status(403).send("All fields not set properly")
    }

    const db = req.db
    db.collection('users', function(err, collection) {
        if (err) {
            return res.status(500).send('Unexpected Error')
        } else {
            collection.find({ email: newUserInfo.email }).toArray(function(err, items) {
                if (err) {
                    return res.status(500).send('Unexpected Error')
                } else if (items.length === 0) {
                    collection.insert(newUserInfo)
                    sendMail({
                      to: newUserInfo.email,
                      subject: 'Welcome to 50 Days of Code',
                      body: '<h3>50 Days of Code</h3><p>Thanks for registering with MCKVCC. <br> #codeOn</p>'
                    })
                    req.session.isLoggedIn = true
                    return res.status(200).send("New user registered");
                } else {
                    return res.status(403).send("Already Registered");
                }
            })
        }
    })
})

router.post('/login', (req, res) => {
    const db = req.db
    const email = req.body.email
    const password = req.body.password

    db.collection('users', (err, collection) => {
        if (err) {
            return res.status(500).send('Unexpected error')
        }
        collection.find({ email: email }).toArray(function(err, items) {
            if (err) {
                return res.status(500).send('Unexpected Error')
            }
            if (items.length === 0) {
                return res.status(403).send('User not registered')
            } else {
                if (password === items[0].password) {
                    req.session.isLoggedIn = true
                    req.session.userObj = {
                        name: items[0].name,
                        email: items[0].email,
                        id: items[0]._id
                    }
                    return res.status(200).send('Passwords match')
                }
                return res.status(403).send('Passwords don\'nt match')
            }
        })
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    return res.redirect('/')
})

module.exports = router
