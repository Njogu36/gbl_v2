const express = require('express');
const passport = require('passport')
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs')
var multer = require('multer');
const fs = require('fs')

const licenseKey = require('license-key-gen');

const router = express.Router();

const auth_user = (req, res, next) => {
    if (!req.user) {
        req.flash('info', 'You are logged out. Please log in.');
        res.redirect('/administrator/')
    }
    else {
        next()
    }
}
var storageLogo = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/logos');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var uploadLogo = multer({ storage: storageLogo })

var storageIcons = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/icons');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var uploadIcons = multer({ storage: storageIcons })


const date = require('../company_functions/date')

// Models
const Admin = require('../models/admin')
const Company = require('../models/company')
const AdminCompany = require('../models/adminCompany')
const License = require('../models/license')
const Currency = require('../models/currency')
const Bank = require('../models/bank')
const Employee = require('../models/employee')
const Pay = require('../models/pay')




// authentication
router.get('/', (req, res) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.PASSWORD
    Admin.findOne({ username: username }, (err, admin) => {
        if (admin) {
            res.render('./administrator/auth/login.jade')
        }
        else {

            let data = new Admin();
            data.first_name = 'Jon';
            data.last_name = 'Doe';
            data.username = username;
            data.role = 'super admin';
            data.password = password
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    data.password = hash
                    data.save(() => {
                        res.render('./administrator/auth/login.jade')
                    })
                })
            });

        }
    })
})


router.post('/login_post', passport.authenticate('Admin', {
    successRedirect: '/administrator/companies',
    failureRedirect: '/administrator/',
    failureFlash: true,
    session: true
}))

router.get('/log_out', auth_user, (req, res) => {
    req.logout();
    res.redirect('/administrator/')
})

//companies - dashboard
router.get('/companies', auth_user, (req, res) => {
    Currency.find({},(err,currencys)=>{
    Company.find({}, (err, companies) => {
        res.render('./administrator/dashboard/dashboard.jade', {
            user: req.user,
            companies: companies,
            currencys:currencys
        })
    })
})

})
router.post('/add_new_company', auth_user,uploadLogo.single('file'), (req, res) => {
    const { name, email, first_name, last_name,country,subscription,currency } = req.body;
    Company.findOne({name:name},(err,company)=>{
        if(company)
        {
           req.flash('danger','Company already exists.');
           res.redirect('/administrator/companies')
        }
        else
        {  
            var userInfo = {company:name,email:email, country:country, year:date.year}
            var licenseData = {info:userInfo, prodCode:"GBL_POC", appVersion:"1.0"}
            var license = licenseKey.createLicense(licenseData)
            const random = Math.floor(1000 + Math.random() * 9000)
            
            var someDate = new Date(date.today);
            someDate.setDate(someDate.getDate() + 365); //number  of days to add, e.x. 15 days
            var dateFormated = someDate.toISOString().substr(0,10);
            
            const path = '/logos/'+req.file.filename

            // add company
            let data = new Company();
            data.name = name;
            data.email=email;
            data.currency = currency
            data.license_id = '',
            data.country = country,
            data.icon = '/images/icon.png',
            data.logo = path,
            data.subscription = subscription,
            data.status = 'Paid',
            data.enabled = false
            data.employees = 0,
            data.created_on = new Date()
            data.save((err,result)=>{
                // licence
                let data = new License();
                data.company_name = name;
                data.company_id =result.id;
                data.license = license.license
                data.status = 'Active'
                data.subscription = subscription,
                data.start_date = date.today,
                data.expire_date = dateFormated,
                data.save((err,result2)=>{
                    let query = {
                        _id:result.id
                    }
                    let data = {};
                    data.license_id = result2.id;
                    Company.update(query,data,(err)=>{
                        // default user
                        let data =  new AdminCompany();
                        data.first_name = first_name;
                        data.last_name =last_name;
                        data.username = email;
                        data.company_id =  result.id
                        data.company_name = result.name
                        data.role = 'super admin';
                        data.password = 'gbl_'+random;
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash('gbl_' + random, salt, function (err, hash) {
                                data.password = hash
                                setTimeout(() => {
                                    var transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        host: 'smtp.gmail.com',
                                        auth: {
                                            user: process.env.EMAIL,
                                            pass: process.env.EMAIL_PASSWORD
                                        }
                                    });
        
                                    var mailOptions = {
                                        from: process.env.EMAIL,
                                        to: email,
                                        subject: 'WELCOME TO THE PAYROLL SYSTEM',
                                        text: 'Hi ' + first_name + ', here are the login credentials for your company portal.\nEmail: ' + email + '\nPassword: gbl_' + random+'\nLicense Key: '+license.license
                                    };
        
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });
                                    data.save(() => {
                                        req.flash('info', 'Company added successfully.');
                                        res.redirect('/administrator/companies')
                                    })
                                }, 2500)
        
                            })
                        });

                    })
    
                })
            })
          
           



            // add company_admin



            // send email
            
        }
    })

})

router.get('/renew_license/:id',auth_user,(req,res)=>{
    let id = req.params.id;
    License.findById(id,(err,license)=>{
        let company_id = license.company_id;
        Company.findById(company_id,(err,company)=>{
            var userInfo = {company:company.name,email:company.email, country:company.country, year:date.year}
            var licenseData = {info:userInfo, prodCode:"GBL_POC", appVersion:"1.0"}
            var license = licenseKey.createLicense(licenseData)

            var someDate = new Date(date.today);
            someDate.setDate(someDate.getDate() + 365); //number  of days to add, e.x. 15 days
            var dateFormated = someDate.toISOString().substr(0,10);
            
            let query = {
                _id:id
            }
            let data = {};
            data.status = 'Active'
            data.start_date = date.today;
            data.expire_date = dateFormated
            data.license = license.license;
            License.update(query,data,(err)=>{
                let query = {
                    _id:company_id
                }
                let data = {};
                data.status = 'Paid';
                data.enabled= false
                Company.update(query,data,(err)=>{
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.EMAIL_PASSWORD
                        }
                    });

                    var mailOptions = {
                        from: process.env.EMAIL,
                        to: company.email,
                        subject: 'YOUR LICENSE HAS BEEN RENEWED',
                        text: 'Hi, your license has been renewed\nLicense Key: '+license.license
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    req.flash('info','License renewed successfully.');
                    res.redirect('/administrator/licenses')
                })
            })

        })
    })

})

router.get('/delete_company/:id',auth_user,(req,res)=>{
    const id = req.params.id;
    Company.findById(id,(err,company)=>{
        const path = './uploads'+company.logo
        fs.unlink(path, (err) => {
            if (err) {
              console.error(err)
              return
            }
            else
            {
                Company.findByIdAndRemove(id,()=>{})
                AdminCompany.remove({company_id:id},(err)=>{})
                Employee.remove({company_id:id},(err)=>{})
                
                License.remove({company_id:id},(err)=>{})
                req.flash('danger','Company deleted successfully.');
                res.redirect('/administrator/companies')
            }
          
          })
    })
    
})




// licenses
router.get('/licenses', auth_user, (req, res) => {
    Company.find({}, (err, companies) => {
        License.find({},(err,licenses)=>{
            res.render('./administrator/licenses/licenses.jade', {
                user: req.user,
                companies: companies,
                licenses:licenses
            })
        })
       
    })

})

// settings
router.get('/settings', auth_user, (req, res) => {
    Bank.find({},(err,banks)=>{
        Currency.find({},(err,currencys)=>{
            Company.find({}, (err, companies) => {
                res.render('./administrator/settings/settings.jade', {
                    user: req.user,
                    companies: companies,
                    banks:banks,
                    currencys:currencys
                })
            })
        })
    })
})

// Banks
router.post('/add_new_bank',auth_user,(req,res)=>{
    const {title}= req.body;
    Bank.findOne({title:title},(err,bank)=>{
        if(bank)
        {
            req.flash('danger','Bank already exists.');
            res.redirect('/administrator/settings')
        }
        else{
               let data = new Bank();
               data.title = title;
               data.save(()=>{
                req.flash('info','Bank added successfully.');
                res.redirect('/administrator/settings')
               })
        }
    })

})
router.get('/get_bank_details/:id',auth_user,(req,res)=>{
  const id= req.params.id;
  Bank.findById(id,(err,bank)=>{
      res.send({success:true,bank:bank})
  })
})
router.get('/delete_bank/:id',auth_user,(req,res)=>{
    Bank.findByIdAndRemove(req.params.id,(err)=>{
        req.flash('danger','Bank deleted successfully.');
        res.redirect('/administrator/settings')
    })
})
router.post('/edit_bank_details',auth_user,(req,res)=>{
    const {id,title}=req.body
    let query = {
        _id:id
    }
    let data = {};
    data.title = title;
    Bank.update(query,data,(err)=>{
        req.flash('info','Bank updated successfully.');
        res.redirect('/administrator/settings')
    })
})

// Currencies
router.post('/add_new_currency',auth_user,(req,res)=>{
    const {code,country}= req.body;
    Currency.findOne({code:code},(err,currency)=>{
        if(currency)
        {
            req.flash('danger','Currency already exists.');
            res.redirect('/administrator/settings')
        }
        else{
               let data = new Currency();
               data.code = code;
               data.country = country
               data.save(()=>{
                req.flash('info','Currency added successfully.');
                res.redirect('/administrator/settings')
               })
        }
    })

})
router.get('/get_currency_details/:id',auth_user,(req,res)=>{
  const id= req.params.id;
  Currency.findById(id,(err,currency)=>{
      res.send({success:true,currency:currency})
  })
})
router.get('/delete_currency/:id',auth_user,(req,res)=>{
    Currency.findByIdAndRemove(req.params.id,(err)=>{
        req.flash('danger','Currency deleted successfully.');
        res.redirect('/administrator/settings')
    })
})
router.post('/edit_currency_details',auth_user,(req,res)=>{
    const {id,code,country}=req.body
    let query = {
        _id:id
    }
    let data = {};
    data.code = code;
    data.country = country
    Currency.update(query,data,(err)=>{
        req.flash('info','Currency updated successfully.');
        res.redirect('/administrator/settings')
    })
})






module.exports = router