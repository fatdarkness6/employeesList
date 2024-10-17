<script setup>
import familyMemberComponent from '../employeeList/familyMemberComponent/familyMemberComponent.vue'
import { onMounted, ref } from 'vue'
import _ from 'lodash'

let emit = defineEmits(['response', 'employeeValueFromChildComponent'])
let props = defineProps({
  ftchData: Object
})

let addFamilyMemberData = ref([])
let employeeValue = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: ''
})

//................................functions.................................//

function giveDataToEmployeeValue() {
  if (props.ftchData) {
    let formattedDateOfBirth
    if (Object.values(props?.ftchData).length > 0) {
      formattedDateOfBirth = new Date(props.ftchData.dateOfBirth).toISOString().split('T')[0]
    } else {
      formattedDateOfBirth = ''
    }
    employeeValue.value = {
      firstName: props.ftchData.firstName,
      lastName: props.ftchData.lastName,
      email: props.ftchData.email,
      dateOfBirth: formattedDateOfBirth
    }
    addFamilyMemberData.value = props?.ftchData?.family?.map((items) => {
      let date
      if (items.dateOfBirth !== undefined) {
        date = new Date(items.dateOfBirth).toISOString().split('T')[0]
      } else {
        date = ''
      }
      return {
        id: items.id,
        name: items.name,
        relation: items.relation,
        dateOfBirth: date
      }
    })
  }
}

function addFamilyMember() {
  let addFamilyObject = {
    name: '',
    relation: '',
    dateOfBirth: ''
  }
  addFamilyMemberData.value.push(addFamilyObject)
}

function removeFamilyMember(index) {
  addFamilyMemberData.value.splice(index, 1) 
}

//................................onMounted.................................//

onMounted(() => {
  giveDataToEmployeeValue()
  emit('response', addFamilyMemberData.value)
  emit('employeeValueFromChildComponent', employeeValue.value)
})
//----------------------------------emits----------------------------//
</script>

<template>
  <div class="section">
    <h4>افزودن کارمند</h4>
    <div class="form-group">
      <label for="firstName">نام</label>
      <input v-model="employeeValue.firstName" type="text" id="firstName" placeholder="احسان" />
    </div>
    <div class="form-group">
      <label for="lastName">نام خانوادگی</label>
      <input v-model="employeeValue.lastName" type="text" id="lastName" placeholder="رجبی" />
    </div>
    <div class="form-group">
      <label for="email">ایمیل</label>
      <input v-model="employeeValue.email" type="email" id="email" placeholder="example@gmail.com" />
    </div>
    <div class="form-group">
      <label for="birthDate">تاریخ تولد</label>
      <input v-model="employeeValue.dateOfBirth" type="date" id="birthDate" />
    </div>
  </div>
  
  <div class="section family">
    <h4>اعضای خانواده</h4>
    <familyMemberComponent
      v-for="(items, index) in addFamilyMemberData"
      :key="index"
      :index="index"
      :items="items"
      @deleteFamily="removeFamilyMember"
    />
    <button @click="addFamilyMember">افزودن عضو</button>
  </div>
</template>