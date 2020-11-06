<template>
    <div>
        <b-container id="content">
            <div id="header">
                <b-row>
                    <b-col col lg="3"><h4>{{groupName}}:</h4></b-col>
                    <b-col col lg="9">
                        <b-row>
                            <b-col col lg="1">
                                <button v-on:click="prev()"><unicon name="arrow-left" fill="royalblue"></unicon></button>
                            </b-col>
                            <b-col col lg="8">
                                <p id="season-date-range">
                                <b>{{currSeason && dateFormat(currSeason.openWeek)}}</b> to 
                                <b>{{currSeason && dateFormat(currSeason.closeWeek)}}</b></p>
                            </b-col>
                            <b-col col lg="1">
                                <button v-on:click="next()"><unicon name="arrow-right" fill="royalblue"></unicon></button>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
            <br><br>
            <b-row>
                <b-col col lg="12">
                    <div id="schedule">
                        <b-row>
                            <b-col col lg="1"></b-col>
                            <b-col col lg="11">
                                <div v-if="currSeason && currSeason.blocks">
                                <b-row class="season-block" v-for="block in currSeason.blocks" v-bind:key="block.id">
                                    <b-col col lg="12">
                                        <hr>
                                        <b-row class="week" v-for="unit in block.units" v-bind:key="unit.id" v-on:click="clickScheduleUnit(unit)">
                                            <b-col col lg="4"><p>{{dateFormat(unit.start)}}</p></b-col>
                                            <b-col col lg="2"></b-col>
                                            <b-col col lg="5"><p>{{unit.participant}}</p></b-col>
                                        </b-row>
                                    </b-col>
                                </b-row>
                                </div>
                            </b-col>
                        </b-row>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>

export default {
  name: 'Schedule',
  props: {
      sch : Object,
      groupName: String
  },
  data: function() {
      return {
          currSeasonIdx: 0
      }
  },
  computed:  {
      currSeason() {
        if (this.sch != null) {
            return this.sch.seasons[this.currSeasonIdx];   
        }
        return null;
      }
  },
  methods: {
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
    prev() {
        if (this.currSeasonIdx > 0){
            this.currSeasonIdx--;
        }
    },
    next() {
        if (this.currSeasonIdx < this.sch.seasons.length-1){
            this.currSeasonIdx++;
        }
    },
    clickScheduleUnit(unit) {
        this.$emit('schedule-unit-click', unit)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.week:hover {
    background: #6e9fd88a;
}


#season-block {
    color: skyblue;
}

#week {
    color: skyblue;
    height: 100px;
}

#season-date-range {
    margin-top: 10px;
}

#content {
    width: 100%;
    height: 100%;
}

#header {
    height: 20%;
    width: 100%;
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
