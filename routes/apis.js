var express = require('express')
var router = express.Router()
const request = require('request')
const json_data = require('../public/commit_data.json')

router.get('/user_commits', (req, res) => {
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
            return res.json({
                error: true,
                message: 'Unexpected Error'
            })
        }
        collection.find({}).toArray(function(err, user_list) {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: 'Users list could not be retrieved'
                });
            } else {
                return res.status(200).send(user_list);
            }
        });
    });
})

router.get('/user/:userId', (req, res) => {
    const db = req.db
    const userId = req.params.userId
    db.collection('users', function(err, collection) {
        if (err) {
            return res.status(404).send('Unexpected error')
        }
        collection.find({ _id: safeObjectId(userId) }).toArray(function(err, result) {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: 'Users list could not be retrieved'
                });
            } else {
                res.status(200).json({
                    error: false,
                    data: result
                });
            }
        });
    });
})

router.post('/register', (req, res) => {
    const email = req.body.email
    const db = req.db
    db.collection('users', function(err, collection) {
        if (err) {
            return res.status(403).send('Unexpected Error')
        } else {
            collection.find({ email: email }).toArray(function(err, items) {
                if (err) {
                    return res.status(500).send('Unexpected Error')
                } else if (items.length === 0) {
                    collection.insert(req.body)
                    return res.status(200).send("New user registered");
                } else {
                    return res.status(200).send("Already Registered");
                }
            })
        }
    })
})

router.post('/login', (req, res)=>{
    const db = req.db
    const email = req.body.email
    const password = req.body.password

    db.collection('users', (err, collection)=>{
        if(err){
            return res.status(500).send('Unexpected error')
        }
        collection.find({email: email}).toArray(function(err, items){
            if(err){
                return res.status(500).send('Unexpected Error')
            }
            if(items.length === 0){
                return res.status(403).send('User not registered')
            } else {
                if(password === items[0].password){
                    return res.status(200).send('Passwords match')
                }
                return res.status(500).send('Passwords don\'nt match')
            }
        })
    })
})

module.exports = router
