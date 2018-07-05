const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.name = !isEmpty(data.name) ? data.name : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (!Validator.isEmail(data.name)) {
        errors.email = 'name is required';
    }
    if (!Validator.isEmail(data.password2)) {
        errors.email = 'Confirm password field is required';
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if (Validator.isLength(data.name, {min: 2, max: 30}) === false) {
        errors.name = 'Name must be between 2 and 30 characters'
    }
    if (Validator.islength(data.password, {min: 6, max: 30}) === false) {
        errors.password = 'Password must be between 6 and 30 characters'
    }
    if (Validator.equals(data.password, data.password2) === false) {
        errors.password2 = 'Passwords must match'
    }
    if (validateEmail(data.email) === false) {
        errors.email = 'Email is invalid'
    }
    return {errors, isValid: isEmpty(errors)};
};