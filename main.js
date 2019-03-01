const channels = ['Call of Duty','BeyondTheSummit', 'PlayHearthstone', 'Giantwaffle', 'Sloot','skill4ltu','MacieJay','LIRIK','FortniteLlamaHunter','TFBlade','TeePee','Poko','XFL_Monkey','Ronnie2k','R9Rai','Dashy','ZeRo', 'NairoMK','TehJamJar','DatModz','FIFA_Abe','CalebDMTG','Warcraft', 'Swifty','nl_Kripp', 'TwitchPresents','Doublelift', 'H1ghsky1', 'KabajiOW', 'chocoTaco', 'Kaymind'];
channels.forEach((data) => {
  $.getJSON(`https://api.twitch.tv/kraken/streams/${data}?client_id=xe5g4cpvq2c7p5kug17vy8wlc0yr1a`, (json) => {
    if(json.stream) {
      $('#avaButtons').append(`
        <div class="col-12" id="setDiv">
          <p class="lead">
            <button onClick="pickedChannel('${json.stream.channel.display_name}')"><a href="desktop.html" class="btn btn-lg btn-secondary" id="channelPicked" value="${json.stream.channel.name}">${json.stream.game}</a></button>
          </p>
        </div>
      `)
    }
  });
});
let picked;
function pickedChannel(data)
{
  // console.log(data)
  localStorage.clear();
  localStorage.setItem('pickedGame', data);
}

var retrievedObject = localStorage.getItem('pickedGame');
localStorage.clear();

// console.log(retrievedObject);

// var cookieValue = document.getElementById('check').getAttribute('value');
var cookieValue = retrievedObject;

// Loop through streams array and make an AJAX request for each item
let checker = [];
checker.push(cookieValue);

const streams = [];

if(checker.length > 0)
{
  streams.push(checker[checker.length-1]);
}
else 
{
  streams = [];
  streams.push(cookieValue);
}
// streams.push(cookieValue);

streams.forEach((item) => {
  console.log(streams)
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
    // Append offline streamers to offline div
    } else {
      $.getJSON(`https://api.twitch.tv/kraken/streams/${item}?client_id=xe5g4cpvq2c7p5kug17vy8wlc0yr1a`, (json) => {
        $('#offline').append(`
          <div class="col-12">
            <div class="row">
              <div class="col-4 col-sm-2">
                <img src="${json.logo}">
              </div>
              <div class="col-12 col-sm-12">
                <h3><a href="${json.url}" target="_blank">${json.name}</a></h3>
                <p>Offline</p>
              </div>
            </div>
          </div>
        `);
        
      // Append inactive accounts to offline div with a message
      }).fail(() => {
        $('#offline').append(`
          <div class="col-12">
            <div class="row">
              <div class="col-12 col-sm-12">
                <h3>${item}</h3>
                <p>Not a Twitch user...</p>
              </div>
            </div>
          </div>
        `);
      });
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
  
  // Append offline message if no streamers are offline
  // if ($('#offline').children().length === 0) {
  //   $('#online').append(`
  //     <div class="col-12">
  //       <p>Everyone is <a href="#online">online</a>! Go watch some streams.</p>
  //     </div>
  //   `);
  // }
  
  // // Append search suggestions to search div
  // if ($('#search').children().length === 0) {
  //   $('#search').append(`
  //     <div class="col-12">
  //       <p>Try searching for a game. Some suggestions are:</p>
  //       <ul>
  //         <li>World of Warcraft</li>
  //         <li>Hearthstone</li>
  //         <li>Starcraft 2</li>
  //         <li>Heroes of the Storm</li>
  //       </ul>
  //     </div>
  //   `);
  // }
  
  // Online tab click handler
  $('a[href="#online"]').on('click', (event) => {
    // Prevent default browser behavior (navigating to the #online div)
    event.preventDefault();
    $('a[href="#online"]').tab('show');
  });

  // Offline tab click handler
  $('a[href="#offline"]').on('click', (event) => {
    // Prevent default browser behavior (navigating to the #offline div)
    event.preventDefault();
    $('a[href="#offline"]').tab('show');
  });

  // Search tab click handler
  $('a[href="#search"]').on('click', (event) => {
    // Prevent default browser behavior (navigating to the #search div)
    event.preventDefault();
    $('a[href="#search"]').tab('show');
  });

  // Show search tab on form click
  $('form').on('click', () => {
    $('a[href="#search"]').tab('show');
  });
});

// Add delegated click handlers to online buttons
$('#online').on('click', 'button', (event) => {
  const id = $(event.target).attr('href');
  const name = $(event.target).val();
  
  // Live button
  if ($(event.target).text() === 'Click To Start') {
    // Close previously opened panel
    if ($('.btn:contains("Hide")').length === 1) {
      $('.btn:contains("Hide")').text('Click To Start');
      $('.collapse:has("iframe")').collapse('hide').empty();
    }
    // Change button name to "Hide"
    // $(event.target).text('Hide');

    // Append iframe into collapse div
    // height="${((($('#online').width() - 30) * 9) / 16)}"
    //     width="${($('#online').width() - 30)}"
    $(id).append(`
      <iframe
        src="https://player.twitch.tv/?channel=${name}"
        height="${((($('#online').width() - 30) * 9) / 10)}"
        width="${($('#online').width() - 30)}"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true">
      </iframe>
    `);
    // Make iframe responsive
    $(window).on('resize', () => {
      $('iframe').width($('#online').width() - 30);
      $('iframe').height((($('#online').width() - 30) * 9) / 16);
      $(id).width($('iframe').width());
      $(id).height($('iframe').height());
    });
    // Start collapse animation
    $(id).collapse('show');
    // Fix container size after animation
    $(id).on('webkitTransitionEnd oTransitionEnd transitionend', () => {
      $(id).width($('iframe').width());
      $(id).height($('iframe').height());
    });
  }
  
  // Hide button
  // if ($(event.target).text() === 'Hide') {
  //   if ($(id).hasClass('collapsing') === false) {
  //     $(id).collapse('hide').empty();
  //     $(event.target).text('Click To Start');
  //   }
  // }
});

// Form submit handler


// $('form').on('submit', (event) => {
//   event.preventDefault();
//   // Clear previous search results
//   if ($('#search').children().length > 0) {
//     $('#search').empty();
//   }
  
//   // Show search suggestions if search field is empty and exit the function
//   if ($('input').val() === '') {
//     $('#search').append(`
//       <div class="col-12">
//         <p>Try searching for a game. Some suggestions are:</p>
//         <ul>
//           <li>World of Warcraft</li>
//           <li>Hearthstone</li>
//           <li>Starcraft 2</li>
//           <li>Heroes of the Storm</li>
//         </ul>
//       </div>
//     `);
//     return;
//   }
//   // AJAX request
//   const query = encodeURIComponent($('input').val());
//   $.getJSON(`https://api.twitch.tv/kraken/search/streams?query=${query}&client_id=vyuxu8oc2zuvwa0yau9e6jo2sq2li9`, (json) => {
//     if (json._total === 0) {
//       $('#search').append(`
//         <div class="col-12">
//           <p>Bummer! No results. Try searching for something else.</p>
//         </div>
//       `);
//     } else {
//       json.streams.forEach((item) => {
//         // Only append results that are not already in the online div
//         if ($(`#${item.channel.name}`).length === 0) {
//           $('#search').append(`
//             <div class="col-12">
//               <div class="row">
//                 <div class="col-4 col-sm-2">
//                   <img src="${item.channel.logo || 'img/glitch.png'}">
//                 </div>
//                 <div class="col-8 col-sm-10">
//                   <h3><a href="${item.channel.url}" target="_blank">${item.channel.display_name}</a></h3>
//                   <p>${item.channel.status}</p>
//                   <p>Streaming ${item.game} for ${item.viewers} viewers</p>
//                   <button class="btn" value="${item.channel.name}" href="#${item.channel.name}">Click To Start</button>
//                 </div>
//               </div>
//               <div class="collapse" id="${item.channel.name}" style="background: #000"></div>
//             </div>
//           `);
//         }
//       });
//     }
//   });
  
//   // Clear input field
//   $('input').val('');
// });

// // Add delegated click handlers to search result buttons
// $('#search').on('click', 'button', (event) => {
//   const id = $(event.target).attr('href');
//   const name = $(event.target).val();
  
//   // Live button
//   if ($(event.target).text() === 'Click To Start') {
//     // Close previously opened panel
//     if ($('.btn:contains("Hide")').length === 1) {
//       $('.btn:contains("Hide")').text('Click To Start');
//       $('.collapse:has("iframe")').collapse('hide').empty();
//     }
//     // Change button name to "Hide"
//     $(event.target).text('Hide');
//     // Append iframe into collapse div
//     $(id).append(`
//       <iframe
//         src="https://player.twitch.tv/?channel=${name}"
//         height="${((($('#search').width() - 30) * 9) / 16)}"
//         width="${($('#search').width() - 30)}"
//         frameborder="0"
//         scrolling="no"
//         allowfullscreen="true">
//       </iframe>
//     `);
//     // Make iframe responsive
//     $(window).on('resize', () => {
//       $('iframe').width($('#search').width() - 30);
//       $('iframe').height((($('#search').width() - 30) * 9) / 16);
//       $(id).width($('iframe').width());
//       $(id).height($('iframe').height());
//     });
//     // Start collapse animation
//     $(id).collapse('show');
//     // Fix container size after animation
//     $(id).on('webkitTransitionEnd oTransitionEnd transitionend', () => {
//       $(id).width($('iframe').width());
//       $(id).height($('iframe').height());
//     });
//   }
  
//   // Hide button
//   // if ($(event.target).text() === 'Hide') {
//   //   if ($(id).hasClass('collapsing') === false) {
//   //     $(event.target).text('Click To Start');
//   //     $(id).collapse('hide').empty();
//   //   }
//   // }
// });
