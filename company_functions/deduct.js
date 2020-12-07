// Libraries


// Models
const Deduct = require('../models/deduction')
const EmployeeDeduct = require('../models/employee_deduction')




// Functions

const add_new_deduct = (req, res) => {
    const { title, code, rate, type } = req.body;
    console.log(req.body)
    Deduct.findOne({ code: code, title: title, company_id: req.user.company_id }, (err, deduction) => {
        if (deduction) {
            req.flash('danger', 'Deduction item already exists.');
            res.redirect('/company/settings')
        }
        else if (!deduction) {

            let data = new Deduct();
            data.title = title;
            data.code = code;
            if (rate === 'True') {
                data.rate = true
            }
            else if (rate === 'False') {
                data.rate = false
            }


            data.company_id = req.user.company_id
            data.status = 'Active';
            data.type = type
            data.save(() => {
                req.flash('info', 'Deduction item added successfully.');
                res.redirect('/company/settings')
            })

        }
    })

}

const get_deduct_details = (req, res) => {
    const id = req.params.id;
    Deduct.findById(id, (err, deduct) => {
        res.send({ success: true, deduct: deduct })
    })
}

const edit_deduct_details = (req, res) => {
    const { id, title, code, status, rate, type } = req.body;
    let query = {
        _id: id
    }
    let data = {};

    data.title = title;
    data.code = code;
    if (rate === 'True') {
        data.rate = true
    }
    else if (rate === 'False') {
        data.rate = false
    }
    data.type = type
    data.status = status;
    Deduct.update(query, data, () => {
        if (type === 'After Tax') {
            EmployeeDeduct.find({type:title, company_id: req.user.company_id, tax: 'Before Tax' }, (err, deducts) => {
                deducts.map((item) => {
                    let query = {
                        _id:item.id
                    }
                    let data = {};
                    data.tax = 'After Tax'
                    EmployeeDeduct.update(query,data,(err)=>{

                    })

                })
            })
        }
        if (type === 'Before Tax') {
            EmployeeDeduct.find({ type:title,company_id: req.user.company_id, tax: 'After Tax' }, (err, deducts) => {
                deducts.map((item) => {
                    let query = {
                        _id:item.id 
                    }
                    let data = {};
                    data.tax = 'Before Tax'
                    EmployeeDeduct.update(query,data,(err)=>{
                        
                    })

                })

            })
        }

        req.flash('info', 'Deduction item updated successfully.');
        res.redirect('/company/settings')
    })


}
const delete_deduct = (req, res) => {
    const id = req.params.id
    Deduct.findByIdAndRemove(id, () => {
        req.flash('danger', 'Deduction item deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_deduct: add_new_deduct,
    get_deduct_details: get_deduct_details,
    edit_deduct_details: edit_deduct_details,
    delete_deduct: delete_deduct

}