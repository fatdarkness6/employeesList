<script setup>
import familyMemberComponent from './familyMemberComponent/familyMemberComponent.vue'
import { onMounted, ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

let emit = defineEmits(['response', 'employeeValueFromChildComponent', 'submit'])
let props = defineProps({
  ftchData: Object
})

let addFamilyMemberData = ref([])
//-------------------------------validation-----------------------------//
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
//email('ایمیل وارد شده صحیح نیست')

let schema = yup.object({
  firstName: yup.string().required('نام الزامی است'),
  lastName: yup.string().required('نام خانوادگی الزامی است'),
  email: yup.string().matches(emailRegex , 'لطفا ایمیل را درست وارد کنید').required('ایمیل الزامی است'),
  dateOfBirth: yup.string().required('تاریخ تولد الزامی است'),
  family: yup.array().of(
    yup.object().shape({
      name: yup.string().required('نام الزامی است'),
      relation: yup.string().required('رابطه الزامی است'),
      dateOfBirth: yup.string().required('تاریخ تولد الزامی است')
    })
  )
})

const { setFieldValue, handleSubmit } = useForm({
  validationSchema: schema
})

let { value: firstName, errorMessage: firstNameError } = useField('firstName')
let { value: lastName, errorMessage: lastNameError } = useField('lastName')
let { value: email, errorMessage: emailError } = useField('email')
let { value: dateOfBirth, errorMessage: dateOfBirthError } = useField('dateOfBirth')
//................................functions.................................//

function giveDataToEmployeeValue() {
  if (props.ftchData) {
    let formattedDateOfBirth
    if (Object.values(props?.ftchData).length > 0) {
      formattedDateOfBirth = new Date(props.ftchData.dateOfBirth).toISOString().split('T')[0]
    } else {
      formattedDateOfBirth = ''
    }
    setFieldValue('firstName', props.ftchData.firstName)
    setFieldValue('lastName', props.ftchData.lastName)
    setFieldValue('email', props.ftchData.email)
    setFieldValue('dateOfBirth', formattedDateOfBirth)
    addFamilyMemberData.value =
      props?.ftchData?.family?.map((items) => {
        console.log(items.id)
        let date
        if (items.dateOfBirth !== undefined) {
          date = new Date(items.dateOfBirth).toISOString().split('T')[0]
        } else {
          date = ''
        }
        return {
          name: items.name,
          relation: items.relation,
          dateOfBirth: date
        }
      }) || []

    setFieldValue('family', addFamilyMemberData.value)
  }
}

function addFamilyMember() {
  let addFamilyObject = {
    name: '',
    relation: '',
    dateOfBirth: ''
  }
  addFamilyMemberData.value.push(addFamilyObject)
  setFieldValue('family', addFamilyMemberData.value)
}

function removeFamilyMember(index) {
  addFamilyMemberData.value.splice(index, 1)
  setFieldValue('family', addFamilyMemberData.value)
}
//................................watch.................................//

watch([firstName, lastName, email, dateOfBirth], () => {
  emit('employeeValueFromChildComponent', {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    dateOfBirth: dateOfBirth.value
  })
})

//................................onMounted.................................//

onMounted(() => {
  giveDataToEmployeeValue()
  emit('response', addFamilyMemberData.value)
})
//----------------------------------defineExpose----------------------------//

defineExpose({
  handleSubmit
})
</script>

<template>
  <div class="section">
    <h4>افزودن کارمند</h4>
    <div class="form-group">
      <label for="firstName">نام</label>
      <input
        :class="[firstNameError && 'errorBorder']"
        v-model="firstName"
        type="text"
        id="firstName"
        placeholder="احسان"
      />
      <div v-if="firstNameError" class="errorRedText">
        <h3>{{ firstNameError }}</h3>
      </div>
    </div>
    <div class="form-group">
      <label for="lastName">نام خانوادگی</label>
      <input
        :class="[lastNameError && 'errorBorder']"
        v-model="lastName"
        type="text"
        id="lastName"
        placeholder="رجبی"
      />
      <div v-if="lastNameError" class="errorRedText">
        <h3>{{ lastNameError }}</h3>
      </div>
    </div>
    <div class="form-group">
      <label for="email">ایمیل</label>
      <input
        :class="[emailError && 'errorBorder']"
        v-model="email"
        type="email"
        id="email"
        placeholder="example@gmail.com"
      />
      <div v-if="emailError" class="errorRedText">
        <h3>{{ emailError }}</h3>
      </div>
    </div>
    <div class="form-group">
      <label for="birthDate">تاریخ تولد</label>
      <input
        :class="[dateOfBirthError && 'errorBorder']"
        v-model="dateOfBirth"
        type="date"
        id="birthDate"
      />
      <div v-if="dateOfBirthError" class="errorRedText">
        <h3>{{ dateOfBirthError }}</h3>
      </div>
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
