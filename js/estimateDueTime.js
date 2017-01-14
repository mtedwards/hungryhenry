function getAllFeeds(){
  document.getElementById('due').innerHTML = '';
  axios
      .get(local_mysql_endpoint)
      .then(function(result) {
        feeds = result.data.feeds;
        // get the current feed start time
        now = new Date(feeds[0].start);
        currentHour = now.getHours();
        currentMin = now.getMinutes();

        // Create the hour range. Only work with feeds in a 3 hour range.
        rangeLow = currentHour - 1;
        rangeHigh = currentHour + 1;


        var diffs = [];


        for (var i = 1; i < feeds.length; i++){
          var thisStart  = moment(feeds[i].start);
          var lastStart  = moment(feeds[i-1].start);
          var timeBetween = moment.duration(lastStart.diff(thisStart));
          timeBetween = moment.duration(timeBetween).asMinutes();
          timeBetween = Number(timeBetween);
          thisStart = thisStart.hours();
          if (thisStart >= rangeLow && thisStart <= rangeHigh) {
            if((timeBetween < 30) || (timeBetween > 1000)) {} else {
              diffs.push(timeBetween);
            };
          };
        }

        var sum = diffs.reduce(function(a, b) { return a + b; });
        var avg = sum / diffs.length;

        console.log(avg);

        diffHours = Math.floor(avg/60);
        diffMins = avg%60;
        console.log(currentHour);
        nextHour = currentHour + diffHours;
        nextMin = currentMin + diffMins;
        if(nextMin > 59){
          nextHour++;
          nextMin = nextMin - 60;
        }
        if(nextMin < 10){
          nextMin = '0'+nextMin;
        }
        nextMin = nextMin.toFixed(0);
        document.getElementById('due').innerHTML = '<p>Due around '+nextHour+':'+nextMin+'</p>';
      })
      .catch(function (error) {
        console.log(error);
        document.getElementById('error').innerHTML = '<p class="error">ESTIMATE: '+error+'</p>';
      });

}
