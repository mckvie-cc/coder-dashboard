var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
    res.render('index', {title: 'Coder-Dashboard | Home'})
})
router.get('/signup', (req, res)=>{
	res.render('signup', {title: 'Coder-Dashboard | Register'})
})
router.get('/login', (req, res)=>{
	res.render('login', {title: 'Coder-Dashboard | Login'})
})
router.get('/profile/:userId', (req, res)=>{
	const userId = req.params.userId
	res.render('profile', {title: 'Coder-Dashboard | Profile', userId: userId})
})
module.exports = router