<script setup>
import { ref, onMounted } from 'vue'
import renderEmployeeList from './renderEmployeeList/renderEmployeeList.vue'
let employeeList = ref([])

async function getEmployeeList() {
  await fetch('https://pouya-salamat-employee-task.liara.run/employee')
    .then((response) => response.json())
    .then((e) => {
      employeeList.value = e
    })
}

//----------------------------------onMounted----------------------------//

onMounted(() => {
  getEmployeeList()
})
</script>

<template>
  <div class="employee-list">
    <div class="wrapper">
      <div class="showEmployees">
        <div class="title">
          <h2>کارمندان</h2>
        </div>
        <renderEmployeeList v-for="data in employeeList" :key="data.id" :data="data" />
        <div class="addEmployee">
          <RouterLink to="/addEmployee">
            <button>افزودن کارمند</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employee-list {
  height: 100vh;
}
.employee-list .showEmployees {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  padding: 50px 0 50px 0;
}
.employee-list .showEmployees .title h2 {
  direction: rtl;
}
.employee-list .addEmployee {
  text-align: center;
}
.employee-list .addEmployee button {
  padding: 12px;
  border: none;
  background-color: rgb(1, 163, 1);
  color: #fff;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}
</style>
