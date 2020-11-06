<template>
    <div>
        <b-row>
            <button @click="toggleTrader" id="trade-button">{{tradeButtonLabel}}</button>
        </b-row>
        
        <b-row align-h="center" class="trade-form">
            <div v-if="showTrader">
                <b-col col lg="12">
                    <br><hr><br>
                    <!-- tradeFor -->
                    <p>trading for: </p><br>
                    <b-row align-h="center">
                        <b-col col lg="4"><button class="add-unit-button" @click="addTradeForUnit()"><span>+</span></button></b-col>
                        <b-col col lg="7"><input class="schedule-unit-input" v-bind:class="{invalid: tradeForUnitInvalid}" type="text" v-model="tradeUnitDate" placeholder="select unit" :disabled="true"></b-col>
                    </b-row>
                    <br>
                    <ul>
                        <li class="trade-list" v-for="(p, i) in tradeFor" :key="i">
                            {{ dateFormat(p.start) }}<unicon @click="removeUnit(i, tradeFor)" class="remove" name="times" fill="royalblue"></unicon>
                        </li>
                    </ul>
                    <br>
                    <hr>
                    <br>

                    <!-- tradeAway -->
                    <p>trading away: </p><br>
                    <b-row align-h="center">
                        <b-col col lg="4"><button class="add-unit-button" @click="addTradeAwayUnit()"><span>+</span></button></b-col>
                        <b-col col lg="7"><input class="schedule-unit-input" v-bind:class="{invalid: tradeAwayUnitInvalid}" type="text" v-model="tradeUnitDate" placeholder="select unit" :disabled="true"></b-col>
                    </b-row>
                    <br>
                    <ul>
                        <li class="trade-list" v-for="(p, i) in tradeAway" :key="i">
                            {{ dateFormat(p.start) }}<unicon @click="removeUnit(i, tradeAway)" class="remove" name="times" fill="royalblue"></unicon>
                        </li>
                    </ul>

                    <br><hr><br>
                    <button @click="submitTrade()" :disabled='!canTrade' id="submit-button">submit</button>
                    
                    <b-row>

                    </b-row>

                </b-col>
            </div>
        </b-row>
    </div>
</template>

<script>
import store from '../services/store'
import API from '../services/api'
import notify from '../services/notify'

export default {
  name: 'Trader',
  props: {
    selectedScheduleUnit: Object
  },
  data: function() {
      return {
          tradeButtonLabel: "propose trade",
          tradeFor: [],
          tradeAway: [],
          tradeForUnitInvalid: false,
          tradeAwayUnitInvalid: false,
          showTrader: false,
          canTrade: false,
          executorEmail: null
      }
  },
  computed:  {
      tradeUnitDate() {
        if (this.selectedScheduleUnit != null){
            return this.dateFormat(this.selectedScheduleUnit.start);
        }
        return null;
      },
      tradeUnitId() {
        if (this.selectedScheduleUnit != null){
            return this.dateFormat(this.selectedScheduleUnit.id);
        }
        return null;
      },
      user() {
          return store.getters.user();
      }
  },
  methods: {
    toggleTrader() {
        this.showTrader = !this.showTrader;
        if (this.showTrader){
            this.tradeButtonLabel = "cancel trade";
        } else {
            this.tradeButtonLabel = "propose trade";
            this.clearTrade();
        }
    },
    dateFormat(ds) {
        var d = new Date(ds);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var day = d.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return month + '-' + day + '-' + year;
    },
    addTradeForUnit() {
        this.tradeForUnitInvalid = false;
        if (this.tradeFor.length > 0) {
            // can only trade with one participant at a time.
            var found = this.tradeFor.some(e => e.id === this.selectedScheduleUnit.id);
            if (this.selectedScheduleUnit.participant === this.executorEmail && !found){
                this.tradeFor.push(this.selectedScheduleUnit);
            } else {
                this.tradeForUnitInvalid = true;
            }
        } else {
            // cannot trade for a unit you own
            if (this.selectedScheduleUnit.participant === this.user.email){
                this.tradeForUnitInvalid = true;
            } else {
                this.tradeFor.push(this.selectedScheduleUnit);
                this.executorEmail = this.tradeFor[0].participant
            }
        }
        this.checkCanTrade()
    },
    addTradeAwayUnit() {
        this.tradeAwayUnitInvalid = false;
        // can only trade away your own units
        if (this.user.email === this.selectedScheduleUnit.participant){
            this.tradeAway.push(this.selectedScheduleUnit);
        } else {
            this.tradeAwayUnitInvalid = true;
        }
        this.checkCanTrade()
    },
    removeUnit(idx, list) {
        list.splice(idx, 1);
        if (list.length === 0 && list === this.tradeFor){
            this.executorEmail = null;
        }
        this.checkCanTrade()
    },
    checkCanTrade() {
        if (this.tradeFor.length > 0 && this.tradeAway.length > 0){
            this.canTrade = true;
        } else {
            this.canTrade = false;
        }
    },
    clearTrade() {
        this.tradeFor = [];
        this.tradeAway = [];
        this.selectedScheduleUnit = null;
        this.tradeForUnitInvalid = false;
        this.tradeAwayUnitInvalid = false;
        this.canTrade = false;
    },
    submitTrade() {
        var sch = store.getters.currentGroupSchedule()
        let tradeAwayIds = this.tradeAway.map(u => u.id);
        let tradeForIds = this.tradeFor.map(u => u.id);
        var payload = {
            ScheduleId : sch.id,
            InitiatorEmail : this.user.email,
            ExecutorEmail : this.executorEmail,
            InitiatorTrades: tradeAwayIds,
            ExecutorTrades: tradeForIds
        };
        API.createTrade(payload)
            .then(() => {
                notify.success('trade proposed', 'http');
                this.clearTrade();
            })
            .catch(err => {
                console.log(err)
            });
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#trade-button {
    width: 35%;
    height: 35px;
    margin: 0 auto;
}

.trade-form {
    margin-top: 20px;
}

.add-unit-button {
    width: 80%;
}

.schedule-unit-input {
    width: 100%;
    margin-right: 10px;
}

#submit-button {
    width: 70%;
    height: 40px;
    margin-bottom: 60px;
}

.invalid {
    border: 2px solid red;
    background-color:pink;
}

#generate-button {
    width: 70%;
    height: 50px;
    margin-bottom: 60px;
}

#content {
    width: 100%;
    height: 100%;
}

#header {
    height: 20%;
    width: 100%;
}

.trade-list {
  display: inline-block;
  margin: 10px 10px 10px 10px;
}

h3 {
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
