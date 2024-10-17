<script setup>
import familyMemberComponent from '../employeeList/familyMemberComponent/familyMemberComponent.vue'
import { onMounted, ref } from 'vue'


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

function getDataToEmployeeValue() {
    if(props.ftchData) {
        let formattedDateOfBirth
        if(Object.values(props?.ftchData).length > 0) {
        formattedDateOfBirth =  new Date(props.ftchData.dateOfBirth).toISOString().split('T')[0]
    }else {
        formattedDateOfBirth = ''
    }
 
  employeeValue.value = {
    firstName: props.ftchData.firstName,
    lastName: props.ftchData.lastName,
    email: props.ftchData.email,
    dateOfBirth: formattedDateOfBirth
  }
    }
    
}

//................................onMounted.................................//

onMounted(() => {
  getDataToEmployeeValue()
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
  <familyMemberComponent :familyMember="props?.ftchData?.family" @response="(data) => (addFamilyMemberData = data)" />
</template>
