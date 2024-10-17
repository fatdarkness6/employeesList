<script setup>
import { onMounted, ref } from 'vue'


let props = defineProps({
  familyMember: Array
})


let addFamilyId = ref(0)
let addFamilyMemberData = ref([])  // تعریف درست متغیر

let emit = defineEmits(['response'])

//................................functions...............................//

function findIn(id) {
  const index = addFamilyMemberData.value.findIndex((item) => item.id === id)
  return index !== -1 ? index + 1 : null
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


function getDataToFamilyMember() {
  addFamilyMemberData.value = props?.familyMember?.map((items) => {
    let date 
    if(items.dateOfBirth !== undefined) {
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
  }) || []
}
//.................................onMounted.................................//

onMounted(() => {
  getDataToFamilyMember()
  emit('response', addFamilyMemberData.value)
})
//----------------------------------emits----------------------------//


</script>

<template>
  <div class="section family">
    <h4>اعضای خانواده</h4>
    <div v-for="items in addFamilyMemberData" :key="items.id" class="family-member">
      <h5>#{{ findIn(items.id) }}</h5>
      <div class="form-group">
        <label for="familyMemberName1">نام</label>
        <input v-model="items.name" type="text" id="familyMemberName1" placeholder="مریم قربانی" />
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
      <button @click="deleteFamilyMember(items.id)" type="button" class="delete-btn">حذف</button>
    </div>
    <button @click="addFamilyMember">افزود عضو</button>
  </div>
</template>
