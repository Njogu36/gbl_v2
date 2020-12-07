// Libraries


// Models
const Expense = require('../models/expense')





// Functions

const add_new_expense = (req, res) => {
    const { title } = req.body;
    Expense.findOne({ title:title,company_id:req.user.company_id }, (err, expense) => {
        if (expense) {
            req.flash('danger', 'Expense already exists.');
            res.redirect('/company/settings')
        }
        else {
            let data = new Expense();
            data.title = title;
            data.company_id = req.user.company_id
            data.save(() => {
                req.flash('info', 'Expense added successfully.');
                res.redirect('/company/settings')
            })

        }
    })

}

const get_expense_details = (req, res) => {
    const id = req.params.id;
    Expense.findById(id, (err, expense) => {
        res.send({ success: true, expense: expense })
    })
}

const edit_expense_details = (req, res) => {
    const { id, title } = req.body;
    let query = {
        _id: id
    }
    let data = {};

    data.title = title;
   
    Expense.update(query, data, () => {
        req.flash('info', 'Expense updated successfully.');
        res.redirect('/company/settings')
    })


}
const delete_expense = (req, res) => {
    const id = req.params.id
    Expense.findByIdAndRemove(id, () => {
        req.flash('danger', 'Expense deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_expense: add_new_expense,
    get_expense_details: get_expense_details,
    edit_expense_details: edit_expense_details,
    delete_expense: delete_expense

}