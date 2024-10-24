import { useNotification } from "@kyvg/vue3-notification";
const { notify } = useNotification();

export function sucssesNotifiCation(text) {
    notify({
        title: 'Success',
        text: `${text}`,
        type: 'success'
      })  
}

export function failNotification(text) {
    notify({
        title: 'Error',
        text: `${text} `,
        type: 'error'
      })
}