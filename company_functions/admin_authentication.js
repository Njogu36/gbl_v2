// LIBRARIES
const bcrypt = require('bcryptjs')
const passport = require('passport')

// IMPORTED FUNCTIONS
const date = require('./date')



// LOGIN PAGE
const login_page = (req, res) => {
    
    res.render('./company/auth/login.jade')
}


const login_post = passport.authenticate('Company', {
    successRedirect: '/company/employees',
    failureRedirect: '/company/',
    failureFlash: true,
    session: true
})

const log_out = (req,res)=>{
    req.logout();
    res.redirect('/company/')
}





// MODULE EXPORTS
module.exports = {
    login_page: login_page,
    login_post: login_post,
    log_out:log_out
}