import http from './http'

export default {
    
    acceptUserInvite(payload) {
        return http.patch("/user/invitation", payload)
            .then(res => {
                return res
            })
    },

    generateSchedule(payload) {
        return http.post("/schedule", payload)
            .then(res => {
                return res
            })
    },

    login(payload) {
        return http.post("/session", payload)
            .then(res => {
                return res
            })
    },

    getMasterSchedule(groupID) {
        return http.get("/schedule/master/"+groupID)
            .then(res => {
                return res
            })
    }

}