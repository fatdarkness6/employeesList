import { defineStore } from "pinia";

let usePinia = defineStore('employee' , {
    state: () => ({
        data: []
    }),
    actions : {
         async getEmployeeList() {
            await fetch('https://pouya-salamat-employee-task.liara.run/employee').then((e) => {
                return e.json()
            }).then((e) => {
                this.data = e
            })
        },
        removeEmployee(props) {
           let fn = this.data.find((e) => e.id === props )
           let fnIndex = this.data.indexOf(fn)
           this.data.splice(fnIndex , 1)
        },
    },
    getters : {
        getEmployeeData : (state) => state.data,
    }
})

export {usePinia}