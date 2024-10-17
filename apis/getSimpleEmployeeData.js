async function getSimpleEmployeeData() {
   return await fetch('https://pouya-salamat-employee-task.liara.run/employee' , {
      headers: {
         Authorization: '12345678910',
         'Content-Type': 'application/json'
       },
   })
}

export {getSimpleEmployeeData}