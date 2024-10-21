<script setup>
import { ref, watch } from 'vue';
import formComponent from '../formComponent/formComponent.vue';
import { checkUserOnline } from '@/checkUserIsOnlineOrOffLine/check';
import { useNotification } from '@kyvg/vue3-notification'; // Import notifications

let props = defineProps({
  data: Object,
  allApis: Object,
});

let openModal = ref(false);
let updateOpenModal = ref(0);
let fetchData = ref([]);
let addFamilyMemberData = ref([]);
let userIsOnOrOffLine = ref(false);
let loading = ref({
  getAllEmployeeLoading: false,
  loadingForEnything: false,
});
let employeeValue = ref({});
let child = ref(null);

// Notification setup
const { notify } = useNotification();

//----------------------------------functions----------------------------//

function getAllEmployeeInfo() {
  checkUserOnline(userIsOnOrOffLine);
  loading.value.getAllEmployeeLoading = true;
  if (!userIsOnOrOffLine.value) {
    props.allApis.getAllEmployeeData(props.data.id)
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
    loading.value.loadingForEnything = true;
    props.allApis.editEmployeeData(props.data.id, data)
      .then((response) => {
        if (response.status === 200) {
          notify({
            title: 'Success',
            text: 'Employee data updated successfully!',
            type: 'success',
          });
          reloadPage()
        } else {
          notify({
            title: 'Error',
            text: 'Error updating employee: ',
            type: 'error',
          });
        }
      })
      .catch((error) => {
        notify({
          title: 'Error',
          text: 'Error updating employee: ' + (error.response?.data?.message || 'Unknown error'),
          type: 'error',
        });
      })
      .finally(() => {
        loading.value.loadingForEnything = false;
      });
  }
}

async function deleteEmployee() {
  checkUserOnline(userIsOnOrOffLine);
  loading.value.loadingForEnything = true;
  if (!userIsOnOrOffLine.value) {
    props.allApis.deleteEmployeeData(props.data.id)
      .then((response) => {
        if (response.status === 204) {
          notify({
            title: 'Success',
            text: 'Employee deleted successfully!',
            type: 'success',
          });
          reloadPage()
        }
      })
      .catch(() => {
        notify({
          title: 'Error',
          text: 'Error deleting employee: ',
          type: 'error',
        });
      })
      .finally(() => {
        loading.value.loadingForEnything = false;
      });
  }
}

function updateOpenModalFn() {
  ++updateOpenModal.value;
}

function reloadPage() {
  setTimeout(() => {
    location.reload()
  }, 3000);
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
    <div class="backgroundLoading" v-if="loading.loadingForEnything"></div>
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
        <img src="../../../../public/free-arrow-down-icon-3101-thumb.png" />
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
      <h1 v-if="loading.loadingForEnything" class="center">loading...</h1>
      <div class="edit">
        <div class="container">
          <div class="form">
            <formComponent
              ref="child"
              :ftchData="fetchData"
              @response="(data) => (addFamilyMemberData = data)"
              @employeeValueFromChildComponent="(data) => (employeeValue = data)"
            />
            <div class="buttons">
              <button @click="editFormSubmit" type="submit" class="submit-btn">ادیت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
