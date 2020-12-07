// LIBRARIES
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const License = require('./models/license');
const Company = require('./models/company')
const Casual = require('./models/casual')
const Employee = require('./models/employee')
const MongoStore = require('connect-mongo')(session);
require('dotenv').config()

// EXPORTED INTERNAL FUNCTIONS
require('./config/passport')(passport);
// VARIABLES
const app = express();
const PORT = 7000;


// DATABASE CONNECTION
mongoose.connect(process.env.DATABASE);
const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Database has been connected.')
})

console.log(parseInt(2400 + 2500.05 + 3333.4 + (0.25 * (102300 - 57334))))
// STATIC FILES
app.use(express.static('public'));
app.use(express.static('uploads'));

// BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ encoded: true }));

// VIEWS - JADE
app.set('view engine', 'jade');
app.set('/views', './views');

// CONNECT FLASH
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// SESSION
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// ROUTES
const selfcare = require('./routes/selfcare');
const admin = require('./routes/admin');
const company = require('./routes/company')
const api = require('./routes/api.js')
app.use('/', selfcare);
app.use('/administrator/', admin);
app.use('/company/', company)
app.use('/api/', api)


// dates
const date = new Date();
const year = date.getFullYear();
const day = ('0' + date.getDate()).slice(-2);
const day3 = date.getDate();

const month = ('0' + (date.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;
const monthNo = date.getMonth()
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var substract_no_of_days = 6;

date.setTime(date.getTime() - substract_no_of_days * 24 * 60 * 60 * 1000);
var substracted_date = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + date.getDate()).slice(-2);


let start_date = substracted_date
let end_date = today


let end_month = new Date(end_date);
let start_month = new Date(substracted_date)



let month1 = end_month.getMonth() +1// 2
let month2 = start_month.getMonth() +1 //1


let day1 = end_month.getDate()
let day2 = start_month.getDate()

var dated = new Date();
var weekOfMonth = (0 | dated.getDate() / 7) + 1;

let arra_days = []

var getDates = function (startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
};

// Usage
var dates = getDates(new Date(substracted_date), new Date(today));
dates.forEach(function (date) {
    arra_days.push(date)
});


// Functions
setInterval(() => {
    License.findOne({ expire_date: today }, (err, license) => {
        if (license) {
            let query = {
                _id: license.id
            }
            let data = {};
            data.status = 'Inactive';
            License.update(query, data, (err) => {
                let query = {
                    _id: license.company_id
                }
                let data = {};
                data.status = 'Not Paid';
                data.enabled = false;
                Company.update(query, data, (err) => {
                    console.log('Updated')
                })
            })
        }
        else {
            console.log('Nothing to do.')
        }
    })


    // casual.
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(today);
    var dayName = days[d.getDay()];

    if (dayName === 'Sunday') {

        if (parseInt(month1) === parseInt(month2)) {
            
            Casual.find({ month: monthNames[monthNo], year: year }, (err, casuals) => {
            
                casuals.map((item) => {
                    let array = item.data_amount
                    let no = 0

                    array.map((item2, index) => {
                        if ((index) >= day2 && (index) < day1) {
                            if (item2[0].sum !== 0) {
                                no = no + 1
                            }
                        }
                    })
                   


                    setTimeout(() => {
                        if (no === 6) {
                            let query = {
                                _id: item.id
                            }
                            let data = {};
                            item.data_amount[day3] = [{
                                week: weekOfMonth,
                            sum: item.employee.salary_details.salary,
                            bonus: 0
                            }]
                            data.data_amount = item.data_amount;
                            Casual.update(query, data, (err) => {

                            })
                        }
                    }, 1000)
                })
            })
        }
        else {
            let new_array = []
            arra_days.map((item, index) => {
                let no = index + 1;
                if (no < 7) {
                    let dd = new Date(item)
                    let dy = dd.getDate();
                    new_array.push(dy)
                }
            })

            const cursor = Casual.find({ year: year }).cursor();
            cursor.on('data', (doc) => {


                let number_of_days = 0


                // MONTH 1
                Casual.findOne({ month: monthNames[monthNo], year: year, employee_id: doc.employee.id }, (err, casual) => {
                    if (casual) {
                        new_array.map((item) => {
                            if (item > 0 && item < 10) {
                                if (casual.data_amount[item].sum !== 0) {
                                    number_of_days = number_of_days + 1
                                }
                            }
                        })
                    }
                    else if (!casual) {
                        number_of_days = 0
                    }




                })

                // MONTH 2

                Casual.findOne({ month: monthNames[monthNo+1], year: year, employee_id: doc.employee.id }, (err, casual) => {
                    if (casual) {
                        new_array.map((item) => {
                            if (item > 20 && item <= 32) {
                                if (casual.data_amount[item].sum !== 0) {
                                    number_of_days = number_of_days + 1
                                }
                            }
                        })
                    }
                    else if (!casual) {
                        number_of_days = 0
                    }



                })

                setTimeout(() => {
                    if (number_of_days === 6) {
                        let query = {
                            _id: doc.id
                        }
                        let data = {};

                        doc.data_amount[day3] = [{
                            week: weekOfMonth,
                            sum: doc.employee.salary_details.salary,
                            bonus: 0
                        }]
                        data.data_amount = doc.data_amount;
                        Casual.update(query, data, (err) => {

                        })
                    }

                }, 2000)

            })





        }

    }

}, 3600)




// LISTEN TO PORT
app.listen(process.env.PORT || PORT, () => {
    console.log('Application is running on port ' + PORT)
})