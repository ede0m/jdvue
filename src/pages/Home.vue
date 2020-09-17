<template>
    <div>
        <b-sidebar 
            id="sidebar" 
            :title=this.name
            :no-close-on-route-change="true"
            :no-header="true" 
            :visible="true" 
            width="300px"
            shadow>
            <div class="px-3 py-2">
                <div id="sidebar-header">
                    <h3>{{name}}</h3>
                    <unicon name="setting" fill="royalblue"></unicon>
                </div>
                <hr>
                
                <div id="groups">
                    <b-row>
                        <b-col col lg="1"><unicon name="angle-right" fill="royalblue"></unicon></b-col>
                        <b-col col lg="3"><h5 class="sidebar-label">groups</h5></b-col>
                    </b-row>
                </div>
                <br>
                <hr>


            </div>
        </b-sidebar>
    </div>
</template>

<script>
import store from '../services/store'

export default {
  name: 'Home',
  data: function() {
      return {
          groups: null,
          name: null,
      }
  },
  created: function() {
      var user = store.getters.user();
      if (user != null) {
        this.groups = user.groups;
        this.name = user.name;
      } else {
          this.$router.push("/login");
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#groups {
    margin-top: 15%;
}

.sidebar-label {
    float: left;
    padding-left: 30px;
}

#sidebar-header h3 {
    padding-top: 20px;
    margin-right: 40px;
    display: inline;
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
