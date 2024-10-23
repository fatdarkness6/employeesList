import axios from 'axios';
import { useNotification } from '@kyvg/vue3-notification';
const { notify } = useNotification();

let header = {
  'Content-Type': 'application/json'
}

function reloadPage() {
  setTimeout(() => {
    location.reload()
  }, 3000);
}

export const addEmployeeData = async (data) => {
  return await axios.post('https://pouya-salamat-employee-task.liara.run/employee', data, {
    headers: header
  }).then((response) => {
    if (response.status == 201) {
      notify({
        title: 'Success',
        text: 'Add employee successfull',
        type: 'success'
      })
      reloadPage()
    }
  })
  .catch(() => {
    notify({
      title: 'Error',
      text: 'Error deleting employee: ',
      type: 'error'
    })
  })
}

export const deleteEmployeeData = async (props) => {
  return await axios.delete(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, {
    headers: header
  })
  .then((response) => {
    if (response.status === 204) {
      notify({
        title: 'Success',
        text: 'Employee deleted successfully!',
        type: 'success',
      });
      reloadPage()
    }
  })
  .catch(() => {
    notify({
      title: 'Error',
      text: 'Error deleting employee: ',
      type: 'error',
    });
  })
}

export const editEmployeeData = async (props, data) => {
  return await axios.put(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, data, {
    headers: header,
  })
  .then((response) => {
    if (response.status === 200) {
      notify({
        title: 'Success',
        text: 'Employee data updated successfully!',
        type: 'success',
      });
      reloadPage()
    } else {
      notify({
        title: 'Error',
        text: 'Error updating employee: ',
        type: 'error',
      });
    }
  })
  .catch((error) => {
    notify({
      title: 'Error',
      text: 'Error updating employee: ' + (error.response?.data?.message || 'Unknown error'),
      type: 'error',
    });
  })
}

export const getAllEmployeeData = async (props) => {
  return await axios.get(`https://pouya-salamat-employee-task.liara.run/employee/${props}`, {
    headers: header
  })
}

export const getSimpleEmployeeData = async () => {
  return await axios.get('https://pouya-salamat-employee-task.liara.run/employee', {
    headers: header
  })
}