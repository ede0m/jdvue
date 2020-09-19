<template>
    <div>
        <b-container id="content">
            <div id="header">
                <b-row>
                    <b-col col lg="1"><h2>{{groupName}}:</h2></b-col>
                    <b-col col lg="10">
                        <p id="season-date-range">
                        <b>{{currSeason && dateFormat(currSeason.openWeek)}}</b> to 
                        <b>{{currSeason && dateFormat(currSeason.closeWeek)}}</b> 
                        </p>
                    </b-col>
                </b-row>
            </div>
            <br><br>
            <b-row>
                <b-col col lg="7">
                    <div id="schedule">
                        <p>{{JSON.stringify(currSeason)}}</p>
                        <b-row>
                            <b-col></b-col>
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
