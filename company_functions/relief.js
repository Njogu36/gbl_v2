// Libraries


// Models
const Relief = require('../models/relief')





// Functions

const add_new_relief = (req,res)=>{
    const {item,amount,maximum} = req.body;
    
    Relief.findOne({item:item,company_id:req.user.company_id},(err,relief)=>{
        if(relief)
        {
          req.flash('danger','Relief already exists.');
          res.redirect('/company/settings')
        }
        else if(!relief)
        {
          
            let data = new Relief();
            data.item = item;
            data.amount = amount
            data.maximum_amount = maximum
            
            data.company_id = req.user.company_id
         
            data.save(()=>{
                req.flash('info','Relief added successfully.');
                res.redirect('/company/settings')
            })

        }
    })
    
}

const get_relief_details = (req,res)=>{
  const id = req.params.id;
  Relief.findById(id,(err,relief)=>{
      res.send({success:true,relief:relief})
  })
}

const edit_relief_details = (req,res)=>{
    const {id,item,amount,maximum} = req.body;
    let query = {
        _id:id
    }
    let data  = {};
  
    data.item = item;
    data.amount = amount
    data.maximum_amount = maximum
  
          Relief.update(query,data,()=>{
                req.flash('info','Relief updated successfully.');
                res.redirect('/company/settings')
            })


}
const delete_relief = (req,res)=>{
    const id = req.params.id
    Relief.findByIdAndRemove(id,()=>{
        req.flash('danger','Relief deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_relief:add_new_relief,
    get_relief_details:get_relief_details,
    edit_relief_details:edit_relief_details,
    delete_relief:delete_relief

}