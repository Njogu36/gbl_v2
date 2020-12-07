// Libraries


// Models
const Benefit = require('../models/benefit')





// Functions

const add_new_benefit = (req, res) => {
    const { title, code } = req.body;
    Benefit.findOne({ code: code, company_id: req.user.company_id }, (err, benefit) => {
        if (benefit) {
            req.flash('danger', 'Benefit already exists.');
            res.redirect('/company/settings')
        }
        else {
            let data = new Benefit();
            data.title = title;
            data.code = code;
            data.company_id = req.user.company_id
            data.status = 'Active'
            data.save(() => {
                req.flash('info', 'Benefit added successfully.');
                res.redirect('/company/settings')
            })

        }
    })

}

const get_benefit_details = (req, res) => {
    const id = req.params.id;
    Benefit.findById(id, (err, benefit) => {
        res.send({ success: true, benefit: benefit })
    })
}

const edit_benefit_details = (req, res) => {
    const { id, title, code, status, amount } = req.body;
    let value = 0
    req.body.amount.map((item) => {
        if (parseInt(item) >= 0) {
            value = parseInt(item)
        }
    })

    setTimeout(() => {
        let query = {
            _id: id
        }
        let data = {};

        data.title = title;
        data.code = code;
        data.value = value
        data.status = status
        Benefit.update(query, data, () => {
            req.flash('info', 'Benefit updated successfully.');
            res.redirect('/company/settings')
        })
    }, 1000)



}
const delete_benefit = (req, res) => {
    const id = req.params.id
    Benefit.findByIdAndRemove(id, () => {
        req.flash('danger', 'Benefit deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_benefit: add_new_benefit,
    get_benefit_details: get_benefit_details,
    edit_benefit_details: edit_benefit_details,
    delete_benefit: delete_benefit

}