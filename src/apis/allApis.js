import axios from 'axios'

let header = {
  'Content-Type': 'application/json'
}

export const allApis = {
  addEmployeeData: async (data) => {
    console.log(data)
    return await axios.post('https://pouya-salamat-employee-task.liara.run/employee', data , {
      headers: header
    })
  },
  deleteEmployeeData: async (props) => {
    return await axios.delete(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, {
      headers: header
    })
  },
  editEmployeeData: async (props, data) => {
    return await axios.put(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, data , {
      headers: header,
    })
  },
  getAllEmployeeData: async (props) => {
    return await axios.get(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, {
      headers: header
    })
  },
  getSimpleEmployeeData: async () => {
    return await axios.get('https://pouya-salamat-employee-task.liara.run/employee', {
      headers: header
    })
  }
}
