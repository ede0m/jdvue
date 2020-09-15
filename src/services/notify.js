import Vue from 'vue'

export default {
    warn(text, group) {
        Vue.notify({
            group: group,
            type : 'warn',
            title: 'WARNING',
            text: text
          })
    },

    err(text, group) {
        Vue.notify({
            group: group,
            type : 'error',
            title: 'ERROR',
            text: text
          })
    },

    success(text, group) {
        Vue.notify({
            group: group,
            type: 'success',
            title: 'SUCCESS',
            text: text
          })
    }
}