function getLastFeed(){
  if(online == true) {
    axios
      .get(local_mysql_readrecent_endpoint)
      .then(function(result) {

        processLastFeedResults(result);
        localStorage.setItem('last8', JSON.stringify(result));
      });
  } else {
    result = localStorage.getItem('last8');
    result = JSON.parse(result);
    processLastFeedResults(result);
  }
};

function processLastFeedResults(result){
  document.getElementById('data').innerHTML = '';
  var data = result.data.feeds;
  

  var nextSide = data[0].side;

  var buttonWrap = document.querySelector('.button-wrap');

  buttonWrap.classList.remove("Left");
  buttonWrap.classList.remove("Right");
  buttonWrap.classList.add(nextSide)

  var lastID = data[0].id;
  document.getElementById('remove').dataset.id = lastID;

  var message = '<h2>Recent Feeds</h2><table><tr><th>Start</th><th>Side</th><th>Duration</th></tr><tbody>';

  for (var i = 0; i < data.length; i++) {
    // console.log(data[i]);
    var feed = data[i];
    var start = feed.start;
    var end = feed.end;
    var side = feed.side;
    // var duration = feed.Duration;
    var startTime = moment(start); //todays date
    var endTime = moment(end); // another date
    var duration = moment.duration(endTime.diff(startTime));
    var mins = moment.duration(duration, "seconds").humanize();
    var id = feed.id;
    // mins = mins.toFixed(2);
    // console.log(mins);
    // var duration = mins;
    message += printLastFeed(start, end, side, mins, id);
  }
  message += '</tbody></table>';
  document.getElementById('data').innerHTML = message;
};

function printLastFeed(start, end, side, duration, id) {
  var myDate = new Date(start);
  var message = '<tr id="feed-'+id+'"><td>'+pad(myDate.getHours())+':'+pad(myDate.getMinutes())+'</td><td>'+side+'</td><td>'+duration+'</td></tr>';
  return message;
};

var removeButton = document.getElementById('remove');

removeButton.addEventListener('click', function(e){
  e.preventDefault();
  var lastID = e.target.dataset.id;
  removeLastFeed(lastID);
});

function removeLastFeed(lastID){
  axios.delete(local_mysql_endpoint+'/'+lastID, {
  }).then(function(response) {
    setTimeout(function() {
      alert('Removed');
      makebuttons();
      getLastFeed();
      getAllFeeds();
    }, 400);
  });
};
