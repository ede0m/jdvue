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
                            <br>
                            <h5>{{groups[gId]}}</h5>
                            <br>
                            <b-row class="trade" v-for="trade in trades" v-bind:key="trade.id">
                                <b-col col lg="2"><p>{{trade.initiatorEmail}}</p></b-col>
                                <b-col col lg="1">with</b-col>
                                <b-col col lg="2"><p>{{trade.executorEmail}}</p></b-col>
                                <b-col col lg="4"><p>{{trade.id}}</p></b-col>
                                <b-col col lg="1"><a v-on:click="setTradeView(trade, gId)" v-b-modal="'view-trade-modal'">view</a></b-col>
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
                            <br>
                            <h5>{{groups[gId]}}</h5>
                            <br>
                            <b-row class="trade" v-for="trade in trades" v-bind:key="trade.id">
                                <b-col col lg="2"><p>{{trade.initiatorEmail}}</p></b-col>
                                <b-col col lg="1">with</b-col>
                                <b-col col lg="2"><p>{{trade.executorEmail}}</p></b-col>
                                <b-col col lg="4"><p>{{trade.id}}</p></b-col>
                                <b-col col lg="1"><a v-on:click="setTradeView(trade, gId)" v-b-modal="'view-trade-modal'">view</a></b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                </div>

                <b-modal id="view-trade-modal" size="lg" hide-footer>
                    <div v-if="viewTrade">
                    <b-row>

                        <b-col col lg="4">
                            <div class="view-trade-stakes">
                            <b-row><p>{{viewTrade.initiatorEmail}}</p></b-row>
                            <hr>
                            <b-row v-for="t in viewTrade.initiatorTrades" v-bind:key="t.id"><p>{{dateFormat(t.unitStart)}}</p></b-row>
                            </div>
                        </b-col>

                        <b-col col lg="4"><div id="for">
                            <unicon name="exchange" fill="black"></unicon></div>
                        </b-col>

                        <b-col col lg="4">
                            <div class="view-trade-stakes">
                            <b-row><p>{{viewTrade.executorEmail}}</p></b-row>
                            <hr>
                            <b-row v-for="t in viewTrade.executorTrades" v-bind:key="t.id"><p>{{dateFormat(t.unitStart)}}</p></b-row>
                            </div>
                        </b-col>

                    </b-row>
                    <br><br><hr>
                    <div v-if="viewTrade.status === 0">
                        <b-row id="trade-buttons">
                            <b-col @click="acknowledgeTrade(1);" col lg="6">
                                <button :disabled="!canAcceptTrade" class="trade-button" id="accept-trade">accept</button>
                            </b-col>
                            <b-col @click="acknowledgeTrade(0);" col lg="6">
                                <button class="trade-button" id="decline-trade">decline</button>
                            </b-col>
                        </b-row>
                    </div>
                    </div>
                </b-modal>

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
          groups: {},
          viewTrade: null,
          viewTradeGroupId: null,
          canAcceptTrade: false
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
                    console.log(err);
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
        Object.keys(this.scheduleTrades).forEach(gid => {
            var s = this.scheduleTrades[gid];          
            if (s.trades !== null){
                var open = s.trades.filter(t =>{
                    return t.status === 0;
                });
                if (open.length > 0){
                    openSchTrades[s.groupId] = open;
                }
            }
        })
        return openSchTrades;
    },
    executedScheduleTrades() {
        var execSchTrades = {}
        Object.keys(this.scheduleTrades).forEach(gid => {
            var s = this.scheduleTrades[gid];
            if (s.trades !== null) {
                var exec = s.trades.filter(t =>{
                    return t.status === 1;
                });
                if (exec.length > 0){
                    execSchTrades[s.groupId] = exec;
                }
            }
        })
        return execSchTrades;
    },

  },
  methods: {
    setTradeView(trade, groupId){
        this.viewTrade = trade;
        this.viewTradeGroupId = groupId;
        if (this.viewTrade.initiatorEmail !== this.user.email && this.viewTrade.status === 0){
            this.canAcceptTrade = true;
        } else {
            this.canAcceptTrade = false;
        }
    },
    acknowledgeTrade(action) {
        var sid = this.scheduleTrades[this.viewTradeGroupId].scheduleId;
        var payload = {
            TradeID : this.viewTrade.id,
            ScheduleID : sid,
            Action : action
        };
        console.log(payload);
        API.acknowledgeTrade(payload)
            .then(() => {
                notify.success('trade accepted', 'http');
            })
            .catch(err => {
                console.log(err)
            });
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.view-trade-stakes {
    margin-left: 40px;
    text-align: center;
}

.trade-button {
    width: 90%;
}

#trade-buttons {
    text-align: center;
}

#accept-trade {
    background-color: #57b189;
}

#decline-trade {
    background-color: #b15873;
}

#for {
    text-align: center;
    margin-top: 30px;
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
