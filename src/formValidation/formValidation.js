export function formValidation(yup) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const nameRegex = /^[\p{L}\s]+$/u;
    
    return yup.object({
        firstName: yup.string().matches(nameRegex , 'لطفا نامتان را درست وارد کنید').required('نام الزامی است'),
        lastName: yup.string().matches(nameRegex , 'لطفا نام خانوادگیتان را درست وارد کنید').required('نام خانوادگی الزامی است'),
        email: yup.string().matches(emailRegex , 'لطفا ایمیل را درست وارد کنید').required('ایمیل الزامی است'),
        dateOfBirth: yup.string().required('تاریخ تولد الزامی است'),
        family: yup.array().of(
          yup.object().shape({
            name: yup.string().matches(nameRegex , 'لطفا نام خانواده خود را درست وارد کنید').required('نام الزامی است'),
            relation: yup.string().required('رابطه الزامی است'),
            dateOfBirth: yup.string().required('تاریخ تولد الزامی است')
          })
        )
      })
}