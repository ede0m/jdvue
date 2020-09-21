<template>
    <div>
        <b-container id="content">
            <b-row>
                <b-col col lg="8">
                    <schedule v-bind:sch="groupSchedule" :groupName="group.name"></schedule>
                </b-col>
                <b-col col lb="4">
                    <div id="group-details">

                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import store from '../services/store'
import Schedule from '../components/Schedule'

export default {
  name: 'ScheduleGroup',
  components: {
      Schedule
  },
  methods: {

  },
  computed: {
    group() {
        return store.getters.currentGroup()
    },
    groupSchedule() {
        return store.getters.currentGroupSchedule()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#group-details {
    height: 100%;
    border-left: solid 1px #6363635e;
}

#content {
    width: 100%;
    height: 100%;
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
