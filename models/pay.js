const mongoose = require('mongoose');
const paySchema = mongoose.Schema({
  no: String,
  company_id: String,
  employee_id: String,
  employee: String,
  emp: {},

  // Amount
  gross_amount: String,
  gross_amount2:Number,
  total_gross_amount: String,
  taxable_amount: String,
  PAYE: String,
  PAYE2:Number,
  employee_pension: String,
  employer_pension: String,
  employee_pension2: Number,
  employer_pension2: Number,
  pension: Boolean,
  before_deductions_total: String,
  after_deductions_total: String,
  
  pre_benefits:String,
  post_benefits:String,

  net_amount: String,
  tax_amount: String,
  net_amount2: Number,
  tax_amount2: Number,
  nita:Number,

  // Tax
  income_tax: String,
  tax_exemption: Boolean,
  tax_exemption_amount: String,
  tax_certificate_number: String,
  tax_exemption_amount2:Number,

  // Payment
  payment_currency: String,
  payment_method: String,
  payment_details: {},

  // Amount
  deduction_amount: String,
  loan_amount: String,
  benefit_amount: String,
  expense_amount: String,
  relief_amount: String,

  // Details
  deduction_details: [],
  loan_details: [],
  relief_details: [],
  benefit_details: [],
  expense_details: [],
  pension_details:[],

  //More Details
  insurance_relief_details: {},
  car_benefit_details: {},
  per_diem_details: {},
  meal_benefit_details: {},
  furniture_details: {},
  non_cash_allowances_details: {},
  mobile_benefit_details: {},
  housing_allowance_details: {},

  // Date

  date: String,
  month: String,
  month2: String,
  year: Number,
  created_on: Date,
  status: String
})
const Pay = mongoose.model('Pay', paySchema);
module.exports = Pay;