const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Models

const Admin = require('../models/admin.js');
const Company = require('../models/adminCompany')
const Employee = require('../models/employee.js')

module.exports = function (passport) {

    //local strategy
    passport.use('Admin',new LocalStrategy(function (username, password, done) {
        //match Username
        let query = {
            username: username
        };
        Admin.findOne(query, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return done(null, false, {
                    message: 'No User Found'
                });
            }
            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) 
                  throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            });
        });

    }));

    passport.use('Employee',new LocalStrategy(function (username, password, done) {
        //match Username
        let query = {
            username: username
        };
        Employee.findOne(query, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return done(null, false, {
                    message: 'No User Found'
                });
            }
            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) 
                    throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            });
        });
    }));
    passport.use('Company',new LocalStrategy(function (username, password, done) {
        //match Username
        let query = {
            username: username
        };
        Company.findOne(query, function (err, user) {
            if (err)
                throw err;
            if (!user) {
                return done(null, false, {
                    message: 'No User Found'
                });
            }
            //Match Password
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) 
                    throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Wrong Password'
                    });
                }
            });
        });
    }));

    function SessionConstructor(userId, userGroup, details) {
        this.userId = userId;
        this.userGroup = userGroup;
        this.details = details;
    }

    passport.serializeUser(function (userObject, done) {
        let userPrototype =  Object.getPrototypeOf(userObject);

        if (userPrototype === Admin.prototype) {
            userGroup = "model1";
        } else if (userPrototype === Employee.prototype) {
            userGroup = "model2";
        }
        else if (userPrototype === Company.prototype) {
            userGroup = "model3";
        }

        let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
        done(null,sessionConstructor);
    });

    passport.deserializeUser(function (sessionConstructor, done) {

        if (sessionConstructor.userGroup == 'model1') {
            Admin.findOne({
                _id: sessionConstructor.userId
            },'-Admin', function (err, user) {
                done(err, user);
            });
        } else if (sessionConstructor.userGroup == 'model2') {
            Employee.findOne({
                _id: sessionConstructor.userId
            },'-Employee', function (err, user) {
                done(err, user);
            });
        }
        else if (sessionConstructor.userGroup == 'model3') {
            Company.findOne({
                _id: sessionConstructor.userId
            },'-Company', function (err, user) {
                done(err, user);
            });
        }


    });
}
