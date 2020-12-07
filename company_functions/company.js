// Libraries


// Models
const Company = require('../models/subsidiary')





// Functions

const add_new_company = (req,res)=>{
    const {name,email,phone_no, website, country} = req.body;
    Company.findOne({name:name,company_id:req.user.company_id},(err,company)=>{
        if(company)
        {
          req.flash('danger','Subsidiary already exists.');
          res.redirect('/company/settings')
        }
        else
        {
            let data = new Company();
            data.name = name;
            data.email = email;
            data.phone_no  = phone_no;
            data.company_id = req.user.company_id
           
            data.country = country;
            data.save(()=>{
                req.flash('info','Subsidiary added successfully.');
                res.redirect('/company/settings')
            })

        }
    })
    
}
const get_company_details = (req,res)=>{
  const id = req.params.id;
  Company.findById(id,(err,company)=>{
      res.send({success:true,company:company})
  })
}

const edit_company_details = (req,res)=>{
    const {id,name,email,phone_no, website, country} = req.body;
    let query = {
        _id:id
    }
    let data  = {};
    data.name = name;
            data.email = email;
            data.phone_no  = phone_no;
          
            data.country = country;
            Company.update(query,data,()=>{
                req.flash('info','Subsidiary updated successfully.');
                res.redirect('/company/settings')
            })


}
const delete_company = (req,res)=>{
    const id = req.params.id
    Company.findByIdAndRemove(id,()=>{
        req.flash('danger','Subsidiary deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_company:add_new_company,
    get_company_details:get_company_details,
    edit_company_details:edit_company_details,
    delete_company:delete_company

}