// array to store channels users can view
// note that for new games channels will be added every month manually
const channels = ['Call of Duty','StreamerHouse','EdEMonster','Ninja','BeyondTheSummit', 'PlayHearthstone', 'Giantwaffle', 'Sloot','skill4ltu','MacieJay','LIRIK','FortniteLlamaHunter','TFBlade','TeePee','Poko','XFL_Monkey','Ronnie2k','R9Rai','Dashy','ZeRo', 'NairoMK','TehJamJar','DatModz','FIFA_Abe','CalebDMTG','Warcraft', 'Swifty','nl_Kripp', 'TwitchPresents','Doublelift', 'H1ghsky1', 'KabajiOW', 'chocoTaco', 'Kaymind'];
// for each channel send a request to Twitch api to get json back with information to display
// below is the format the info will return to
channels.forEach((data) => {
  $.getJSON(`https://api.twitch.tv/kraken/streams/${data}?client_id=xe5g4cpvq2c7p5kug17vy8wlc0yr1a`, (json) => {
    if(json.stream) {
      $('#avaButtons').append(`
        <div class="col-12" id="setDiv">
          <p class="lead">
            <button class="btn btn-design5" onClick="pickedChannel('${json.stream.channel.display_name}')">
            <a href="desktop.html" class="btn btn-lg btn-secondary" id="channelPicked" value="${json.stream.channel.name}">${json.stream.game}</a></button>
          </p>
        </div>
      `)
    }
  });
});
// us localstorage to store picked game user choose to view
// this is to fix if user refresh the page and the channel will still be stored to show feed
let picked;
function pickedChannel(data)
{
  localStorage.clear();
  localStorage.setItem('pickedGame', data);
}
// once button is clicked to view a game the function above gets performed to get channel name and then get live feed
var retrievedObject = localStorage.getItem('pickedGame');
// localStorage.clear();

var cookieValue = retrievedObject;

let checker = [];
checker.push(cookieValue);
// push the channel name to this array to use later
const streams = [];
// push to streams array the most recent game picked
if(checker.length > 0)
{
  streams.push(checker[checker.length-1]);
}
else 
{
  streams = [];
  streams.push(cookieValue);
}
// connect to api and get stream back with info
streams.forEach((item) => {
  // console.log(streams)
  $.getJSON(`https://api.twitch.tv/kraken/streams/${item}?client_id=xe5g4cpvq2c7p5kug17vy8wlc0yr1a`, (json) => {
    // Append online streamers to online div
    if (json.stream) {
      $('#online').append(`
        <div class="col-12">
          <div class="row">
            <div class="col-12 col-sm-12" id="hidden-div">
              
              <button class="btn" value="${json.stream.channel.name}" href="#${json.stream.channel.name}" onclick="getElementById('hidden-div').style.display = 'block'; this.style.display = 'none'">Click To Start</button>
            </div>
          </div>
          <div class="collapse" id="${json.stream.channel.name}" style="background: #000"></div>
        </div>
      `);
      
      $("#holder").append(`
        <div class="col-12">
          <h3>Channel Name: ${json.stream.channel.display_name}</h3>
          <p>Streaming ${json.stream.game}</p>
          <p>Total viewers: ${json.stream.viewers}</p>
        </div>
      `);
    } 
  });
});

// Run once all AJAX requests have been resolved
$(document).ajaxStop(() => {
  // Append online message if no streamers are online
  if ($('#online').children().length === 0) {
    $('#online').append(`
      <div class="col-12">
        <p>Nobody is online! Try <a href="#search">searching</a> for a stream.</p>
      </div>
    `);
  }
  
  // Online tab click handler
  $('a[href="#online"]').on('click', (event) => {
    // Prevent default browser behavior (navigating to the #online div)
    event.preventDefault();
    $('a[href="#online"]').tab('show');
  });
});

// Add delegated click handlers to online buttons
$('#online').on('click', 'button', (event) => {
  const id = $(event.target).attr('href');
  const name = $(event.target).val();
  
  // Live button to start feed 
  if ($(event.target).text() === 'Click To Start') {
    // Close previously opened panel
    if ($('.btn:contains("Hide")').length === 1) {
      $('.btn:contains("Hide")').text('Click To Start');
      $('.collapse:has("iframe")').collapse('hide').empty();
    }
    $(id).append(`
      <iframe
        src="https://player.twitch.tv/?channel=${name}"
        height="${((($('#online').width() - 30)))}"
        width="${($('#online').width() - 30)}"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true">
      </iframe>
    `);
    // Make iframe responsive to view stream
    $(window).on('resize', () => {
      $('iframe').width($('#online').width() - 30);
      $('iframe').height((($('#online').width() - 30)));
      $(id).width($('iframe').width());
      $(id).height($('iframe').height());
    });
    // Start collapse animation (click button is hidden after clicked and iframe shows)
    $(id).collapse('show');
    // Fix container size after animation
    $(id).on('webkitTransitionEnd oTransitionEnd transitionend', () => {
      $(id).width($('iframe').width());
      $(id).height($('iframe').height());
    });
  }
});

