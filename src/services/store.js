import Vue from 'vue';
import API from '../services/api'

const state = Vue.observable({
    user: null,
    group: null,
    groupSchedule: null
})

export default {

    getters: {
        user: () =>  { return state.user },
        currentGroup: () => {return state.group},
        currentGroupSchedule: () => {return state.groupSchedule},
    },
    mutations: {
        setUser: (val) => { state.user = val },
        setCurrentGroup: (val) => {
            state.group = val;
            API.getMasterSchedule(val.id)
                .then(res => {
                    state.groupSchedule = res.data.masterSchedule.schedule;
                })
        }
    }
}

