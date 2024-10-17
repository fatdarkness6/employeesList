<script setup>
import { ref, watch } from 'vue'
import formComponent from '@/components/formComponent/formComponent.vue'

let props = defineProps({
  data: Object
})

let openModal = ref(false)
let updateOpenModal = ref(0)
let fetchData = ref([])
let addFamilyMemberData = ref([])
let loading = ref(false)
let employeeValue = ref({})

//----------------------------------functions----------------------------//

async function getAllEmployeeInfo() {
  loading.value = true
  return await fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props.data.id}`, {
    method: 'GET'
  })
    .then((response) => response.json())
    .then((data) => {
      fetchData.value = data
    })
    .finally(() => {
      loading.value = false
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

  const isAnyFieldEmpty = addFamilyMemberData.value.some((item) => {
    return item.name === '' || item.relation === '' || item.dateOfBirth === ''
  })

  if (!isAnyFieldEmpty) {
    try {
      const response = await fetch(
        `https://pouya-salamat-employee-task.liara.run/employee/${props.data.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: '12345678910',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (response.status === 200) {
        location.reload()
      } else {
        console.error('Error updating employee:', response.statusText)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    }
  } else {
    console.log('Please fill in all family member fields.')
  }
}

async function deleteEmployee() {
  return await fetch(`https://pouya-salamat-employee-task.liara.run/employee/${props.data.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: '12345678910'
    }
  }).then((response) => {
    if (response.status == 204) {
      location.reload()
    }
  })
}



function updateOpenModalFn() {
  ++updateOpenModal.value
}

//...............................watch.......................................//

watch(updateOpenModal, (newVal) => {
  if (newVal <= 1) {
    getAllEmployeeInfo()
  } else {
    return
  }
})

// ..............................onMounted...................................//
</script>

<template>
  <div class="list">
    <div
      @click="
        () => {
          openModal = !openModal
          updateOpenModalFn()
        }
      "
      class="flx"
    >
      <div class="icon">
        <img src="../../../../public/free-arrow-down-icon-3101-thumb.png" />
      </div>
      <div class="name">
        <h2>{{ props.data.firstName }}</h2>
        <h2>{{ props.data.lastName }}</h2>
      </div>
    </div>
    <h3 v-if="loading">loading...</h3>
    <div v-else id="completeData" :class="[openModal ? 'completeData' : 'hidden']">
      <button @click="deleteEmployee" class="delete-btn">حذف کاربر</button>
      <div class="edit">
        <div class="container">
          <div class="form">
            <formComponent
              :ftchData="fetchData"
              @response="(data) => (addFamilyMemberData = data)"
              @employeeValueFromChildComponent="(data) => (employeeValue = data)"
            />
            <div class="buttons">
              <button @click="editFormSubmit" type="submit" class="submit-btn">ادیت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
