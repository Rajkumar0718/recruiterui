export const isEmpty = value => value === undefined || value === null || value === '' || value.length === 0;

export function isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function isValidMobileNo(number) {
    return /^([0|+[0-9]{1,5})?([0-9][0-9]{9})$/.test(number);
}