async function editEmployeeData(props , data){
    return await fetch(
        `https://pouya-salamat-employee-task.liara.run/employee/${props}`,
        {
          method: 'PUT',
          headers: {
            Authorization: '12345678910',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
}

export {editEmployeeData}