<script setup>
import { ref, watch } from 'vue'
import formComponent from '@/components/formComponent/formComponent.vue'
import { getAllEmployeeData } from '../../../../apis/getAllEmployeeData'
import { checkUserOnline } from '../../../../checkUserIsOnlineOrOffLine/check'
import { editEmployeeData } from '../../../../apis/editEmployeeData'
import { deleteEmployeeData } from '../../../../apis/deleteEmployeeData'

let props = defineProps({
  data: Object
})

let openModal = ref(false)
let updateOpenModal = ref(0)
let fetchData = ref([])
let addFamilyMemberData = ref([])
let userIsOnOrOffLine = ref(false)
let loading = ref(false)
let employeeValue = ref({})

//----------------------------------functions----------------------------//

function getAllEmployeeInfo() {
  checkUserOnline(userIsOnOrOffLine)
  loading.value = true
  if (!userIsOnOrOffLine.value) {
    getAllEmployeeData(props.data.id)
      .then((response) => response.json())
      .then((data) => {
        fetchData.value = data
      })
      .finally(() => {
        loading.value = false
      })
  }
}

async function editFormSubmit() {
  checkUserOnline(userIsOnOrOffLine)
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

  if (
    !isAnyFieldEmpty &&
    !userIsOnOrOffLine.value &&
    employeeValue.value.firstName &&
    employeeValue.value.lastName &&
    employeeValue.value.email &&
    employeeValue.value.dateOfBirth
  ) {
    editEmployeeData(props.data.id, data)
      .then((response) => {
        if (response.status === 200) {
          location.reload()
        } else {
          console.error('Error updating employee:', response.statusText)
        }
      })
      .catch((error) => {
        console.error('Error updating employee:', error)
      })
  }
}

async function deleteEmployee() {
  checkUserOnline(userIsOnOrOffLine)
  deleteEmployeeData(props.data.id).then((response) => {
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
    <div
      v-else-if="!userIsOnOrOffLine"
      id="completeData"
      :class="[openModal ? 'completeData' : 'hidden']"
    >
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
