// Libraries
const bcrypt = require('bcryptjs')

// Models
const Admin = require('../models/adminCompany')





// Functions

const add_new_admin = (req,res)=>{
    const {firstname,lastname,email,role,password,password2} = req.body;
    if(password !==password2)
    {
        req.flash('danger','Passwords do not match.');
        res.redirect('/company/settings')
    }
    else
    {
        Admin.findOne({username:email,company_id:req.user.company_id},(err,admin)=>{
            if(admin)
            {
              req.flash('danger','Administrator already exists.');
              res.redirect('/company/settings')
            }
            else
            {
                let data = new Admin();
                data.first_name = firstname;
                data.last_name = lastname
                data.username = email;
                data.company_id = req.user.company_id
                data.role = role
                data.password = password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        data.password = hash
                        data.save(() => {
                           req.flash('info','Administrator added successfully.')
                           res.redirect('/company/settings')
                        })
                    })
                });
    
            }
        })
    }
   
    
}
const get_admin_details = (req,res)=>{
  const id = req.params.id;
  Admin.findById(id,(err,admin)=>{
      res.send({success:true,admin:admin})
  })
}

const edit_admin_details = (req,res)=>{
            const {id,firstname,lastname,email,role} = req.body;
            let query = {
                _id:id
            }
            let data  = {}
            data.first_name = firstname;
            data.last_name  = lastname;
            data.username = email
            data.role = role;

            
            Admin.update(query,data,()=>{
                req.flash('info','Administrator updated successfully.');
                res.redirect('/company/settings')
            })


}

const edit_admin_password = (req,res)=>{
    const {id,password,password2} = req.body;
  
    if(password !==password2)
    {
        req.flash('danger','Passwords do not match.');
        res.redirect('/company/settings')
    }
    else
    {
        let query = {
            _id:id
        }
        let data  = {}
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                data.password = hash
                Admin.update(query,data,()=>{
                    req.flash('info','Administrator updated successfully.');
                    res.redirect('/company/settings')
                })
                
            })
        });
    }
    
    
}
const delete_admin = (req,res)=>{
    const id = req.params.id
    Admin.findByIdAndRemove(id,()=>{
        req.flash('danger','Administrator deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_admin:add_new_admin,
    get_admin_details:get_admin_details,
    edit_admin_details:edit_admin_details,
    edit_admin_password:edit_admin_password,
    delete_admin:delete_admin

}