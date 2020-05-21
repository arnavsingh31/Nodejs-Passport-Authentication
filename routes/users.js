const express = require('express');
const router = express.Router();
const { userValidation, loginValidation } = require('../validation');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');




//register routes
router.get('/register', (req, res)=>{
    res.render('register', {
        name: '',
        email: '',
        password: '',
        password2: '',
        err: '',
        msg: ''    
    });
});

router.post('/register', async (req, res)=>{
    const { name, email, password, password2} = req.body;
    //user validation
    const { error } = userValidation(req.body);

    if(error){
        return res.render('register', {
            err: error.details,
            name,
            email,
            password,
            password2,
            msg:''
         })
    }

    //email check
    const emailExist = await User.findOne({'email' : email });
    if(emailExist){
        return res.render('register', {
            msg: 'Email already exist!',
            name,
            email,
            password,
            password2
        })
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
    });

    try {
        const saveUser = await user.save();
        req.flash('success_msg', 'You are now registered and can login.')
        res.redirect('/users/login');
            
            
    } catch (error) {
        res.status(500).send("Oops Something went wrong!!!");
    }
});

// login routes
router.get('/login', (req, res)=>{
    res.render('login', {
        
        msg: '',
        err: '',
    });
});
        

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res, next);
});


// logout route
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/users/login');
});

module.exports = router;

