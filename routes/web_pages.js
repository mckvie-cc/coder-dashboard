const express = require('express')
const router = express.Router()

const authenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        res.redirect('/apis/logout');
    } else {
        next();
    }
};
const unauthenticated = (req, res, next) => {
    if (req.session.isLoggedIn) {
        res.redirect('/home');
    } else {
        next();
    }
};

router.get('/', unauthenticated, (req, res) => {
    return res.render('index', {title: 'Coder-Dashboard'})
})
router.get('/home', authenticated, (req, res) => {
	return res.render('home', {title: 'Coder-Dashboard | Home'})
})
router.get('/signup', unauthenticated, (req, res)=>{
	res.render('signup', {title: 'Coder-Dashboard | Register'})
})
router.get('/login', unauthenticated, (req, res)=>{
	res.render('login', {title: 'Coder-Dashboard | Login'})
})
router.get('/profile/:userId', authenticated, (req, res)=>{
	let userId
	if(req.params.userId){
		userId = req.params.userId
	} else {
		userId = req.session.userId
	}
	res.render('profile', {title: 'Coder-Dashboard | Profile', userId: userId})
})
module.exports = router