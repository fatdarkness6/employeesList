async function deleteEmployeeData(props) {
    return await  fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, {
        method: 'DELETE',
        headers: {
          Authorization: '12345678910',
          'Content-Type': 'application/json'
        },
      })
}

export {deleteEmployeeData}