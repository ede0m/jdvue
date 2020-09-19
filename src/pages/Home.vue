<template>
    <div>
        <b-row>
            <b-col col lg="4"><jd-sidebar :groups=groups :name=name></jd-sidebar></b-col>
            <b-col col lg="8"><schedule-group></schedule-group></b-col>
        </b-row>
    </div>
</template>

<script>
import store from '../services/store'
import JdSidebar from '../components/JdSidebar'
import ScheduleGroup from '../components/ScheduleGroup'

export default {
  name: 'Home',
  components: {
      JdSidebar,
      ScheduleGroup
  },
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
        store.mutations.setCurrentGroup(this.groups[0]);
      } else {
          this.$router.push("/login");
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hover-section:hover {
    background: #4587d88a;
}

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
