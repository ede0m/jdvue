<template>
  <div class="register">
    <h1>Welcome!</h1>
    <br><br>
    <p> You've been invited to schedule group <b>{{ group }}</b>, 
    <br>but first you will need to register your account...</p>
    <br><br>
    <b-container id="register-form">
        <b-row align-h="center">
            <b-col col lg="2"><span>First Name:</span></b-col>
            <b-col col lg="2"><input type="text" v-model="firstName" placeholder="first name"></b-col>
        </b-row>
        <br>
        <b-row align-h="center">
            <b-col col lg="2"><span>Last Name:</span></b-col>
            <b-col col lg="2"><input type="text" v-model="lastName" placeholder="first name"></b-col>
        </b-row>
        <b-row align-h="center">
            <br><br>
        </b-row>
        <b-row align-h="center">
            <b-col col lg="2"><span>Password: </span></b-col>
            <b-col col lg="2"><input type="password" v-model="pwd" placeholder="password"></b-col>
        </b-row>
        <br>
        <b-row align-h="center">
            <b-col col lg="2"></b-col>
            <b-col col lg="2"><input type="password" v-model="pwdCheck" @input="checkPasswordMatch()" placeholder="re-enter password"></b-col>
        </b-row>
        <br><br>
        <b-row align-h="center">
            <button id="register-submit" v-on:click="registerForm">submit</button>
        </b-row>
        <br><br>
        <div>
            <b-row align-h="center">
                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <b-col col lg="12">
                            <li class="error-message" v-for="error in errors" :key="error.id">{{ error }}</li>
                        </b-col>
                    </ul>
                </p>
            </b-row>
        </div>
    </b-container>
  </div>
</template>

<script>
import API from '../services/api'
import notify from '../services/notify'

export default {
    name: 'Register',
    data: function() {
        // navigate away if token not specified..
        if (this.$route.query.token === undefined || this.$route.query.groupID === undefined){
            this.$router.push('/')
        } 
        return {
            group: this.$route.query.group,
            groupID: this.$route.query.groupID,
            firstName: "",
            lastName: "",
            pwd: "",
            pwdCheck: "",
            errors: [],
            passwordMatch: false
        }
    }, 
    methods: {
        registerForm: function () {
            this.checkForm()
            // set in local storage
            localStorage.setItem("token", this.$route.query.token)

            if (this.errors.length === 0) {
                var payload = {
                    groupID : this.groupID,
                    firstName : this.firstName,
                    lastName : this.lastName,
                    password : this.pwd
                }
                API.acceptUserInvite(payload)
                    .then(() => {
                        notify.success('successful register!', 'http')
                        this.$router.push('/')
                    })
                    .catch(err => {
                        console.log(err)
                    });
            }
        },

        checkPasswordMatch: function() {
            if (this.pwd != this.pwdCheck) {
                this.passwordMatch = false;
            } else {
                this.passwordMatch = true;
            }
        },

        checkForm: function () {
            this.errors = [];
            if (!this.firstName || this.firstName == "") {
                this.errors.push('first name required.');
            }
            if (!this.lastName || this.lastName == "") {
                this.errors.push('last name required.');
            }
            if (!this.passwordMatch) {
                this.errors.push('passwords must match');
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3, h1 {
  margin: 40px 0 0;
}
span {
    margin-right: 20px;
}
.error-message {
    color:red;
}
#register-submit {
    width: 10%;
    height: 5%;
}
#register-form {
    display: inline-block;
    text-align: center;
}
 ul {

 }
</style>
