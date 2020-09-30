<template>
    <div>
        <b-sidebar 
            id="sidebar" 
            :no-close-on-route-change="true"
            :no-header="true" 
            :visible="true" 
            width="22%"
            shadow>
            <div class="px-3 py-2">
                <br>
                <div id="sidebar-header">
                    <h3>{{name}}</h3>
                    <unicon name="setting" fill="royalblue"></unicon>
                </div>
                <hr>
                
                <div id="group-section">
                    <b-row class="hover-section" v-on:click="toggleGroups">
                        <b-col col lg="4"><unicon :name=arrowIconName fill="royalblue"></unicon></b-col>
                        <b-col col lg="1"><h4 class="sidebar-label">groups</h4></b-col>
                    </b-row>
                    <div v-show="showGroups">
                        <br>
                        <b-row class="hover-section" v-for="group in groups" v-bind:key="group.id" v-on:click="chooseGroup(group)">
                            <b-col col lg="6"></b-col>
                            <b-col col lg="2" class="group"><div><h6>{{group.name}}</h6></div></b-col>
                        </b-row>
                    </div>

                </div>
                <br>
                <hr>
                <div >
                    <b-row class="hover-section" v-on:click="setToolView">
                        <b-col col lg="4"><unicon name="schedule" fill="royalblue"></unicon></b-col>
                        <b-col col lg="3"><h4 class="sidebar-label">tool</h4></b-col>
                    </b-row>
                </div>
                <hr>

                <div>
                    <b-row class="hover-section">
                        <b-col col lg="4"><unicon name="exchange" fill="royalblue"></unicon></b-col>
                        <b-col col lg="3"><h4 class="sidebar-label">trade</h4></b-col>
                    </b-row>
                </div>

            </div>
        </b-sidebar>
    </div>
</template>

<script>
import store from '../services/store'
export default {
  name: 'JdSidebar',
  props : {
    groups: Array,
    name: String
  },
  methods: {
    toggleGroups() {
        this.showGroups = !this.showGroups
        if (this.showGroups) {
            this.arrowIconName = "angle-down"
        } else {
            this.arrowIconName = "angle-right"
        }
    },
    chooseGroup(group) {
        store.mutations.setCurrentGroup(group);
        this.$emit('sidebar-nav', 'ScheduleGroup')
    },
    setToolView(){
        this.$emit('sidebar-nav', 'ScheduleTool')
    }
  },
  data: function() {
    return {
      showGroups: false,
      arrowIconName: "angle-right"
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.group {
    margin-top: 15px;
    margin-right: 10px;
}
.group div {
    text-align: left;
}

.hover-section:hover {
    background: #4587d88a;
}

#group-section {
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
