import Vue from 'vue';

const state = Vue.observable({
    user: null
})

export default {

    getters: {
        user: () =>  { return state.user }
    },

    mutations: {
        setUser: (val) => { state.user = val }
    }
}

