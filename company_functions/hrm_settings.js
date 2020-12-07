// LIBRARIES



// IMPORTED FUNCTIONS
const date = require('../company_functions/date')

// MODELS
const Employee = require('../models/employee')
const Job = require('../models/job_title');
const Department = require('../models/department');
const Region = require('../models/region')
const Shift = require('../models/work_shift')

// job titles
const add_new_job_title = (req, res) => {
    const { title } = req.body;
    Job.findOne({ title: title,company_id:req.user.company_id }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'Job title already exists.');
            res.redirect('/company/settings');
        }
        else {
            let data = new Job();
            data.title = title;
            data.company_id = req.user.company_id
            data.created_by = req.user.first_name + ' ' + req.user.last_name;
            data.created_on = new Date();
            data.save(() => {
                req.flash('info', 'Job title added successfully.');
                res.redirect('/company/settings')
            })
        }
    })

}
const get_job_title = (req, res) => {
    const id = req.params.id;
    Job.findById(id, (err, job) => {
        res.send({ success: true, title: job.title })
    })
}
const edit_job_title = (req, res) => {
    const { id, title } = req.body;
    let query = {
        _id: id
    }
    let data = {};
    data.title = title;
    Job.update(query, data, (err) => {
        req.flash('info', 'Job title updated successfully.');
        res.redirect('/company/settings')
    })
}
const delete_job_title = (req, res) => {
    const id = req.params.id;
    Job.findByIdAndRemove(id, (err) => {
        req.flash('danger', 'Job title deleted successfully.');
        res.redirect('/company/settings')
    })

}


// department title
const add_new_department_title = (req, res) => {
    const { title } = req.body;
    Department.findOne({ title: title,company_id:req.user.company_id }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'Department title already exists.')
            res.redirect('/company/settings')
        }
        else {
            let data = new Department();
            data.title = title;
            data.company_id = req.user.company_id
            data.created_by = req.user.first_name + ' ' + req.user.last_name;
            data.created_on = new Date();
            data.save(() => {
                req.flash('info', 'Department title added successfully.')
                res.redirect('/company/settings')
            })
        }
    })

}
const get_department_title = (req, res) => {
    const id = req.params.id;
    Department.findById(id, (err, department) => {
        res.send({ success: true, title: department.title })
    })
}
const edit_department_title = (req, res) => {
    const { id } = req.body;
    const { title } = req.body
    let query = {
        _id: id
    }
    let data = {}
    data.title = title;
    Department.update(query, data, (err) => {
        req.flash('info', 'Department updated successfully.');
        res.redirect('/company/settings')
    })
}
const delete_department_title = (req, res) => {
    const id = req.params.id;
    Department.findByIdAndRemove(id, (err) => {
        req.flash('danger', 'Department deleted successfully.');
        res.redirect('/company/settings')
    })
}

// region title
const add_new_region_title = (req, res) => {
    const { title } = req.body;
    Region.findOne({ title: title,company_id:req.user.company_id }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'Region already exists.')
            res.redirect('/company/settings')
        }
        else {
            let data = new Region();
            data.title = title;
            data.company_id = req.user.company_id
            data.save(() => {
                req.flash('info', 'Region added successfully.');
                res.redirect('/company/settings')
            })
        }
    })

}
const get_region_title = (req, res) => {
    const id = req.params.id;
    Region.findById(id, (err, region) => {
        res.send({ success: true, title: region.title })
    })

}
const delete_region_title = (req, res) => {
    const id = req.params.id
    Region.findByIdAndRemove(id, (err) => {
        req.flash('danger', 'Region deleted successfully.');
        res.redirect('/company/settings')
    })

}
const edit_region_title = (req, res) => {
    const { id, title } = req.body;
    let query = {
        _id: id
    }
    let data = {};
    data.title = title;
    Region.update(query, data, () => {
        req.flash('info', 'Region updated successfully.');
        res.redirect('/company/settings')
    })

}

// WORK SHIFT
const add_new_work_shift = (req, res) => {
    const { title, start_time, end_time, break_hours, days } = req.body;
    const timeStart = new Date("01/01/2007 " + start_time).getHours();
    const timeEnd = new Date("01/01/2007 " + end_time).getHours();
    const hourDiff = timeEnd - timeStart;
    if(hourDiff<1)
    {
        req.flash('danger','End Time cannot be less than start time');
        res.redirect('/company/settings')
    }
    else
    {  
        Shift.findOne({ title: title,company_id:req.user.company_id }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'Work Shift already exists.');
            res.redirect('/company/settings')
        }
        else {
            let data = new Shift();
            data.title = title;
            data.start_time = start_time;
            data.end_time = end_time;
            data.company_id = req.user.company_id
            data.break_hours = break_hours;
            data.work_hours = hourDiff;
            if(Array.isArray(days))
            {
                data.days = days;
            }
            else
            {
                data.days = days;
            }
            
            data.save(()=>{
                req.flash('info','Work Shift added successfully.')
                res.redirect('/company/settings')
            })
        }
    })

    }
  
}

const get_shift_data = (req, res) => {
    const id = req.params.id;
    Shift.findById(id,(err,shift)=>{
        res.send({success:true,shift:shift})
    })

}

const edit_work_shift = (req, res) => {
    console.log(req.body.id)
    const { id, title, start_time, end_time, break_hours, days } = req.body;
    const timeStart = new Date("01/01/2007 " + start_time).getHours();
    const timeEnd = new Date("01/01/2007 " + end_time).getHours();
    const hourDiff = timeEnd - timeStart;
    if(hourDiff<1)
    {
        req.flash('danger','End Time cannot be less than start time');
        res.redirect('/company/settings')
    }
    else
    {
        let query = {
            _id:id
        }
        let data = {}
        data.title = title;
        data.start_time = start_time;
        data.end_time = end_time;
        data.break_hours = break_hours;
        data.work_hours = hourDiff;
        if(Array.isArray(days))
        {
                data.days = days;
        }
        else
        {
                data.days = days;
        }
        Shift.update(query,data,(err)=>{
            req.flash('info','Work shift updated successfully.')
            res.redirect('/company/settings')
        })
            
    }

}

const delete_shift_title = (req, res) => {
    const id = req.params.id;
    Shift.findByIdAndRemove(id,(err)=>{
        req.flash('danger','Work shift deleted successfully.');
        res.redirect('/company/settings')
    })
}

// MODULE EXPORTS
module.exports = {
    add_new_job_title: add_new_job_title,
    get_job_title: get_job_title,
    edit_job_title: edit_job_title,
    delete_job_title: delete_job_title,
    add_new_department_title: add_new_department_title,
    get_department_title: get_department_title,
    edit_department_title: edit_department_title,
    delete_department_title: delete_department_title,
    add_new_region_title: add_new_region_title,
    get_region_title: get_region_title,
    delete_region_title: delete_region_title,
    edit_region_title: edit_region_title,
    add_new_work_shift: add_new_work_shift,
    edit_work_shift: edit_work_shift,
    get_shift_data: get_shift_data,
    delete_shift_title: delete_shift_title

}