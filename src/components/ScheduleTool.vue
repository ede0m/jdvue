<template>
    <div>
        <b-container id="content">
            <b-row>
                <b-col col lg="7">
                    <div v-if="schedule">
                        <schedule v-bind:sch="schedule" groupName="generated"></schedule>
                    </div>
                    <h4 class="tip" v-else>generate a schedule...</h4>
                </b-col>
                <b-col col lb="5">
                    <div id="tool-form">
                        Schedule Tool
                         <br><br>
                        <b-container>

                            <b-row align-h="center" class="tool-input">
                                <b-col col lg="4"><span>start date:</span></b-col>
                                <b-col col lg="6"><input type="date" @keyup="checkGenerateForm()" v-model="startDate" placeholder=" starting on week of"></b-col>
                            </b-row>
                            <b-row align-h="center" class="tool-input">
                                <b-col col lg="4"><span>n weeks:</span></b-col>
                                <b-col col lg="6"><input type="number" @keyup="checkGenerateForm()" v-model="nWeeks" placeholder=" season # of weeks"></b-col>
                            </b-row>
                            <b-row align-h="center" class="tool-input">
                                <b-col col lg="4"><span>n cycles:</span></b-col>
                                <b-col col lg="6"><input type="number" @keyup="checkGenerateForm()" v-model="nCycles" placeholder=" # of season cycles"></b-col>
                            </b-row>
                            <br>
                            <hr>
                            <br>
                            <b-row align-h="center" class="tool-input">
                                <b-col col lg="4"><button @click="addParticipant()"><span>+ member:</span></button></b-col>
                                <b-col col lg="6"><input type="text" v-model="newParticipant" placeholder=" add participant"></b-col>
                            </b-row>

                            <b-row align-h="center" class="tool-input">
                            <ul>
                                <li class="participant-list" v-for="(p, i) in participants" :key="i">
                                    {{ p }}<unicon @click="removeParticipant(i)" class="remove" name="times" fill="royalblue"></unicon>
                                </li>
                            </ul>
                            </b-row>

                            <br>
                            <hr>
                            <br>
                            <button @click="generateSchedule" :disabled='!canGenerate' id="generate-button">generate</button>

                        </b-container>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
//import store from '../services/store'
import Schedule from '../components/Schedule'
import API from '../services/api'
import notify from '../services/notify'

export default {
  name: 'ScheduleTool',
  components: {
      Schedule
  },
  methods: {
    addParticipant() {
        if (this.newParticipant != "" && this.newParticipant != null && 
            !(this.participants.indexOf(this.newParticipant) >= 0)) {
            this.participants.push(this.newParticipant);
            this.newParticipant = "";
        }
        this.checkGenerateForm();
    },
    removeParticipant(idx) {
        this.participants.splice(idx, 1);
        this.checkGenerateForm();
    },
    checkGenerateForm() {
        if (this.participants.length > 0 && this.nWeeks > 0 && this.nCycles > 0 && this.startDate != null) {
            this.canGenerate = true;
        } else {
            this.canGenerate = false;
        }
    },
    generateSchedule() {
        console.log(this.startDate)
        var payload = {
            StartDate : new Date(this.startDate).toISOString(),
            SeasonWeeks : Number(this.nWeeks),
            Years : Number(this.nCycles),
            Participants : this.participants
        }
        console.log(payload)
        API.generateSchedule(payload)
            .then((data) => {
                notify.success('successful!', 'http')
                console.log(data)
                this.schedule = data.data.schedule;
            })
            .catch(err => {
                console.log(err)
            });
    }
  },
  data: function() {
      return {
        schedule: null,
        participants : [],
        newParticipant: null,
        startDate: null,
        nWeeks: null,
        nCycles: null,
        canGenerate: false
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#generate-button {
    width: 70%;
    height: 50px;
    margin-bottom: 150px;
}

#tool-form {
    height: 100%;
    border-left: solid 1px #6363635e;
}

#content {
    width: 100%;
    height: 100%;
}

.tool-input {
    margin-top: 20px;
}

.tip {
    margin-top: 200px;
    color: gray;
}

.remove {
    visibility: hidden;
}

.participant-list:hover .remove{
    visibility: visible;
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
  margin: 10px 10px 10px 10px;
}
a {
  color: #42b983;
}
</style>
