<script setup>
import { ref } from 'vue'
import formComponent from '@/components/formComponent/formComponent.vue'
import { addEmployeeData } from '../../../apis/addEmployeeData'
import { checkUserOnline } from '../../../checkUserIsOnlineOrOffLine/check'

let emit = defineEmits(['response'])

let addFamilyMemberData = ref([])
let employeeValue = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: ''
})

let userIsOnOrOffLine = ref(false)

//----------------------------------functions----------------------------//

async function submitForm() {
  let data = {
    firstName: employeeValue.value.firstName,
    lastName: employeeValue.value.lastName,
    email: employeeValue.value.email,
    dateOfBirth: new Date(employeeValue.value.dateOfBirth),
    family: addFamilyMemberData.value.map((item) => {
      return {
        name: item.name,
        relation: item.relation,
        dateOfBirth: new Date(item.dateOfBirth)
      }
    })
  }

  let input = document.querySelectorAll('.selectInput')
  input.forEach((item) => {
    if (item.value == '') {
      item.classList.add('error-input')
    } else {
      input.classList?.remove('error-input')
    }
  })
  const isAnyFieldEmpty = addFamilyMemberData.value.some((item) => {
    return item.name === '' || item.relation === '' || item.dateOfBirth === ''
  })
  if (
    employeeValue.value.firstName &&
    employeeValue.value.lastName &&
    employeeValue.value.email &&
    employeeValue.value.dateOfBirth &&
    !userIsOnOrOffLine.value &&
    !isAnyFieldEmpty
  ) {
    checkUserOnline(userIsOnOrOffLine)
    if (!userIsOnOrOffLine.value) {
      addEmployeeData(data).then((response) => {
        if (response.status == 201) {
          location.reload()
        }
      })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="form">
      <formComponent
        @response="(data) => (addFamilyMemberData = data)"
        @employeeValueFromChildComponent="(data) => (employeeValue = data)"
      />
      <div class="buttons">
        <button @click="submitForm" type="submit" class="submit-btn">افزودن</button>
        <button @click="emit('response', false)" type="reset" class="cancel-btn">انصراف</button>
      </div>
    </div>
  </div>
</template>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  direction: rtl;
}
.error-input {
  border-bottom: 2px solid red;
}
.container {
  width: 50%;
  margin: 20px auto;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
}

.section {
  margin-bottom: 20px;
}

h4 {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.family-member {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}

h5 {
  margin-bottom: 10px;
}

.delete-btn,
.add-member-btn,
.submit-btn,
.cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.add-member-btn {
  background-color: #4caf50;
  width: 100%;
}

.submit-btn {
  background-color: #4caf50;
}

.cancel-btn {
  background-color: #777;
}

.buttons {
  display: flex;
  justify-content: space-between;
}
</style>
