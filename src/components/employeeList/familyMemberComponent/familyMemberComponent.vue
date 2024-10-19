<script setup>
import { useField } from 'vee-validate'
import { watch } from 'vue';

let props = defineProps({
  index: Number,
  items: Object,
})

let emit = defineEmits(['deleteFamily'])

//................................functions...............................//

function findIn(index) {
  return ++index
}

function deleteMember() {
  emit('deleteFamily', props.index)
}

//............................validation...............................//

let { value: name, errorMessage: errorName } = useField(`family[${props.index}].name`)
let { value: relation, errorMessage: errorRelation } = useField(`family[${props.index}].relation`)
let { value: dateOfBirth, errorMessage: errorDateOfBirth } = useField(`family[${props.index}].dateOfBirth`)

//............................watch....................................//

watch(() => props.items, (newVal) => {
  if (newVal) {
    name.value = newVal.name || '';
    relation.value = newVal.relation || '';
    dateOfBirth.value = newVal.dateOfBirth || '';
  }
}, )
</script>

<template>
  <div class="family-member">
    <h5>#{{ findIn(props.index) }}</h5>
    <div class="form-group">
      <label for="familyMemberName1">نام</label>
      <input
       :class="[errorName && 'errorBorder']"
        v-model="name"
        type="text"
        id="familyMemberName1"
        placeholder="مریم قربانی"
      />
      <div v-if="errorName" class="errorRedText">
        <h3>{{ errorName }}</h3>
      </div>
    </div>
    <div class="form-group">
      <label for="relationship1">نسبت</label>
      <select :class="[errorRelation && 'errorBorder']" v-model="relation" id="relationship1">
        <option value="daughter">دختر</option>
        <option value="son">پسر</option>
        <option value="spouse">همسر</option>
      </select>
      <div v-if="errorRelation" class="errorRedText">
        <h3>{{ errorRelation }}</h3>
      </div>
    </div>
    <div class="form-group">
      <label for="birthDate1">تاریخ تولد</label>
      <input :class="[errorDateOfBirth && 'errorBorder']" v-model="dateOfBirth" type="date" id="birthDate1" />
      <div v-if="errorDateOfBirth" class="errorRedText">
        <h3>{{ errorDateOfBirth }}</h3>
      </div>
    </div>
    <button @click="deleteMember" type="button" class="delete-btn">حذف</button>
  </div>
</template>
