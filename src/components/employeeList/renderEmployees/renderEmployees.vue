<script setup lang="ts">
import { ref, watch, type DefineComponent } from 'vue';
import formComponent from '../formComponent/formComponent.vue';
import { checkUserOnline } from '@/util/checkUserIsOnlineOrOffLine/check';
import { deleteEmployeeData , editEmployeeData , getAllEmployeeData} from '../../../service/apis/allApis'
import { reloadPage } from '@/util/reloadPageLogic/reloadPage';
import { sucssesNotifiCation , failNotification } from '@/util/NotifyMassage/notifyInformation';
import type { RenderEmployeesProps } from '@/types/props';
import type { Loading } from '@/types/loadingTypes';
import type { AllEmployees } from '@/types/getAllEmployeesInfoTypes';

const props = defineProps<RenderEmployeesProps>();

const openModal = ref<boolean>(false);
const updateOpenModal = ref<number>(0);
const fetchData = ref<AllEmployees>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  family: [],
});
const userIsOnOrOffLine = ref<boolean>(false);
const loading = ref<Loading>({
  getAllEmployeeLoading: false,
  editEmployeeLoading: false,
  deleteLoading: false,
});
const allInputsValue = ref<AllEmployees>({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  family: [],
})
const child = ref<DefineComponent | null >(null);


//----------------------------------functions----------------------------//

function getAllEmployeeInfo() {
  checkUserOnline(userIsOnOrOffLine);
  loading.value.getAllEmployeeLoading = true;
  if (!userIsOnOrOffLine.value) {
    getAllEmployeeData(props.data?.id)
      .then((data) => {
        fetchData.value = data.data;
      })
      .catch(() => {
        failNotification('خطا در دریافت اطلاعات کلی کارمندان');
      })
      .finally(() => {
        loading.value.getAllEmployeeLoading = false;
      });
  }
}

async function editFormSubmit() {
  
  checkUserOnline(userIsOnOrOffLine);
  const isValid = await child.value?.submitFormData();
  const data = {
    firstName: allInputsValue.value.firstName,
    lastName: allInputsValue.value.lastName,
    email: allInputsValue.value.email,
    dateOfBirth: allInputsValue.value.dateOfBirth,
    family: allInputsValue.value?.family?.map((item) => {
      if(item.name !=="" && item.relation !=="" && item.dateOfBirth) {
        return {
        name: item.name,
        relation: item.relation,
        dateOfBirth: new Date(item.dateOfBirth),
      };
      }
    }) || []
  };
  if (isValid.valid && !userIsOnOrOffLine.value) {
    loading.value.editEmployeeLoading = true;
      editEmployeeData(props.data.id, data)
      .then(() => {
      sucssesNotifiCation('کاربر با موفقیت ویرایش شد');
      reloadPage()
  })
  .catch(() => {
    failNotification('خطا در ویرایش کاربر');
  })
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
    .then(() => {
      sucssesNotifiCation('کاربر با موفقیت حذف شد');
    reloadPage()
    })
    .catch(() => {
    failNotification('خطا در حذف کاربر');
})
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
              @employeeValueFromChildComponent="(data) => (allInputsValue = data.values)"
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
