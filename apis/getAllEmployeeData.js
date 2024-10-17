async function getAllEmployeeData(props) {
   return await fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, {
      headers: {
         Authorization: '12345678910',
         'Content-Type': 'application/json'
       },
   })
}

export {getAllEmployeeData}