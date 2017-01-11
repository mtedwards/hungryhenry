function getLastFeed(){
  if(online == true) {
    axios
      .get(airtable_read_endpoint)
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
  var data = result.data.records;

  var nextSide = data[0].fields.Side;

  var buttonWrap = document.querySelector('.button-wrap');

  buttonWrap.classList.remove("Left");
  buttonWrap.classList.remove("Right");
  buttonWrap.classList.add(nextSide)

  var lastID = data[0].id;
  document.getElementById('remove').dataset.id = lastID;

  var message = '<h2>Recent Feeds</h2><table><tr><th>Start</th><th>Side</th><th>Duration</th></tr><tbody>';

  for (var i = 0; i < data.length; i++) {
    // console.log(data[i]);
    var feed = data[i].fields;
    var start = feed.Start;
    var end = feed.End;
    var side = feed.Side;
    var duration = feed.Duration;
    message += printLastFeed(start, end, side, duration);
  }
  message += '</tbody></table>';
  document.getElementById('data').innerHTML = message;
};

function printLastFeed(start, end, side, duration) {
  var myDate = new Date(start);
  var message = '<tr><td>'+pad(myDate.getHours())+':'+pad(myDate.getMinutes())+'</td><td>'+side+'</td><td>'+duration+' mins</td></tr>';
  return message;
};

var removeButton = document.getElementById('remove');

removeButton.addEventListener('click', function(e){
  e.preventDefault();
  var lastID = e.target.dataset.id;
  removeLastFeed(lastID);
});

function removeLastFeed(lastID){
  axios.delete('https://api.airtable.com/v0/appKNtqb1F4hrA3Gs/Feeds/'+lastID+'?api_key=keyt8UEserCuBu9u6', {
    "deleted": true,
    "id": lastID
  }).then(function(response) {
    setTimeout(function() {
      alert('Removed');
      makebuttons();
      getLastFeed();
      getAllFeeds();
    }, 400);
  });
};
