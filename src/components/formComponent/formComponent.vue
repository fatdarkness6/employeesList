<script setup>
import familyMemberComponent from '../employeeList/familyMemberComponent/familyMemberComponent.vue'
import { onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'


let emit = defineEmits(['response', 'employeeValueFromChildComponent' , 'submit'])
let props = defineProps({
  ftchData: Object,
})

let addFamilyMemberData = ref([])
let employeeValue = ref({
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: ''
})
//-------------------------------validation-----------------------------//

let schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Email is not valid'),
  dateOfBirth: yup.date().required('Date of birth is required')
})

let { handleSubmit , errors } = useForm({
  validationSchema: schema,
  initialValues : {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  }
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
      <div v-if="errors.firstName" class="error-message"><h3>{{ errors.firstName }}</h3></div>
    </div>
    <div class="form-group">
      <label for="lastName">نام خانوادگی</label>
      <input v-model="employeeValue.lastName" type="text" id="lastName" placeholder="رجبی" />
      <div v-if="errors.lastName" class="error-message"><h3>{{ errors.lastName }}</h3></div>
    </div>
    <div class="form-group">
      <label for="email">ایمیل</label>
      <input v-model="employeeValue.email" type="email" id="email" placeholder="example@gmail.com" />
      <div v-if="errors.email" class="error-message"><h3>{{ errors.email }}</h3></div>
    </div>
    <div class="form-group">
      <label for="birthDate">تاریخ تولد</label>
      <input v-model="employeeValue.dateOfBirth" type="date" id="birthDate" />
      <div v-if="errors.dateOfBirth" class="error-message"><h3>{{ errors.dateOfBirth }}</h3></div>
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