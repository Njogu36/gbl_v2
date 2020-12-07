const mongoose = require('mongoose');
const employeeSchema = mongoose.Schema({
    company_id:String,
    first_name:String,
    last_name:String,
    resident_type:String,
    middle_name:String,
    username:String,
    id_number:String,
    kra_pin:String,
    status:String,
    gender:String,
    dob:String,
    nhif_no:String,
    nssf_no:String,
    pension:Boolean,

   
    employee_type:String,
    job_title:String,
    department:String,
    region:String,
    manager:Boolean,
    salary_details:{
        employee_type:String,
        payment_currency:String,
        monthly_salary:String,
        work_shift:String,
        off_days:[],
        daily_hours:Number,
        income_tax:String,
        tax_exemption_val:Boolean,
        tax_exemption:{
            disability_exemption_amount:Number,
            exemption_certificate_no:String,
            approval:Boolean
        },
        payment_type:String,
        relief_details:{

        },
        pension_details:{

        },
        bank_details:[],
        salary_history:[]
     },
    hr_details:{
        job_number:String,
        job_title:String,
        region:String,
        company:String,
        department:String,
        head_of_department:String,
        reports_to:String,
        date_of_employment:String,
        contract_start_date:String,
        contract_end_date:String,
        contract_duration:String
    },
    education:{
        university:String,
        level_of_education:String,
        gpa:Number,
        course:String
    },
    

    contact_details:{
        official_email:String,
        personal_email:String,
        
        mobile_phone_no:String,
        office_phone_no:String,
        country:String,
        address:String,
        city:String,
        county:String,
        zip_code:String,
        next_of_kin:[],
        social_media:{
            twitter:String,
            linkedin:String
        }
    },
    
    files:{
        cover_letter:String,
        resume_letter:String,
        certificate:String,
        passport_photo:String
    },
    password:String,
    pass:String


})
const Employee = mongoose.model('Employee',employeeSchema);
module.exports = Employee;