<template>
    <div>
        <b-row>
            <b-col col lg="12">
                <b-row>
                    <h4>open</h4>
                </b-row>
                <hr><br>
                <div v-if="scheduleTrades">
                    <b-row class="schedule" v-for="(trades, gId) in openScheduleTrades" v-bind:key="gId">
                        <b-col col lg="12">
                            <h5>{{groups[gId]}}</h5>
                            <br>
                            <b-row class="trade" v-for="trade in trades" v-bind:key="trade.id">
                                <b-col col lg="2"><p>{{trade.initiatorEmail}}</p></b-col>
                                <b-col col lg="1">with</b-col>
                                <b-col col lg="2"><p>{{trade.executorEmail}}</p></b-col>
                                <b-col col lg="4"><p>{{trade.id}}</p></b-col>
                                <b-col col lg="1"><a href="noob">view</a></b-col>
                            </b-row>
                            <hr>
                        </b-col>
                    </b-row>
                </div>

                <br><br>
                <b-row>
                    <h4>executed</h4>
                </b-row>
                <hr><br>
                <div v-if="scheduleTrades">
                    <b-row class="schedule" v-for="(trades, gId) in executedScheduleTrades" v-bind:key="gId">
                        <b-col col lg="12">
                            <h5>{{groups[gId]}}</h5>
                            <br>
                            <b-row class="trade" v-for="trade in trades" v-bind:key="trade.id">
                                <b-col col lg="2"><p>{{trade.initiatorEmail}}</p></b-col>
                                <b-col col lg="1">with</b-col>
                                <b-col col lg="2"><p>{{trade.executorEmail}}</p></b-col>
                                <b-col col lg="4"><p>{{trade.id}}</p></b-col>
                                <b-col col lg="1"><a href="noob">view</a></b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </div>

            </b-col>
        </b-row>
    </div>
</template>

<script>
import store from '../services/store'
import API from '../services/api'
import notify from '../services/notify'

export default {
  name: 'Trades',
  data: function() {
      return {
          scheduleTrades: null,
          groups: {}
      }
  },
  created: function() {
      if (this.user != null) {
          // create group map
          this.user.groups.forEach(g => {
            this.groups[g.id] = g.name;
          });
          // fetch user trades and groups on load
          API.getTrades(this.user.id)
                .then(res => {
                    this.scheduleTrades = res.data.userGroupTrades;
                })
                .catch(err => {
                    notify.err('trade fetch failed', 'http');
                    console.log(err)
                });
                
      } else {
          this.$router.push("/login");
      }
  },
  computed:  {
    user() {
        return store.getters.user();
    },
    openScheduleTrades() {
        var openSchTrades = {}
        Object.keys(this.scheduleTrades).forEach(sid => {
            var s = this.scheduleTrades[sid];
            var open = s.trades.filter(t =>{
                return t.status === 0;
            });
            if (open.length > 0){
                openSchTrades[s.groupId] = open;
            }
        })
        console.log(openSchTrades);
        return openSchTrades;
    },
    executedScheduleTrades() {
        var execSchTrades = {}
        Object.keys(this.scheduleTrades).forEach(sid => {
            var s = this.scheduleTrades[sid];
            var exec = s.trades.filter(t =>{
                return t.status === 1;
            });
            if (exec.length > 0){
                execSchTrades[s.groupId] = exec;
            }
        })
        return execSchTrades;
    },

  },
  methods: {

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

#content {
    width: 100%;
    height: 100%;
}

#header {
    height: 20%;
    width: 100%;
}

.trade {
    margin-left: 30px;
}

.trade-list {
  display: inline-block;
  margin: 10px 10px 10px 10px;
}

h4 {
    margin-left: 40px;
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
