<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

let addFamilyMemberData = ref([])
let addFamilyId = ref(0)


let employeeValue = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: ''
})

let router = useRouter()

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
    if(item.value == '') {
      item.classList.add('error-input')
    }else {
      input.classList?.remove('error-input'); 
    }
  })

  

  if(employeeValue.value.firstName && employeeValue.value.lastName && employeeValue.value.email && employeeValue.value.dateOfBirth) {
    fetch('https://pouya-salamat-employee-task.liara.run/employee', {
       method: 'POST',
       headers: {
         Authorization: '12345678910',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
     })
       .then((response) =>  {
          if(response.status == 201) {
           router.push(`/`)
          } 
       })    
  }
}
function addFamilyMember() {
  ++addFamilyId.value
  let addFamilyObject = {
    id: addFamilyId.value,
    name: '',
    relation: '',   
    dateOfBirth: ''
  }
  addFamilyMemberData.value.push(addFamilyObject)
}

function deleteFamilyMember(id) {
  let fn = addFamilyMemberData.value.findIndex((item) => item.id === id)

  if (fn !== -1) {
    addFamilyMemberData.value.splice(fn, 1)
  }
}
</script>

<template>
  <div class="container">
    <div class="form">
      <div class="section">
        <h4>افزودن کارمند</h4>
        <div class="form-group">
          <label for="firstName">نام</label>
          <input class="selectInput" v-model="employeeValue.firstName" type="text" id="firstName" placeholder="احسان" />
        </div>
        <div class="form-group">
          <label for="lastName">نام خانوادگی</label>
          <input v-model="employeeValue.lastName" class="selectInput" type="text" id="lastName" placeholder="رجبی" />
        </div>
        <div class="form-group">
          <label for="email">ایمیل</label>
          <input
            v-model="employeeValue.email"
            type="email"
            id="email"
            class="selectInput"
            placeholder="example@gmail.com"
          />
        </div>
        <div class="form-group">
          <label for="birthDate">تاریخ تولد</label>
          <input class="selectInput" v-model="employeeValue.dateOfBirth" type="date" id="birthDate" />
        </div>
      </div>
      <div class="section family">
        <h4>اعضای خانواده</h4>
        <div v-for="items in addFamilyMemberData" :key="items.id" class="family-member">
          <h5>#{{ items.id }}</h5>
          <div class="form-group">
            <label for="familyMemberName1">نام</label>
            <input
              v-model="items.name"
              type="text"
              id="familyMemberName1"
              placeholder="مریم قربانی"
            />
          </div>
          <div class="form-group">
            <label  for="relationship1">نسبت</label>
            <select v-model="items.relation" id="relationship1">
              <option value="daughter">دختر</option>
              <option value="son">پسر</option>
              <option value="spouse">همسر</option>
            </select>
          </div>
          <div class="form-group">
            <label for="birthDate1">تاریخ تولد</label>
            <input v-model="items.dateOfBirth" type="date" id="birthDate1" />
          </div>
          <button @click="deleteFamilyMember(items.id)" type="button" class="delete-btn">
            حذف
          </button>
        </div>
        <button @click="addFamilyMember">افزود عضو</button>
      </div>
      <div class="buttons">
        <button  @click="submitForm" type="submit" class="submit-btn">افزودن</button>
        <RouterLink to="/">
          <button type="reset" class="cancel-btn">تصرف</button>
        </RouterLink>
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
