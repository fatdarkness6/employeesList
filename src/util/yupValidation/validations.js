import * as yup from 'yup'

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const nameRegex =  /^[\p{L}\s]+$/u;


export function firstNameAndLastNameValidation(text) {
    return yup.string().matches(nameRegex , text).required('فیلد را پر کنید')
}

export function emailValidation() {
   return  yup.string().matches(emailRegex , 'لطفا ایمیل را درست وارد کنید').required('ایمیل الزامی است')
}