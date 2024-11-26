<script setup lang="ts">
import familyMemberComponent from './familyMemberComponent/familyMemberComponent.vue'
import { onMounted, ref } from 'vue'
import { firstNameAndLastNameValidation, emailValidation } from '@/util/yupValidation/validations'
import { Field, Form, ErrorMessage  } from 'vee-validate'
import type { FormContext } from 'vee-validate'
import * as yup from 'yup'
import type { FamilyMember } from '@/types/familiesType'
import type { AllEmployeesProps } from '@/types/props'

const emit = defineEmits(['response', 'employeeValueFromChildComponent'])

const props = defineProps<AllEmployeesProps>()

const addFamilyMemberData = ref<{ name: string; relation: string; dateOfBirth: string }[]>([])
const form = ref<FormContext | null>(null)

//-------------------------------validation-----------------------------//

const validations = yup.object({
  firstName: firstNameAndLastNameValidation('نام را درست بنویسید'),
  lastName: firstNameAndLastNameValidation('نام خانوادگی را درست بنویسید'),
  email: emailValidation(),
  dateOfBirth: yup.string().required('تاریخ تولد الزامی است'),
  family: yup.array().of(
    yup.object().shape({
      name: firstNameAndLastNameValidation('نام را درست بنویسید'),
      relation: yup.string().required('رابطه الزامی است'),
      dateOfBirth: yup.string().required('تاریخ تولد الزامی است'),
    }),
  ),
})

//................................functions.................................//

function giveDataToEmployeeValue() {
  if (props.ftchData) {
    let formattedDateOfBirth
    if (Object.values(props?.ftchData).length > 0) {
      if (props?.ftchData?.dateOfBirth) {
        formattedDateOfBirth =
          new Date(props?.ftchData?.dateOfBirth).toISOString().split('T')[0] || ''
      } else {
        return
      }
    } else {
      formattedDateOfBirth = ''
    }
    addFamilyMemberData.value =
      props?.ftchData?.family?.map((items : FamilyMember) => {
        let date
        if (items.dateOfBirth !== undefined) {
          date = new Date(items.dateOfBirth).toISOString().split('T')[0]
        } else {
          date = ''
        }
        return {
          name: items.name,
          relation: items.relation,
          dateOfBirth: date,
        }
      }) || []
    form.value?.setValues({
      firstName: props?.ftchData?.firstName || '',
      lastName: props?.ftchData?.lastName || '',
      email: props?.ftchData?.email || '',
      dateOfBirth: formattedDateOfBirth || '',
      family: addFamilyMemberData.value,
    })
  }
}

function addFamilyMember() {
  const addFamilyObject = {
    name: '',
    relation: '',
    dateOfBirth: '',
  }
  addFamilyMemberData.value.push(addFamilyObject)
}

function removeFamilyMember(index: number) {
  addFamilyMemberData.value.splice(index, 1)
}

//................................onMounted.................................//

onMounted(() => {
  giveDataToEmployeeValue()
  emit('employeeValueFromChildComponent', form.value)
})
//----------------------------------defineExpose----------------------------//

function submitFormData() {
  if (form.value) {
    return form.value.validate(); // TypeScript now recognizes `validate`
  }
}

defineExpose({
  submitFormData,
})
</script>

<template>
  <Form ref="form" :validation-schema="validations">
    <div class="section">
      <h4>افزودن کارمند</h4>
      <div class="form-group">
        <label for="firstName">نام</label>
        <Field type="text" name="firstName" v-slot="{ field }">
          <input v-bind="field" type="text" id="firstName" placeholder="احسان" />
        </Field>
        <ErrorMessage name="firstName" class="errorRedText" />
      </div>
      <div class="form-group">
        <label for="lastName">نام خانوادگی</label>
        <Field type="text" name="lastName" v-slot="{ field }">
          <input v-bind="field" type="text" id="lastName" placeholder="رجبی" />
        </Field>
        <ErrorMessage name="lastName" class="errorRedText" />
      </div>
      <div class="form-group">
        <label for="email">ایمیل</label>
        <Field type="email" name="email" v-slot="{ field }">
          <input v-bind="field" type="email" id="email" placeholder="example@gmail.com" />
        </Field>
        <ErrorMessage name="email" class="errorRedText" />
      </div>
      <div class="form-group">
        <label for="birthDate">تاریخ تولد</label>
        <Field name="dateOfBirth" v-slot="{ field }">
          <input v-bind="field" type="date" id="birthDate" />
        </Field>
        <ErrorMessage name="dateOfBirth" class="errorRedText" />
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
      <button @click="addFamilyMember" type="button">افزودن عضو</button>
    </div>
  </Form>
</template>
