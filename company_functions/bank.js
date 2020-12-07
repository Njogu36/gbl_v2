// Libraries


// Models
const Bank = require('../models/bank')





// Functions

const add_new_bank = (req, res) => {
    const { title } = req.body;
    Bank.findOne({ title:title }, (err, bank) => {
        if (bank) {
            req.flash('danger', 'Bank already exists.');
            res.redirect('/administrator/settings')
        }
        else {
            let data = new Bank();
            data.title = title;
            
            data.save(() => {
                req.flash('info', 'Bank added successfully.');
                res.redirect('/administrator/settings')
            })

        }
    })

}

const get_bank_details = (req, res) => {
    const id = req.params.id;
    Bank.findById(id, (err, bank) => {
        res.send({ success: true, bank: bank })
    })
}

const edit_bank_details = (req, res) => {
    const { id, title } = req.body;
    let query = {
        _id: id
    }
    let data = {};

    data.title = title;
    
    Bank.update(query, data, () => {
        req.flash('info', 'Bank updated successfully.');
        res.redirect('/administrator/settings')
    })


}
const delete_bank = (req, res) => {
    const id = req.params.id
    Bank.findByIdAndRemove(id, () => {
        req.flash('danger', 'Bank deleted successfully.');
        res.redirect('/administrator/settings')
    })

}



module.exports = {
    add_new_bank: add_new_bank,
    get_bank_details: get_bank_details,
    edit_bank_details: edit_bank_details,
    delete_bank: delete_bank

}