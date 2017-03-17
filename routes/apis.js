var express = require('express')
var router = express.Router()
const json_data = require('../commit_data.json')

router.get('/userRatings', (req, res) => {
    let db = req.db
    db.collection('users', function(err, collection) {
        if (err) {
            throw new Error(err)
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
