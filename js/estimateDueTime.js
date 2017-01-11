function getAllFeeds(){
  document.getElementById('due').innerHTML = '';
  axios
      .get('https://api.airtable.com/v0/appKNtqb1F4hrA3Gs/Feeds?maxRecords=100&view=Main%20View&api_key=keyt8UEserCuBu9u6&sortField=_createdTime&sortDirection=desc')
      .then(function(result) {

        feeds = result.data.records;
        // get the current feed start time
        now = new Date(feeds[0].fields.Start);
        currentHour = now.getHours();
        currentMin = now.getMinutes();

        // Create the hour range. Only work with feeds in a 3 hour range.
        rangeLow = currentHour - 1;
        rangeHigh = currentHour + 1;


        var diffs = [];

        // loop through each feed
        for (var i = 1; i < feeds.length; i++){

          feed = feeds[i].fields;
          start  = new Date(feed.Start);

          // get the start hour of THIS feed.
          startHour = start.getHours();

          // Does this Feed fall into our range?
          if (startHour >= rangeLow && startHour <= rangeHigh) {

            // Get the feed before this to make sure this isn't the second half of a feed
            h = i + 1;

            if(h != 100) {

              prevStart = new Date(feeds[h].fields.Start);

              prevDiff = getTimeDiff(start, prevStart);

              // Get the feed after this to get the difference.
              j = i - 1;
              nextFeed = feeds[j].fields;
              nextStart = new Date(nextFeed.Start);

              diff = getTimeDiff(start, nextStart);

              if(diff > 30 ){
                // console.log('This feed start at '+ startHours+':'+startMinutes);
                // console.log('The next start at '+ nextHours+':'+nextMinutes);
                // console.log('That is '+diff+ ' mins between');
                // console.log(' ');
                diffs.push(diff);
              }
            }
          }
        }

        var diffTotal = 0;
        for (var i = 0; i < diffs.length; i++){
          diffTotal += diffs[i];
        }
        diffAvg = diffTotal / diffs.length
        diffAvg = Math.round( diffAvg);

        diffHours = Math.floor(diffAvg/60);
        diffMins = diffAvg%60;



        nextHour = currentHour + diffHours;
        nextMin = currentMin + diffMins;
        if(nextMin > 59){
          nextHour++;
          nextMin = nextMin - 60;
        }
        if(nextMin < 10){
          nextMin = '0'+nextMin;
        }
        document.getElementById('due').innerHTML = '<p>Due around '+nextHour+':'+nextMin+'</p>';
      })
      .catch(function (error) {
        console.log(error);
        document.getElementById('error').innerHTML = '<p class="error">ESTIMATE: '+error+'</p>';
      });

}


function getTimeDiff(start, nextStart){
  startHours = pad(start.getHours());
  startMinutes = pad(start.getMinutes());

  nextHours = pad(nextStart.getHours());
  nextMinutes = pad(nextStart.getMinutes());

  diff = ((nextHours - startHours) * 60) + (nextMinutes - startMinutes);


  return diff;
}
