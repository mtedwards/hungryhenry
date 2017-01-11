var api_key = 'keyt8UEserCuBu9u6';

// sort with _createdTime ??
var airtable_read_endpoint = "https://api.airtable.com/v0/appKNtqb1F4hrA3Gs/Feeds?maxRecords=8&view=Main%20View&api_key=" + api_key + "&sortField=_createdTime&sortDirection=desc";

var airtable_write_endpoint = "https://api.airtable.com/v0/appKNtqb1F4hrA3Gs/Feeds?api_key=" + api_key;

var local_mysql_endpoint = "http://localhost:3000/api/feeds";


var offset = new Date().getTimezoneOffset();
offset = offset / 60 * -100;

suboffset = offset.toString();
suboffset = suboffset.slice(-2);
suboffset = parseInt(suboffset);
suboffset = suboffset / 100;
suboffset = suboffset * 60;
if(suboffset == 0) {
  suboffset = '00';
}

offset = offset.toString();
offset = offset.slice(0, -2);
offset = parseInt(offset);

offset = offset +':'+ suboffset;


if(offset > 0) {
  offset = '+'+offset;
} else {
  offset = '-'+offset;
}

function pad ( val ) { return val > 9 ? val : "0" + val; }

var online;

if(navigator.onLine) {

  online = true;
} else {
  online = false;
}

function ISODateString(d){
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}

/****** THE CLOCK *****/

function clock() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(clock, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
};
