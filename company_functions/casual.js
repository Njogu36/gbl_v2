const bcrypt = require('bcryptjs')
const Casual = require("../models/casual");
const Employee = require("../models/employee");
const Company = require("../models/company");
const Setting = require("../models/casual_setting");
const EmployeeRelief = require("../models/employee_relief");
const EmployeeDeduct = require("../models/employee_deduction");
const AppliedLeave = require("../models/applied_leave");
const AppliedExpense = require("../models/applied_expense");
const Deduction = require("../models/deduction");
const Rate = require("../models/rate");
const Department = require("../models/department");
const DepartmentUser = require('../models/department_user');
const DepartmentTitle = require("../models/department");
const Attendance = require('../models/attendance');

// Functions
const date = new Date();
const year = date.getFullYear();
const day = ("0" + date.getDate()).slice(-2);
const day2 = date.getDate();
const month = ("0" + (date.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;

const monthNo = date.getMonth() -1;
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const month2 = year + "-" + month;
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const casual_page = (req, res) => {
  let arr = [[]];
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  // July
  const no_days = daysInMonth(month, year) - 1;
  var i;
  for (i = 1; i <= no_days; i++) {
    arr.push(i);
  }

  Setting.findOne(
    { no: 1, company_id: req.user.company_id },
    (err, setting) => {
      if (setting) {
      } else {
        let data = new Setting();
        data.no = 1;
        data.company_id = req.user.company_id;
        data.mid_day = 15;
        data.end_day = 28;
        data.hours = 8
        data.save(() => { });
      }
    }
  );

  Employee.find({ company_id: req.user.company_id }, (err, employees) => {
    Casual.find({ company_id: req.user.company_id }, (err, casualPayments) => {
      Employee.find(
        { company_id: req.user.company_id, employee_type: "Casual Employee" },
        (err, casuals) => {
          Department.find(
            { company_id: req.user.company_id },
            (err, departments) => {
              Company.findById(req.user.company_id, (err, company) => {
                Setting.findOne(
                  { no: 1, company_id: req.user.company_id },
                  (err, setting) => {
                    AppliedLeave.find(
                      { company_id: req.user.company_id, status: "Pending" },
                      (err, leaves2) => {
                        AppliedExpense.find(
                          {
                            company_id: req.user.company_id,
                            status: "Pending",
                          },
                          (err, expenses2) => {
                            res.render("./company/employee/casuals.jade", {
                              user: req.user,
                              employees: employees,
                              casuals: casuals,
                              company: company,
                              setting: setting,
                              casualPayments: casualPayments,
                              month: monthNames[monthNo],
                              arr: arr,
                              expenses2: expenses2,
                              departments: departments,
                              week: false,
                              hour: false,
                              amount: true,
                              leaves2: leaves2,
                            });
                          }
                        );
                      }
                    );
                  }
                );
              });
            }
          );
        }
      );
    });
  });
};

const get_week = (req, res) => {
  function getWeeksInMonth(month, year) {
    var weeks = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate();

    var start = 1;
    var end = 7 - firstDate.getDay();
    while (start <= numDays) {
      weeks.push({ start: start, end: end });
      start = end + 1;
      end = end + 7;
      if (end > numDays) end = numDays;
    }
    return weeks;
  }

  const week_array = getWeeksInMonth(monthNo, year);
  let end = 0;
  let start = 0;

  week_array.map((item, index) => {
    if (index + 1 === parseInt(req.params.no)) {
      end = parseInt(item.end);
      start = parseInt(item.start);
    }
  });

  setTimeout(() => {
    let arr = [[]];

    var i;
    for (i = start; i <= end; i++) {
      arr.push(i);
    }
    console.log(arr);

    console.log(parseInt(req.params.no) + " no");

    Employee.find({ company_id: req.user.company_id }, (err, employees) => {
      Casual.find(
        { company_id: req.user.company_id },
        (err, casualPayments) => {
          Employee.find(
            {
              company_id: req.user.company_id,
              employee_type: "Casual Employee",
            },
            (err, casuals) => {
              Department.find(
                { company_id: req.user.company_id },
                (err, departments) => {
                  Company.findById(req.user.company_id, (err, company) => {
                    Setting.findOne(
                      { no: 1, company_id: req.user.company_id },
                      (err, setting) => {
                        AppliedExpense.find(
                          {
                            company_id: req.user.company_id,
                            status: "Pending",
                          },
                          (err, expenses2) => {
                            AppliedLeave.find(
                              {
                                company_id: req.user.company_id,
                                status: "Pending",
                              },
                              (err, leaves2) => {
                                res.render("./company/employee/casuals.jade", {
                                  user: req.user,
                                  employees: employees,
                                  casuals: casuals,
                                  company: company,
                                  setting: setting,
                                  casualPayments: casualPayments,
                                  expenses2: expenses2,
                                  leaves2: leaves2,
                                  month: monthNames[monthNo],
                                  arr: arr,
                                  departments: departments,
                                  week_no: req.params.no,
                                  start: start,
                                  end: end,
                                  week: true,
                                  hour: false,

                                  amount: false,
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  });
                }
              );
            }
          );
        }
      );
    });
  }, 1500);
};

const get_department = (req, res) => {
  const id = req.params.id;
  let arr = [[]];
  function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  // July
  const no_days = daysInMonth(month, year);
  var i;
  for (i = 1; i <= no_days; i++) {
    arr.push(i);
  }

  Setting.findOne(
    { no: 1, company_id: req.user.company_id },
    (err, setting) => {
      if (setting) {
      } else {
        let data = new Setting();
        data.no = 1;
        data.company_id = req.user.company_id;
        data.mid_day = 15;
        data.end_day = 28;
        data.save(() => { });
      }
    }
  );

  Employee.find({ company_id: req.user.company_id }, (err, employees) => {
    Department.findById(req.params.id, (err, department) => {
      Casual.find(
        {
          company_id: req.user.company_id,
          month: monthNames[monthNo],
          year: year,
        },
        (err, casualPayments) => {
          Employee.find(
            {
              company_id: req.user.company_id,
              employee_type: "Casual Employee",
            },
            (err, casuals) => {
              Department.find(
                { company_id: req.user.company_id },
                (err, departments) => {
                  Company.findById(req.user.company_id, (err, company) => {
                    Setting.findOne(
                      { no: 1, company_id: req.user.company_id },
                      (err, setting) => {
                        AppliedExpense.find(
                          {
                            company_id: req.user.company_id,
                            status: "Pending",
                          },
                          (err, expenses2) => {
                            AppliedLeave.find(
                              {
                                company_id: req.user.company_id,
                                status: "Pending",
                              },
                              (err, leaves2) => {
                                res.render("./company/employee/casuals.jade", {
                                  user: req.user,
                                  employees: employees,
                                  casuals: casuals,
                                  company: company,
                                  setting: setting,
                                  casualPayments: casualPayments,
                                  month: monthNames[monthNo],
                                  arr: arr,
                                  departments: departments,
                                  department: department,
                                  expenses2: expenses2,
                                  leaves2: leaves2,
                                  week: false,
                                  hour: true,
                                  amount: false,
                                });
                              }
                            );
                          }
                        );
                      }
                    );
                  });
                }
              ).sort({ _id: -1 });
            }
          );
        }
      );
    });
  });
};

const edit_settings = (req, res) => {
  Setting.findOne(
    { no: 1, company_id: req.user.company_id },
    (err, setting) => {
      let query = {
        _id: setting.id,
      };
      let data = {};
      data.mid_day = req.body.mid_month;
      data.end_day = req.body.end_month;
      data.hours = req.body.hours;
      Setting.update(query, data, (err) => {
        req.flash("info", "Setting updated successfully.");
        res.redirect("/company/casuals");
      });
    }
  );
};

const add_today_pay = (req, res) => {


  if (parseInt(req.body.bonus) > parseInt(0) ||  parseInt(req.body.back_pay)>parseInt(0)) {
    if (req.body.comment === '') {
      req.flash('danger', 'Please provide a comment for the bonus amount')
      res.redirect("/company/view_employee/" + req.params.id);
    }
    else if(req.body.comment!=='')
    {
      let dat = new Date(req.body.date2);
      console.log(req.body.date)
      let day2 = dat.getDate()
      console.log(day2)
  
      var dated = new Date();
      var weekOfMonth = (0 | (dated.getDate() / 7)) + 1;
      var check = 0;
  
      let array = [["-"]];
      let array2 = [["-"]];
      let i;
      function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
  
      const no_days = daysInMonth(month, year) - 1;
      for (i = 0; i <= no_days; i++) {
        if (i < no_days) {
          let arr = [
            {
              week: 0,
              sum: 0,
              bonus: 0,
            },
          ];
          let arr2 = [];
          array.push(arr);
          array2.push(arr2);
        }
      }
      let hours_array = [];
      Attendance.find({ employee_id: req.params.id, company_id: req.user.company_id, approved: false, date: today }, (err, attendances) => {
        attendances.map((item) => {
          let obj = {
            department: item.department,
            hours: parseInt(item.hours)
          }
          hours_array.push(obj);
  
        })
  
      })
  
  
      let max_hours = 0;
      Setting.findOne(
        { no: 1, company_id: req.user.company_id },
        (err, setting) => {
          max_hours = setting.hours;
          if (day2 <= setting.mid_day) {
            check = 1;
          }
          if (day2 > setting.mid_day) {
            check = 2;
          }
          console.log(day2);
        }
      );
      setTimeout(() => {
        console.log(hours_array);
        let total_hours = [];
  
        hours_array.map((item) => {
          total_hours.push(parseInt(item.hours));
        });
        let sum = total_hours.reduce((a, b) => a + b, 0);
  
        if (parseInt(sum) > parseInt(max_hours)) {
          req.flash(
            "danger",
            "Number of hours can exceed the maximum " + max_hours + " hours."
          );
          res.redirect("/company/view_employee/" + req.params.id);
        } else if (parseInt(sum) === 0) {
          req.flash("danger", "Number of hours cannot be less than one");
          res.redirect("/company/view_employee/" + req.params.id);
        } else if (parseInt(sum) <= parseInt(max_hours)) {
          let personal_relief = 0;
          EmployeeRelief.find(
            {
              employee_id: req.params.id,
              status: "Active",
              company_id: req.user.company_id,
            },
            (err, reliefs) => {
              const filter = reliefs.filter((item) => {
                return item.title === "Personal Relief";
              });
              if (filter.length > 0) {
                personal_relief = filter[0].amount;
              }
            }
          );
  
          Employee.findById(req.params.id, (err, employee) => {
            Casual.findOne(
              {
                month: monthNames[monthNo],
                year: year,
                employee_id: employee.id,
                company_id: req.user.company_id,
              },
              (err, casual) => {
                if (casual) {
                  if (casual.data_amount[day2][0].sum !== 0) {
                    req.flash("danger", "You have already added a payment today");
                    res.redirect("/company/view_employee/" + req.params.id);
                  }
                  if (casual.data_amount[day2][0].sum === 0) {
                    let sum = parseInt(req.body.salary);
  
                    let array = [
                      {
                        week: weekOfMonth,
                        sum: sum,
                        bonus: parseInt(req.body.bonus),
                      },
                    ];
  
                    array2[day2] = hours_array;
                    casual.data_amount[day2] = array;
                    casual.data_hours[day2] = hours_array;
  
                    let query = {
                      _id: casual.id,
                    };
                    let data = {};
                    data.data_amount = casual.data_amount;
                    data.data_hours = casual.data_hours;
                    if (req.body.comment !== '') {
  
                      data.comments = casual.comments.concat([{
                        comment: req.body.comment,
                        added_on: today,
                        bonus: req.body.bonus,
                        back_pay: req.body.back_pay
                      }])
                    }
  
                    data.ban = {
                      data: casual.data_amount,
                    };
  
                    if (check === 1) {
                      const total_bonus =
                        parseInt(casual.bonus_1st) + parseInt(req.body.bonus);
                      const back_pay =
                        parseInt(casual.back_pay_1st) + parseInt(req.body.back_pay);
  
                      data.bonus_1st = total_bonus;
                      data.back_pay_1st = back_pay;
                    } else if (check === 2) {
                      const total_bonus =
                        parseInt(casual.bonus_2nd) + parseInt(req.body.bonus);
                      const back_pay =
                        parseInt(casual.back_pay_2nd) + parseInt(req.body.back_pay);
  
                      data.bonus_2nd = total_bonus;
                      data.back_pay_2nd = back_pay;
                    }
  
                    Casual.update(query, data, (err) => {
                      req.flash("info", "Payment saved successfully.");
                      res.redirect("/company/view_employee/" + req.params.id);
                    });
                  }
                } else {
                  // RELIEF
                  console.log(hours_array);
                  console.log(array2);
                  let sum = parseInt(req.body.salary);
                  array[day2] = [
                    {
                      week: weekOfMonth,
                      sum: sum,
                      bonus: parseInt(req.body.bonus),
                    },
                  ];
                  array2[day2] = hours_array;
                  let data = new Casual();
                  (data.company_id = req.user.company_id),
                    (data.employee_id = employee.id),
                    (data.employee = employee),
                    (data.amount = req.body.salary),
                    (data.department = employee.department),
                    (data.day = day2),
                    (data.month = monthNames[monthNo]),
                    (data.year = year),
                    (data.personal_relief = personal_relief), // gross amount
                    (data.gross_amount_1st = 0),
                    (data.gross_amount_2nd = 0),
                    (data.total_month_gross = 0);
  
                  if (check === 1) {
                    const total_bonus = parseInt(req.body.bonus);
                    const back_pay = parseInt(req.body.back_pay);
  
                    data.bonus_1st = total_bonus;
                    data.back_pay_1st = back_pay;
                    data.bonus_2nd = 0;
                    data.back_pay_2nd = 0;
                  } else if (check === 2) {
                    const total_bonus = parseInt(req.body.bonus);
                    const back_pay = parseInt(req.body.back_pay);
                    data.bonus_1st = 0;
                    data.back_pay_1st = 0;
                    data.bonus_2nd = total_bonus;
                    data.back_pay_2nd = back_pay;
                  }
  
                  // nhif,nssf,nita
                  (data.nhif_1st = 0),
                    (data.nhif_2nd = 0),
                    (data.nssf_1st = 0),
                    (data.nssf_2nd = 0),
                    (data.nita = 0),
                    (data.nita2 = 0),
                    // Tax
                    (data.tax_payable = 0),
                    (data.tax_deducted = 0),
                    // net_amount
                    (data.net_amount_1st = 0),
                    (data.net_amount_2nd = 0),
                    (data.second_half = false),
                    (data.first_half = false),
                    (data.data_amount = array),
                    (data.data_hours = array2),
                    (data.ban = {
                      data: array,
                    }),
                    (data.created_on = new Date()),
                    (data.date = req.body.date);
                  if (req.body.comment !== '') {
                    data.comments = [{
                      comment: req.body.comment,
                      added_on: today,
                      bonus: req.body.bonus,
                      back_pay: req.body.back_pay
                    }]
                  }
  
                  data.save((err, result) => {
                    console.log(result.data_hours);
                    req.flash("info", "Payment saved successfully.");
                    res.redirect("/company/view_employee/" + req.params.id);
                  });
                }
              }
            );
          });
        }
      }, 1500);
    }


  
  }

  else {
    let dat = new Date(req.body.date2);
    console.log(req.body.date)
    let day2 = dat.getDate()
    console.log(day2)

    var dated = new Date();
    var weekOfMonth = (0 | (dated.getDate() / 7)) + 1;
    var check = 0;

    let array = [["-"]];
    let array2 = [["-"]];
    let i;
    function daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    }

    const no_days = daysInMonth(month, year) -1;
    for (i = 0; i <= no_days; i++) {
      if (i < no_days) {
        let arr = [
          {
            week: 0,
            sum: 0,
            bonus: 0,
          },
        ];
        let arr2 = [];
        array.push(arr);
        array2.push(arr2);
      }
    }
    let hours_array = [];
    Attendance.find({ employee_id: req.params.id, company_id: req.user.company_id, approved: false, date: today }, (err, attendances) => {
      attendances.map((item) => {
        let obj = {
          department: item.department,
          hours: parseInt(item.hours)
        }
        hours_array.push(obj);

      })

    })


    let max_hours = 0;
    Setting.findOne(
      { no: 1, company_id: req.user.company_id },
      (err, setting) => {
        max_hours = setting.hours;
        if (day2 <= setting.mid_day) {
          check = 1;
        }
        if (day2 > setting.mid_day) {
          check = 2;
        }
        console.log(day2);
      }
    );
    setTimeout(() => {
      console.log(hours_array);
      let total_hours = [];

      hours_array.map((item) => {
        total_hours.push(parseInt(item.hours));
      });
      let sum = total_hours.reduce((a, b) => a + b, 0);

      if (parseInt(sum) > parseInt(max_hours)) {
        req.flash(
          "danger",
          "Number of hours can exceed the maximum " + max_hours + " hours."
        );
        res.redirect("/company/view_employee/" + req.params.id);
      } else if (parseInt(sum) === 0) {
        req.flash("danger", "Number of hours cannot be less than one");
        res.redirect("/company/view_employee/" + req.params.id);
      } else if (parseInt(sum) <= parseInt(max_hours)) {
        let personal_relief = 0;
        EmployeeRelief.find(
          {
            employee_id: req.params.id,
            status: "Active",
            company_id: req.user.company_id,
          },
          (err, reliefs) => {
            const filter = reliefs.filter((item) => {
              return item.title === "Personal Relief";
            });
            if (filter.length > 0) {
              personal_relief = filter[0].amount;
            }
          }
        );

        Employee.findById(req.params.id, (err, employee) => {
          Casual.findOne(
            {
              month: monthNames[monthNo],
              year: year,
              employee_id: employee.id,
              company_id: req.user.company_id,
            },
            (err, casual) => {
              if (casual) {
                if (casual.data_amount[day2][0].sum !== 0) {
                  req.flash("danger", "You have already added a payment today");
                  res.redirect("/company/view_employee/" + req.params.id);
                }
                if (casual.data_amount[day2][0].sum === 0) {
                  let sum = parseInt(req.body.salary);

                  let array = [
                    {
                      week: weekOfMonth,
                      sum: sum,
                      bonus: parseInt(req.body.bonus),
                    },
                  ];

                  array2[day2] = hours_array;
                  casual.data_amount[day2] = array;
                  casual.data_hours[day2] = hours_array;

                  let query = {
                    _id: casual.id,
                  };
                  let data = {};
                  data.data_amount = casual.data_amount;
                  data.data_hours = casual.data_hours;
                  if (req.body.comment !== '') {

                    data.comments = casual.comments.concat([{
                      comment: req.body.comment,
                      added_on: today,
                      bonus: req.body.bonus,
                      back_pay: req.body.back_pay
                    }])
                  }

                  data.ban = {
                    data: casual.data_amount,
                  };

                  if (check === 1) {
                    const total_bonus =
                      parseInt(casual.bonus_1st) + parseInt(req.body.bonus);
                    const back_pay =
                      parseInt(casual.back_pay_1st) + parseInt(req.body.back_pay);

                    data.bonus_1st = total_bonus;
                    data.back_pay_1st = back_pay;
                  } else if (check === 2) {
                    const total_bonus =
                      parseInt(casual.bonus_2nd) + parseInt(req.body.bonus);
                    const back_pay =
                      parseInt(casual.back_pay_2nd) + parseInt(req.body.back_pay);

                    data.bonus_2nd = total_bonus;
                    data.back_pay_2nd = back_pay;
                  }

                  Casual.update(query, data, (err) => {
                    req.flash("info", "Payment saved successfully.");
                    res.redirect("/company/view_employee/" + req.params.id);
                  });
                }
              } else {
                // RELIEF
                console.log(hours_array);
                console.log(array2);
                let sum = parseInt(req.body.salary);
                array[day2] = [
                  {
                    week: weekOfMonth,
                    sum: sum,
                    bonus: parseInt(req.body.bonus),
                  },
                ];
                array2[day2] = hours_array;
                let data = new Casual();
                (data.company_id = req.user.company_id),
                  (data.employee_id = employee.id),
                  (data.employee = employee),
                  (data.amount = req.body.salary),
                  (data.department = employee.department),
                  (data.day = day2),
                  (data.month = monthNames[monthNo]),
                  (data.year = year),
                  (data.personal_relief = personal_relief), // gross amount
                  (data.gross_amount_1st = 0),
                  (data.gross_amount_2nd = 0),
                  (data.total_month_gross = 0);

                if (check === 1) {
                  const total_bonus = parseInt(req.body.bonus);
                  const back_pay = parseInt(req.body.back_pay);

                  data.bonus_1st = total_bonus;
                  data.back_pay_1st = back_pay;
                  data.bonus_2nd = 0;
                  data.back_pay_2nd = 0;
                } else if (check === 2) {
                  const total_bonus = parseInt(req.body.bonus);
                  const back_pay = parseInt(req.body.back_pay);
                  data.bonus_1st = 0;
                  data.back_pay_1st = 0;
                  data.bonus_2nd = total_bonus;
                  data.back_pay_2nd = back_pay;
                }

                // nhif,nssf,nita
                (data.nhif_1st = 0),
                  (data.nhif_2nd = 0),
                  (data.nssf_1st = 0),
                  (data.nssf_2nd = 0),
                  (data.nita = 0),
                  (data.nita2 = 0),
                  // Tax
                  (data.tax_payable = 0),
                  (data.tax_deducted = 0),
                  // net_amount
                  (data.net_amount_1st = 0),
                  (data.net_amount_2nd = 0),
                  (data.second_half = false),
                  (data.first_half = false),
                  (data.data_amount = array),
                  (data.data_hours = array2),
                  (data.ban = {
                    data: array,
                  }),
                  (data.created_on = new Date()),
                  (data.date = req.body.date);
                if (req.body.comment !== '') {
                  data.comments = [{
                    comment: req.body.comment,
                    added_on: today,
                    bonus: req.body.bonus,
                    back_pay: req.body.back_pay
                  }]
                }

                data.save((err, result) => {
                  console.log(result.data_hours);
                  req.flash("info", "Payment saved successfully.");
                  res.redirect("/company/view_employee/" + req.params.id);
                });
              }
            }
          );
        });
      }
    }, 1500);
  }
};

const mid_month = (req, res) => {
  Setting.findOne(
    { no: 1, company_id: req.user.company_id },
    (err, setting) => {
      const mid_day = setting.mid_day;
      Casual.find(
        {
          company_id: req.user.company_id,
          month: monthNames[monthNo],
          year: year,
        },
        (err, casuals) => {
          casuals.map((item) => {
            var gross_amount_1st = 0;
            var tax_payable = 0;
            var total_month = 0;
            var nhif = 0;
            var nssf = 0;
            var nita = 0;
            var net_amount_1st = 0;
            var id = "";

            // Data Amount
            let arr = [];
            item.data_amount.map((item2, index) => {
              if (index > 0) {
                if (index < mid_day) {
                  if (item2.length > 0) {
                    arr.push(item2[0].sum);
                  }
                }
              }
            });

            const sum = arr.reduce((a, b) => a + b, 0);

            gross_amount_1st =
              sum + parseInt(item.bonus_1st) + parseInt(item.back_pay_1st);

            if (gross_amount_1st === 0) {
              nssf = 0;
              nita = 0;
              nhif = 0;
            } else {
              // NSSF
              EmployeeDeduct.find(
                {
                  employee_id: item.id,
                  status: "Active",
                  company_id: req.user.company_id,
                },
                (err, deducts) => {
                  const filter = deducts.filter((item) => {
                    return item.title === "NSSF";
                  });

                  if (filter.length > 0) {
                    nssf = filter[0].amount;
                  } else {
                    nssf = 200;
                  }
                }
              );
              nita = 50;
              Deduction.findOne(
                {
                  code: "A100",
                  title: "NHIF",
                  company_id: req.user.company_id,
                },
                (err, deduction) => {
                  if (deduction) {
                    Rate.find({ deduct_id: deduction.id }, (err, rates) => {
                      if (rates.length > 0) {
                        rates.map((item3) => {
                          if (
                            parseInt(gross_amount_1st) >=
                            parseInt(item3.minimum_amount) &&
                            parseInt(gross_amount_1st) <
                            parseInt(item3.maximum_amount)
                          ) {
                            nhif = item3.amount;
                          }
                        });
                      } else if (rates.length < 1) {
                        nhif = 0;
                      }
                    });
                  } else {
                    nhif = 0;
                  }
                }
              );
            }

            setTimeout(() => {
              net_pay = parseInt(gross_amount_1st) - (nhif + nssf);

              let query = {
                _id: item._id,
              };

              let data = {
                gross_amount_1st: gross_amount_1st,

                nhif_1st: nhif,
                nssf_1st: nssf,
                nita: nita,
                net_amount_1st: net_pay,

                first_half: true,
              };
              Casual.update(query, data, (err) => { });
            }, 2000);
          });
          setTimeout(() => {
            res.redirect("/company/casuals");
          }, 6000);
        }
      );
    }
  );
};

const end_month = (req, res) => {
  Setting.findOne(
    { no: 1, company_id: req.user.company_id },
    (err, setting) => {
      const mid_day = setting.mid_day;
      Casual.find(
        {
          company_id: req.user.company_id,
          month: monthNames[monthNo],
          year: year,
        },
        (err, casuals) => {
          casuals.map((item) => {
            var gross_amount_1st = 0;
            var gross_amount_2nd = 0;
            var tax_payable = 0;
            var total_month = 0;
            var nhif = 0;
            var nssf = 0;
            var nita = 0;
            var net_amount_1st = 0;
            var net_amount_2nd = 0;
            var id = "";

            // Data Amount
            let arr = [];
            item.data_amount.map((item2, index) => {
              if (index > mid_day) {
                if (item2.length > 0) {
                  arr.push(item2[0].sum);
                }
              }
            });
            console.log(arr);

            const sum = arr.reduce((a, b) => a + b, 0);
            console.log(sum);
            gross_amount_2nd =
              sum + parseInt(item.back_pay_2nd) + parseInt(item.bonus_2nd);
            gross_amount_1st = parseInt(item.gross_amount_1st);

            if (item.first_half === false) {
              nita = 50;
              // NSSF
              EmployeeDeduct.findOne(
                {
                  employee_id: item.employee_id,
                  status: "Active",
                  company_id: req.user.company_id,
                  title: "NSSF",
                },
                (err, deduct) => {
                  if (deduct) {
                    nssf = deduct.amount;
                  } else {
                    nssf = 200;
                  }
                }
              );
            } else if (item.first_half === true) {
              if (item.nita > 0) {
                nita = 0;
              } else if (item.nita < 1) {
                nita = 50;
              }
              if (item.nssf_1st > 0) {
                nssf = 0;
              } else if (item.nssf_1st < 1) {
                EmployeeDeduct.findOne(
                  {
                    employee_id: item.employee_id,
                    status: "Active",
                    company_id: req.user.company_id,
                    title: "NSSF",
                  },
                  (err, deduct) => {
                    if (deduct) {
                      nssf = deduct.amount;
                    } else {
                      nssf = 200;
                    }
                  }
                );
              }
            }

            setTimeout(() => {
              // NHIF
              Deduction.findOne(
                {
                  code: "A100",
                  title: "NHIF",
                  company_id: req.user.company_id,
                },
                (err, deduction) => {
                  if (deduction) {
                    Rate.find({ deduct_id: deduction.id }, (err, rates) => {
                      if (rates.length > 0) {
                        rates.map((item3) => {
                          if (
                            parseInt(gross_amount_2nd) >=
                            parseInt(item3.minimum_amount) &&
                            parseInt(gross_amount_2nd) <
                            parseInt(item3.maximum_amount)
                          ) {
                            nhif = item3.amount;
                          }
                        });
                      } else if (rates.length < 1) {
                        nhif = 0;
                      }
                    });
                  } else {
                    nhif = 0;
                  }
                }
              );

              total_month =
                parseInt(gross_amount_2nd) + parseInt(gross_amount_1st);

              let x = total_month;
              let income_tax = 0;
              if (x <= 24000) {
                income_tax = x * 0.1;
              }
              if (x > 24000 && x <= 40667) {
                income_tax = 2400 + 0.15 * (x - 24000);
              }
              if (x > 40667 && x <= 57334) {
                income_tax = 2400 + 2500.05 + 0.2 * (x - 40667);
              }
              if (x > 57334) {
                income_tax = 2400 + 2500.05 + 3333.4 + 0.25 * (x - 57334);
              }
              tax_payable = income_tax;

              if (item.first_half === false) {
                net_amount_2nd = gross_amount_2nd - (nhif + 200);
              } else if (item.first_half === true) {
                net_amount_2nd = gross_amount_2nd - nhif;
              }
            }, 1000);

            setTimeout(() => {
              console.log(net_amount_2nd);

              let query = {
                _id: item._id,
              };

              let data = {
                gross_amount_2nd: gross_amount_2nd,
                total_month_gross: total_month,
                nhif_2nd: nhif,
                nssf_2nd: nssf,
                nita2: nita,
                // Tax
                tax_payable: tax_payable,
                tax_deducted: 0,

                // net_amount
                net_amount_2nd: net_amount_2nd,

                second_half: true,
              };
              Casual.update(query, data, (err) => { });
            }, 2000);
          });
          setTimeout(() => {
            res.redirect("/company/casuals");
          }, 6000);
        }
      );
    }
  );
};

const casual_departments = (req, res) => {
  const { department, email, password } = req.body;

  Department.findOne(
    { company_id: req.user.company_id, title: department },
    (err, depart) => {
      if (depart) {
        let query = {
          _id: depart.id,
        };
        let data = {};
        data.casual = true;
        Department.update(query, data, (err) => {
          let data = new DepartmentUser();
          data.email = email
          data.password = password
          data.company_id = req.user.company_id
          data.department_id = depart.id
          data.department = department;
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
              data.password = hash
              data.save(() => {
                req.flash("info", "Updated successfully.");
                res.redirect("/company/casuals");
              })
            })
          });


        });
      }
    }
  );
};

const casual_erase = (req, res) => {
  let query = {
    _id: req.params.id,
  };
  let data = {};
  data.casual = false;
  Department.update(query, data, (err) => {
    DepartmentUser.remove({ department_id: req.params.id }, (err) => {
      req.flash("info", "Updated successfully.");
      res.redirect("/company/casuals");
    })

  });
};

const get_comments = (req, res) => {
  let id = req.params.id;
  Casual.findById(id, (err, casual) => {
    res.send({ success: true, comments: casual.comments, casual: casual })
  })

}

module.exports = {
  get_comments: get_comments,
  casual_erase: casual_erase,
  casual_departments: casual_departments,
  get_week: get_week,
  casual_page: casual_page,
  edit_settings: edit_settings,
  add_today_pay: add_today_pay,
  end_month: end_month,
  mid_month: mid_month,
  get_department: get_department,
};
