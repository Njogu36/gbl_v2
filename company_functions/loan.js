// Libraries


// Models
const Loan = require('../models/loan')





// Functions

const add_new_loan = (req, res) => {
    const { title, code } = req.body;
    Loan.findOne({ code: code }, (err, loan) => {
        if (loan) {
            req.flash('danger', 'Loan already exists.');
            res.redirect('/company/settings')
        }
        else {
            let data = new Loan();
            data.title = title;
            data.code = code;
            data.company_id = req.user.company_id

            data.save(() => {
                req.flash('info', 'Loan added successfully.');
                res.redirect('/company/settings')
            })

        }
    })

}

const get_loan_details = (req, res) => {
    const id = req.params.id;
    Loan.findById(id, (err, loan) => {
        res.send({ success: true, loan: loan })
    })
}

const edit_loan_details = (req, res) => {
    const { id, title, code } = req.body;
    let query = {
        _id: id
    }
    let data = {};

    data.title = title;
    data.code = code;

    Loan.update(query, data, () => {
        req.flash('info', 'Loan updated successfully.');
        res.redirect('/company/settings')
    })
}

const delete_loan = (req, res) => {
    const id = req.params.id
    Loan.findByIdAndRemove(id, () => {
        req.flash('danger', 'Loan deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_loan: add_new_loan,
    get_loan_details: get_loan_details,
    edit_loan_details: edit_loan_details,
    delete_loan: delete_loan

}