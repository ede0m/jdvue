import http from './http'

export default {
    acceptUserInvite(payload) {
        return http.patch("/user/invitation", payload)
            .then(res => {
                return res
            })
    },

    login(payload) {
        return http.post("/session", payload)
            .then(res => {
                return res
            })
    }

}