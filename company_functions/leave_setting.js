// Libraries


// Models
const Leave = require('../models/leave')





// Functions

const add_new_leave = (req, res) => {
    const { title } = req.body;
    Leave.findOne({ title:title,company_id:req.user.company_id }, (err, leave) => {
        if (leave) {
            req.flash('danger', 'Leave already exists.');
            res.redirect('/company/settings')
        }
        else {
            let data = new Leave();
            data.title = title;
            data.company_id = req.user.company_id
           
            data.save(() => {
                req.flash('info', 'Leave added successfully.');
                res.redirect('/company/settings')
            })

        }
    })

}

const get_leave_details = (req, res) => {
    const id = req.params.id;
    Leave.findById(id, (err, leave) => {
        res.send({ success: true, leave: leave })
    })
}

const edit_leave_details = (req, res) => {
    const { id, title } = req.body;
    let query = {
        _id: id
    }
    let data = {};

    data.title = title;
   
    Leave.update(query, data, () => {
        req.flash('info', 'Leave updated successfully.');
        res.redirect('/company/settings')
    })


}
const delete_leave = (req, res) => {
    const id = req.params.id
    Leave.findByIdAndRemove(id, () => {
        req.flash('danger', 'Leave deleted successfully.');
        res.redirect('/company/settings')
    })

}



module.exports = {
    add_new_leave: add_new_leave,
    get_leave_details: get_leave_details,
    edit_leave_details: edit_leave_details,
    delete_leave: delete_leave

}