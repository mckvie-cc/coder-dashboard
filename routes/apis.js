var express = require('express')
var router = express.Router()
const json_data = require('../commit_data.json')

router.get('/impl', (req, res) => {
    getUserLists(function(users) {
        let obj = {};
        obj.available_users = users.filter((user) => user.team_name === null);
        let map = new Map();
        for (let user of users) {
            if (user.team_name != null) {
                //	console.log(user);

                if (!(map).has(user.team_name)) {
                    map.set(user.team_name, []);
                }
                map.set(user.team_name, (map.get(user.team_name)).push(user));

                /*if ((obj.teams).get(user.team_name)) {
                	(obj.teams).set(user.team_name,((obj.teams).get(user.team_name)).push(obj));
                } else {
                	(obj.teams).set(user.team_name,[user]);
                }*/

            }
        }
        console.log(map);
        res.send(obj);
    });
});

router.get('/userRatings', (req, res) => {
    let db = req.db
    db.collection('users', function(err, collection) {
        if (err) {
            throw new Error(err1)
            return;
        } else {
            collection.find({}).toArray(function(err, user_list) {
                if (err) {
                    throw new Error(err)
                }
                var profile_list = user_list.map((user) => {
                    const profile_user_name = (user.profile_url).replace("https://github.com/", "");
                    const commit_count = (json_data.filter((commit) => commit.author.login === profile_user_name.trim())).length;
                    user.commit_count = commit_count;
                    return user;
                }).sort((a, b) => a.commit_count < b.commit_count);
                res.json(profile_list);
            });
        }
    });
});

module.exports = router
