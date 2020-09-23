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
                                <li class="participant-list" v-for="(p, i) in participantNames" :key="i">
                                    {{ p }}<unicon @click="removeParticipant(i)" class="remove" name="times" fill="royalblue"></unicon>
                                </li>
                            </ul>
                            </b-row>

                            <br>
                            <hr>
                            <br>
                            <button @click="generateSchedule" :disabled='!canGenerate' id="generate-button">generate</button>
                            
                            <div v-if="schedule">
                                <b-row id="open-convert"><b-col col lg="12"><a v-b-modal="'create-group-modal'"> convert to group </a></b-col></b-row>
                            </div>

                        </b-container>
                        
                        <!-- create group dialog -->
                        <b-modal id="create-group-modal" title="Convert to Group" @ok="okayCreateGroup" ok-only scrollable>
                
                            <form ref="form" @submit.stop.prevent="createGroup">
                                <b-form-group
                                    :state="newGroupNameState"
                                    label="group name"
                                    label-for="group-name-input"
                                    invalid-feedback="group name required">
                                    
                                    <b-form-input
                                        id="group-name-input"
                                        type="text"
                                        v-model="newGroupName"
                                        :state="newGroupNameState"
                                        placeholder="enter group name"
                                        required>
                                    </b-form-input>

                                </b-form-group>
                                <hr>
                                <b-form-group
                                    :state="memberEmailState"
                                    label="participant emails"
                                    label-for="member-email-input"
                                    invalid-feedback="participant email required">

                                    <b-row align-h="center" class="create-group-input">
                                        <b-col col lg="12">
                                        <ul>
                                            <li class="new-group-participant-list" v-for="(p, i) in participants" :key="i">
                                                <b-form-input
                                                    class="member-email-input"
                                                    type="email"
                                                    v-model="p.email"
                                                    :state="memberEmailState"
                                                    :placeholder="'email for '+[[p.alias]]"
                                                    required
                                                ></b-form-input>
                                            </li>
                                        </ul>
                                        </b-col>
                                    </b-row>

                                </b-form-group>
                            </form>
                            
                        </b-modal>
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
import store from '../services/store'
import notify from '../services/notify'

export default {
  name: 'ScheduleTool',
  components: {
      Schedule
  },
  methods: {
    addParticipant() {
        if (this.newParticipant != "" && this.newParticipant != null && 
            !(this.participantNames.indexOf(this.newParticipant) >= 0)) {
            this.participantNames.push(this.newParticipant);
            this.participants.push({"alias": this.newParticipant, "email": null});
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
        var payload = {
            StartDate : new Date(this.startDate).toISOString(),
            SeasonWeeks : Number(this.nWeeks),
            Years : Number(this.nCycles),
            Participants : this.participantNames
        };
        API.generateSchedule(payload)
            .then((data) => {
                notify.success('successful!', 'http')
                console.log(data)
                this.schedule = data.data.schedule;
            })
            .catch(err => {
                console.log(err)
            });
    },
    checkCreateGroupFormValidity() {
        const valid = this.$refs.form.checkValidity();
        this.newGroupNameState = valid;
        this.memberEmailState = valid;
        return valid
    },
    okayCreateGroup(bvModalEvt){
        bvModalEvt.preventDefault();
        this.createGroup();
    },
    createGroup() {
        if (!this.checkCreateGroupFormValidity()) {
          return
        }
        // TODO Do the payloaddd
        var scheduleCopy = this.convertSchedule();
        var admin = store.getters.user();
        var payload = {
            Name : this.newGroupName,
            AdminEmails : [admin.email],
            MemberEmails : [...new Set([admin.email,...scheduleCopy.participants])],
            Schedule: scheduleCopy
        };
        API.createGroupSchedule(payload)
            .then((data) => {
                notify.success('successful!', 'http');
                this.schedule = scheduleCopy;
                this.$nextTick(() => {
                    this.$bvModal.hide('create-group-modal')
                });
                var newGroup = data.data;
                admin.groups.push(newGroup);
                console.log(newGroup);
                store.mutations.setUser(admin);
            })
            .catch(err => {
                console.log(err)
            });
    },
    convertSchedule() {
        let scheduleCopy = Object.assign({}, this.schedule);
        // make map
        var map = {}
        this.participants.forEach(function(o){
            map[o.alias] = o.email;
        });
        // convert participants
        var updatedParticipants = []
        for (var i = 0; i < this.schedule.participants.length; i++) {
            updatedParticipants[i] = map[this.schedule.participants[i]]
        }
        scheduleCopy.participants = updatedParticipants;
        // convert weeks
        scheduleCopy.seasons.forEach(function(s){
            s.blocks.forEach(function(b){
                b.weeks.forEach(function(w){
                    var p = w.participant;
                    w.participant = map[p]; // switch to email
                });
            });
        });
        return scheduleCopy;
    }


  },
  data: function() {
      return {
        schedule: null,
        participantNames : [],
        participants: [],
        newParticipant: null,
        startDate: null,
        nWeeks: null,
        nCycles: null,
        canGenerate: false,
        newGroupName: null,
        newGroupNameState: null,
        memberEmailState: null
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#generate-button {
    width: 70%;
    height: 50px;
    margin-bottom: 60px;
}

#open-convert {
    margin-bottom: 30px;
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
.participant-list {
  display: inline-block;
  margin: 10px 10px 10px 10px;
}
.new-group-participant-list {
  margin: 10px 10px 10px 10px;
}
a {
  color: #42b983;
}
</style>
