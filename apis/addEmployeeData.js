async function addEmployeeData( data ) {
    return await fetch('https://pouya-salamat-employee-task.liara.run/employee', {
        method: 'POST',
        headers: {
          Authorization: '12345678910',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
}
export {addEmployeeData}