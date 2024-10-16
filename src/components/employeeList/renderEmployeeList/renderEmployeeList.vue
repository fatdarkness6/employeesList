<script setup>
import { onMounted, ref } from 'vue'

let props = defineProps({
  data: Object,
  store : Object
})
let addFamilyMemberData = ref([])
let openModal = ref(false)
let fetchData = ref([])
let addFamilyId = ref(0)

let employeeValue = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: ''
})

//----------------------------------functions----------------------------//

async function getAllEmployeeInfo() {
  return await fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props.data.id}`, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      fetchData.value = data
      const formattedDateOfBirth = new Date(data.dateOfBirth).toISOString().split('T')[0]
      employeeValue.value = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: formattedDateOfBirth
      }
      addFamilyMemberData.value = data.family.map((item) => {
        return {
          id: props.data.id,
          name: item.name,
          relation: item.relation,
          dateOfBirth: new Date(item.dateOfBirth).toISOString().split('T')[0]
        }
      })
    })
}

async function editFormSubmit() {
  let data = {
    firstName: employeeValue.value.firstName,
    lastName: employeeValue.value.lastName,
    email: employeeValue.value.email,
    dateOfBirth: employeeValue.value.dateOfBirth,
    family: addFamilyMemberData.value.map((item) => {
      return {
        name: item.name,
        relation: item.relation,
        dateOfBirth: new Date(item.dateOfBirth)
      } 
    })
  }

  return await fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props.data.id}`, {
    method: 'PUT',
    headers: {
      Authorization: '12345678910',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

async function deleteEmployee() {
  console.log(props.data)
  return await fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props.data.id}`, {
    method: 'DELETE',
  }).then((e) => {
    if(e.status == 204) {
      props.store.removeEmployee(props.data.id)
    }
  })
}

function findIn(id) {
  const index = addFamilyMemberData.value.findIndex(item => item.id === id);
  return index !== -1 ? index + 1 : null; 
}

function addFamilyMember() {
  ++addFamilyId.value
  let addFamilyObject = {
    id: addFamilyId.value,
    name: '',
    relationship: '',
    birthDate: ''
  }
  addFamilyMemberData.value.push(addFamilyObject)
}

function deleteFamilyMember(id) {
  let fn = addFamilyMemberData.value.findIndex((item) => item.id === id)

  if (fn !== -1) {
    addFamilyMemberData.value.splice(fn, 1)
  }
}

onMounted(() => {
  getAllEmployeeInfo()
})
</script>

<template>
  <div class="list">
    <div @click="openModal = !openModal" class="flx">
      <div class="icon">
        <img src="../../../../public/free-arrow-down-icon-3101-thumb.png" />
      </div>
      <div class="name">
        <h2>{{ props.data.firstName }}</h2>
        <h2>{{ props.data.lastName }}</h2>
      </div>
    </div>
    <div id="completeData" :class="[openModal ? 'completeData' : 'hidden']">
      <button @click="deleteEmployee" class="delete-btn">حذف کاربر</button>
      <div class="edit">
        <div class="container">
          <div class="form">
            <div class="section">
              <h4>افزودن کارمند</h4>
              <div class="form-group">
                <label for="firstName">نام</label>
                <input
                  v-model="employeeValue.firstName"
                  type="text"
                  id="firstName"
                  placeholder="احسان"
                />
              </div>
              <div class="form-group">
                <label for="lastName">نام خانوادگی</label>
                <input
                  v-model="employeeValue.lastName"
                  type="text"
                  id="lastName"
                  placeholder="رجبی"
                />
              </div>
              <div class="form-group">
                <label for="email">ایمیل</label>
                <input
                  v-model="employeeValue.email"
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                />
              </div>
              <div class="form-group">
                <label for="birthDate">تاریخ تولد</label>
                <input v-model="employeeValue.dateOfBirth" type="date" id="birthDate" />
              </div>
            </div>
            <div class="section family">
              <h4>اعضای خانواده</h4>
              <div v-for="items in addFamilyMemberData" :key="items.id" class="family-member">
                
                <h5>#{{ findIn(items.id) }}</h5>
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
                  <label for="relationship1">نسبت</label>
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
              <button @click="editFormSubmit" type="submit" class="submit-btn">ادیت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list {
  border: 1px solid #5151518f;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  width: 100%;
}
.list #completeData {
  transition: all 0.3s;
  overflow: hidden;
  direction: rtl;
}
.list .hidden {
  height: 0;
}
.list .completeData {
  height: auto;
}

.list .flx {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list .name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list .icon img {
  width: 15px;
  height: 15px;
  cursor: pointer;
}
.container {
  width: 100%;
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
