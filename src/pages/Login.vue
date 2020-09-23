<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png">
    <b-container id="login-form">
        <b-row><b-col col lg="12"><input type="text" v-model="email" placeholder="email"></b-col></b-row>
        <b-row><b-col col lg="12"><input type="password" v-model="password" placeholder="password"></b-col></b-row>

        <b-row align-h="center">
            <b-col col lg="12"><button id="login-submit" v-on:click="loginForm">login</button></b-col>
        </b-row>
    </b-container>
  </div>
</template>

<script>
import API from '../services/api'
import store from '../services/store'

export default {
  name: 'Login',
  data: function() {
      return {
          email: "",
          password: ""
      }
  },
  methods: {
    loginForm: function () {
      var payload = {
        email : this.email,
        password : this.password
      }
      API.login(payload)
        .then((res) => {
            var data = res.data;
            localStorage.setItem("token", data.token);
            var user = {
              name: data.firstName + " " + data.lastName,
              groups : data.groups,
              email: data.email
            }
            store.mutations.setUser(user);
            this.$router.push('/');
        })
        .catch(err => {
            console.log(err)
        })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  width: 20%;
  margin-top: 10px;
}
#login-form {
  width: 80%;
}
#login-submit {
  margin-top: 40px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
