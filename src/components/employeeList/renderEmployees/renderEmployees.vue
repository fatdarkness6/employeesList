<script setup>
import { ref, watch } from 'vue';
import formComponent from '../formComponent/formComponent.vue';
import { checkUserOnline } from '@/checkUserIsOnlineOrOffLine/check';
import { deleteEmployeeData , editEmployeeData , getAllEmployeeData} from '../../../apis/allApis'

let props = defineProps({
  data: Object,
});

let openModal = ref(false);
let updateOpenModal = ref(0);
let fetchData = ref([]);
let addFamilyMemberData = ref([]);
let userIsOnOrOffLine = ref(false);
let loading = ref({
  getAllEmployeeLoading: false,
  editEmployeeLoading: false,
  deleteLoading: false,
});
let employeeValue = ref({});
let child = ref(null);


//----------------------------------functions----------------------------//

function getAllEmployeeInfo() {
  checkUserOnline(userIsOnOrOffLine);
  loading.value.getAllEmployeeLoading = true;
  if (!userIsOnOrOffLine.value) {
    getAllEmployeeData(props.data.id)
      .then((data) => {
        fetchData.value = data.data;
      })
      .finally(() => {
        loading.value.getAllEmployeeLoading = false;
      });
  }
}

async function editFormSubmit() {
  
  checkUserOnline(userIsOnOrOffLine);
  const isValid = await child.value.handleSubmit((values) => {
    employeeValue.value = values;
    addFamilyMemberData.value = values.family || [];
    return true;
  })();

  let data = {
    firstName: employeeValue.value.firstName,
    lastName: employeeValue.value.lastName,
    email: employeeValue.value.email,
    dateOfBirth: employeeValue.value.dateOfBirth,
    family: addFamilyMemberData.value.map((item) => {
      return {
        name: item.name,
        relation: item.relation,
        dateOfBirth: new Date(item.dateOfBirth),
      };
    }),
  };

  if (isValid && !userIsOnOrOffLine.value) {
    loading.value.editEmployeeLoading = true;

      editEmployeeData(props.data.id, data)
      .finally(() => {
        loading.value.editEmployeeLoading = false;
      });
  }
}

async function deleteEmployee() {
  
  checkUserOnline(userIsOnOrOffLine);
  loading.value.deleteLoading = true;
  if (!userIsOnOrOffLine.value) {

    deleteEmployeeData(props.data.id)
      .finally(() => {
        loading.value.deleteLoading = false;
      });
  }
}

function updateOpenModalFn() {
  ++updateOpenModal.value;
}
//...............................watch.......................................//

watch(updateOpenModal, (newVal) => {
  if (newVal <= 1) {
    getAllEmployeeInfo();
  }
});

// ..............................onMounted...................................//
</script>

<template>
  <div class="list">
    <div
      @click="
        () => {
          openModal = !openModal
          updateOpenModalFn()
        }
      "
      class="flx"
    >
      <div class="icon">
        <img src="/free-arrow-down-icon-3101-thumb.png" />
      </div>
      <div class="name">
        <h2>{{ props.data.firstName }}</h2>
        <h2>{{ props.data.lastName }}</h2>
      </div>
    </div>
    <h3 v-if="loading.getAllEmployeeLoading">loading...</h3>
    <div
      v-else-if="!userIsOnOrOffLine"
      id="completeData"
      :class="[openModal ? 'completeData' : 'hidden']"
    >
      <button @click="deleteEmployee" class="delete-btn">حذف کاربر</button>
      <h3 v-if="loading.deleteLoading">...loading</h3>
      
      <div class="edit">
        <div class="container">
          <div class="form">
            <formComponent
              ref="child"
              :ftchData="fetchData"
              @response="(data) => (addFamilyMemberData = data)"
              @employeeValueFromChildComponent="(data) => (employeeValue = data)"
              :employeeValueFromChildComponent = 'employeeValue'
            />
            <div class="buttons">
              <button @click="editFormSubmit" type="submit" class="submit-btn">ادیت</button>
              <h3 v-if="loading.editEmployeeLoading">...loading</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
