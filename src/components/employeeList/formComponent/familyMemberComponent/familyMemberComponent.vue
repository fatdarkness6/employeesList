<script setup lang="ts">
import { ErrorMessage, Field } from 'vee-validate'
import type { FamiliesComponetsProps } from '@/types/props';

const props = defineProps<FamiliesComponetsProps>()

const emit = defineEmits(['deleteFamily'])

//................................functions...............................//

function findIn(index: number | undefined) {
  if (index) {
    return ++index
  }
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
      <Field type="text" :name="`family[${props.index}].name`" v-slot="{ field }">
        <input v-bind="field" type="text" id="familyMemberName1" placeholder="مریم قربانی" />
      </Field>
      <ErrorMessage :name="`family[${props.index}].name`" class="errorRedText" />
    </div>
    <div class="form-group">
      <label for="relationship1">نسبت</label>
      <Field as="select" :name="`family[${props.index}].relation`" id="relationship1">
        <option value="daughter">دختر</option>
        <option value="son">پسر</option>
        <option value="spouse">همسر</option>
      </Field>
      <ErrorMessage :name="`family[${props.index}].relation`" class="errorRedText" />
    </div>
    <div class="form-group">
      <label for="birthDate1">تاریخ تولد</label>
      <Field :name="`family[${props.index}].dateOfBirth`" v-slot="{ field }">
        <input v-bind="field" type="date" id="birthDate1" />
      </Field>
      <ErrorMessage :name="`family[${props.index}].dateOfBirth`" class="errorRedText" />
    </div>
    <button @click="deleteMember" type="button" class="delete-btn">حذف</button>
  </div>
</template>
