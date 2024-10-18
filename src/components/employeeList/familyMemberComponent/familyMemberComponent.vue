<script setup>


let props = defineProps({
  index: Number,
  items: Object
})

let emit = defineEmits(['deleteFamily']) 

//................................functions...............................//

function findIn(index) {
  return ++index
}

function deleteMember() {
  emit('deleteFamily', props.index) 
}
</script>

<template>
  <div class="family-member">
    <h5>#{{ findIn(props.index) }}</h5>
    <div class="form-group">
      <label for="familyMemberName1">نام</label>
      <input
        v-model="props.items.name"
        type="text"
        id="familyMemberName1"
        placeholder="مریم قربانی"
      />
    </div>
    <div class="form-group">
      <label for="relationship1">نسبت</label>
      <select v-model="props.items.relation" id="relationship1">
        <option value="daughter">دختر</option>
        <option value="son">پسر</option>
        <option value="spouse">همسر</option>
      </select>
    </div>
    <div class="form-group">
      <label for="birthDate1">تاریخ تولد</label>
      <input v-model="props.items.dateOfBirth" type="date" id="birthDate1" />
    </div>
    <button @click="deleteMember" type="button" class="delete-btn">حذف</button>
  </div>
</template>