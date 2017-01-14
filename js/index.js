feedHenry();


// We will use these later... lets just use 1 for now.
var user_id = 1;

function feedHenry(){
  clock();
  checkButtons();
  getLastFeed();
  getAllFeeds();
};



// Is there currently a Start Time Stored i.e. is it currently running
function checkButtons(){
  if(localStorage.getItem('startTime') === null) {
    makebuttons();
  } else {
    countup();
    makeStopButton();
    document.getElementsByTagName("body")[0].classList.toggle('active');
  }
}


// Lets create some buttons.
function makebuttons(){
  document.getElementById('buttons').innerHTML = '';
  var buttons ='<H2>Start Feed</H2><div class="button-wrap"><button class="button" data-side="Left">LEFT</button><button class="button" data-side="Right">Right</button></div>';
  document.getElementById('buttons').innerHTML = buttons;
};

document.querySelector('.buttons').addEventListener('click', function(event) {
  if(event.target.className == 'stop') {
    var start = localStorage.getItem('startTime');
    var side = localStorage.getItem('side');

    var today = new Date();
    var end = moment().format();
    createRecord(start, end, side);
    document.getElementsByTagName("body")[0].classList.toggle('active');
  } else {
    var side = event.target.dataset.side;
    countup();
    makeStopButton();
    storeStartDetails(side)
    document.getElementsByTagName("body")[0].classList.toggle('active');
  }

});


// WHEN WE START, Show the Stop Button

function storeStartDetails(side){
  var today = new Date();
  // Create the Start Date
  var date = moment().format();
  console.log(date);
  localStorage.setItem('startTime', date);
  localStorage.setItem('side', side);
}

function makeStopButton(){
  document.getElementById('buttons').innerHTML = '';

  var button ='<div class="button-wrap"><button class="stop">STOP</button></div>';

  document.getElementById('buttons').innerHTML = button;
};

// When We Start Count up the time we have been feeding

function countup(){
      var sec = 0;
      var testCount = setInterval( function(){
        var today = new Date();
        // Create the Start Date
        var currentDateTime = moment().format();

        var startDateTime = localStorage.getItem('startTime');

        var d1 = new Date(currentDateTime),
            d2 = new Date(startDateTime);

        diff = d2 - d1;

        sec = diff * -0.001;

        document.getElementById("seconds").innerHTML = pad(sec%60);
        document.getElementById("minutes").innerHTML = pad(parseInt(sec/60,10));
      }, 1000);
};





// When we finish:  SEND THE DATA TO DATABASE

function createRecord(start, end, side){
  console.log('Start: '+start+' End: '+end+' Side: '+side);

  axios.post(local_mysql_write_endpoint, {
      "created": moment().format(),
      "start": start,
      "end": end,
      "side": side,
      "user_id": 1
  })
  .then(function(response) {
    makebuttons();
    // give it a little bit for data to hit AirTable
    console.log(response.data.Message);
    setTimeout(function() {
      if(!alert('Recorded')){window.location.reload();}
      localStorage.removeItem('startTime');
      localStorage.removeItem('side');
    }, 400);
  })
  .catch(function (response) {
    console.log(response);
    errorMsg = '<p class="error">'+error.data.error.message+'</p>';
    document.getElementById('error').innerHTML = errorMsg;
  });
};



function CancelFeed(){
  localStorage.removeItem('startTime');
  localStorage.removeItem('side');
  window.location.reload();
}

document.querySelector('.cancelFeed').addEventListener('click', function(event) {
  event.preventDefault();
  CancelFeed();
});
