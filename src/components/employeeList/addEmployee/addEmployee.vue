<script setup lang="ts">
import { ref, type DefineComponent } from 'vue'
import formComponent from '../formComponent/formComponent.vue'
import { checkUserOnline } from '@/util/checkUserIsOnlineOrOffLine/check'
import { addEmployeeData } from '../../../service/apis/allApis'
import { sucssesNotifiCation, failNotification } from '@/util/NotifyMassage/notifyInformation'
import { reloadPage } from '@/util/reloadPageLogic/reloadPage'
import type { AllEmployees } from '@/types/getAllEmployeesInfoTypes'

const emit = defineEmits(['response'])

const allInputsValue = ref<AllEmployees>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  family: [],
})
const loading = ref<boolean>(false)
const userIsOnOrOffLine = ref<boolean>(false)
const child = ref<DefineComponent | null>(null)

//----------------------------------functions------------------------------//

async function submitForm() {
  const isValid = await child.value?.submitFormData()
  if (isValid.valid) {
    const data = {
      firstName: allInputsValue.value.firstName,
      lastName: allInputsValue.value.lastName,
      email: allInputsValue.value.email,
      dateOfBirth: new Date(allInputsValue.value.dateOfBirth).toISOString(),
      family:
        allInputsValue.value?.family?.map((item) => {
          return {
            name: item.name,
            relation: item.relation,
            dateOfBirth: new Date(item.dateOfBirth).toISOString(),
          }
        }) || [],
    }
    checkUserOnline(userIsOnOrOffLine)
    if (!userIsOnOrOffLine.value) {
      loading.value = true
      addEmployeeData(data)
        .then(() => {
          sucssesNotifiCation('کارمند با موفقیت افزوده شد')
          reloadPage()
        })
        .catch(() => {
          failNotification('مشکلی پیش آمده است')
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="form">
      <formComponent
        ref="child"
        :ftchData="allInputsValue"
        @employeeValueFromChildComponent="(data) => (allInputsValue = data.values)"
      />
      <div class="buttons">
        <div class="button">
          <button @click="submitForm" type="submit" class="submit-btn">افزودن</button>
          <h3 v-if="loading">loading...</h3>
        </div>
        <button @click="emit('response', false)" type="reset" class="cancel-btn">انصراف</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
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
