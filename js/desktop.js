// Be sure to replace empty strings with your own App's Publish & Subscribe keys
// otherwise the demo keys will be used.
let userPubKey = '' || 'pub-c-787b13f5-20e2-494e-a8ff-c1f526d4cb99';
let userSubKey = '' || 'sub-c-a278f356-36f6-11e9-b682-2a55d2175413';

// Make a jQuery sort for the chat log based on message timetoken (tt)
jQuery.fn.sortDomElements = (function() {
    return function(comparator) {
        return Array.prototype.sort.call(this, comparator).each(function(i) {
              this.parentNode.appendChild(this);
        });
    };
})();

var cookieValue = document.getElementById('check').getAttribute('value');
// console.log(cookieValue)

var generatePerson = function(online) {

    var person = {};

    var names = "Guest".split(" ");

    var nums = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15".split(" ");
    
    var avatars = [
        'images/png/001-boy.png',
        'images/png/002-girl.png',
        'images/png/003-man.png',
        'images/png/004-girl-1.png',
        'images/png/005-girl-2.png',
        'images/png/006-girl-3.png',
        'images/png/007-avatar.png',
        'images/png/008-avatar-1.png',
        'images/png/009-avatar-2.png',
        'images/png/010-avatar-3.png',
        'images/png/011-avatar-4.png',
        'images/png/012-avatar-5.png',
        'images/png/013-avatar-6.png',
        'images/png/014-avatar-7.png',
        'images/png/015-avatar-8.png',
    ];
    
    person.first = names[Math.floor(Math.random() * names.length)];
    person.last = nums[Math.floor(Math.random() * nums.length)];


    person.full = [person.first, person.last].join(" ");
    person.uuid = new Date().getTime();

    person.avatar = avatars[Math.floor(Math.random() * avatars.length)];

    person.online = online || false;

    person.lastSeen = Math.floor(Math.random() * 60);

    return person;

}


var app = {
    messageToSend: '',
    ChatEngine: false,
    me: false,
    chat: false,
    users: [],
    messages: [],
    init: function() {

        // Make sure to import ChatEngine first!
        this.ChatEngine = ChatEngineCore.create({
            publishKey: userPubKey,
            subscribeKey: userSubKey
        }, {
            // this can make your broswer slooow
            debug: true,
            globalChannel: 'chat-engine-desktop-demo'
        });

        let newPerson = generatePerson(true);

        this.ChatEngine.connect(newPerson.uuid, newPerson);

        this.cacheDOM();

        this.ChatEngine.on('$.ready', function(data) {
            app.ready(data);
            // app.simulateOfflineUsers();
            app.bindMessages();
            app.bindUsers();
        });

    },
    // simulateOfflineUsers: function() {

    //     for (var j = 3; j > 0; j--) {
    //         var tempPerson = generatePerson(false);

    //         var ceTemp = new this.ChatEngine.User(tempPerson.uuid, tempPerson);

    //         this.users.push(ceTemp)
    //     }

    //     this.renderUsers();

    // },
    ready: function(data) {
        this.me = data.me;
        this.chat = new this.ChatEngine.Chat(cookieValue);
        // console.log(cookieValue)
        // console.log(fromSelect);
        //// UNCOMMENT code below to enbale the 'markdown-plugin'
        //// also the `.plugin(markdown);` line chained to `this.chat.search`
        // const markdown = ChatEngineCore.plugin['chat-engine-markdown']();
        // this.chat.plugin(markdown);

        // // UNCOMMENT code below to leverage PubNub's MSG History feature
        // this.chat.on('$.connected', () => {
        
        //     // search for 50 old `message` events
        //     this.chat.search({
        //         'reverse': true,
        //         event: 'message',
        //         limit: 50
        //     }).on('message', (data) => {
        //       // when messages are returned, render them like normal messages
        //       app.renderMessage(data, true);
        
        //     })
        //     //.plugin(markdown);
        
        // });

        this.bindEvents();

        // add the typing indicator plugin
        let config = { timeout: 2000 };
        const typingIndicator = ChatEngineCore.plugin['chat-engine-typing-indicator'](config);
        this.chat.plugin(typingIndicator);

        this.renderUserTyping();
    },
    cacheDOM: function() {
        this.$chatHistory = $('.chat-history');
        this.$button = $('button');
        this.$textarea = $('#message-to-send');
        this.$chatHistoryList = this.$chatHistory.find('ul');
    },
    bindEvents: function() {

        this.$button.on('click', this.sendMessage.bind(this));
        this.$textarea.on('keyup', this.sendMessageEnter.bind(this));

    },
    bindMessages: function() {

        this.chat.on('message', function(message) {
            app.renderMessage(message);
        });

    },
    // add PubNub - Presence to display users [online|offline] state
    bindUsers: function() {

        // UNCOMMENT the code below to leverage PubNub's Presence feature
        // when a user comes online, render them in the online list
        this.chat.on('$.online.*', function(data) {
            app.users.unshift(data.user);
            app.renderUsers();
        });
        
        // when a user goes offline, remove them from the online list
        this.chat.on('$.offline.*', function(data) {
        
            for (var i in app.users) {
                if (app.users[i].uuid == data.user.uuid) {
                    delete app.users[i];
                }
            }
        
            app.renderUsers();
        
        });

    },
    renderUserTyping: function() {

        this.chat.on('$typingIndicator.stopTyping', (payload) => {
            $('#typing').empty();
        })

        this.chat.on('$typingIndicator.startTyping', (payload) => {
            console.debug(payload);
            $('#typing').html(payload.sender.uuid + ' is typing...');
        })
    },
    renderUsers: function() {

        var peopleTemplate = Handlebars.compile($("#person-template").html());
        var user = false;

        $('#people-list ul').empty();
        this.users.forEach(function(user) {

            $('#people-list ul').append(peopleTemplate(user.state));
        });
    },
    renderMessage: function(message) {

        var meTemp = Handlebars.compile($("#message-template").html());
        var userTemp = Handlebars.compile($("#message-response-template").html());

        var template = userTemp;

        if (message.sender.uuid == app.me.uuid) {
            template = meTemp;
        }

        // Converts PubNub timetoken to JS date time. ChatEngine 0.9+ only.
        var messageJsTime = new Date(parseInt(message.timetoken.substring(0,13)));

        var context = {
            messageOutput: message.data.text,
            tt: messageJsTime.getTime(),
            time: app.parseTime(messageJsTime),
            user: message.sender.state
        };

        app.$chatHistoryList.append(template(context));

        // Sort messages in chat log based on their timetoken (tt)
        app.$chatHistoryList
        .children()
        .sortDomElements(function(a,b){
            akey = a.dataset.order;
            bkey = b.dataset.order;
            if (akey == bkey) return 0;
            if (akey < bkey) return -1;
            if (akey > bkey) return 1;
        });

        this.scrollToBottom();

    },

    sendMessage: function() {

        this.messageToSend = this.$textarea.val()

        if (this.messageToSend.trim() !== '') {
            this.$textarea.val('');
            this.chat.emit('message', {
                text: this.messageToSend
            });
        }

    },
    sendMessageEnter: function(event) {

        // enter was pressed
        if (event.keyCode === 13) {
            this.sendMessage();
        } else {
            this.chat.typingIndicator.startTyping();
        }
    },
    scrollToBottom: function() {
        this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    parseTime: function(time) {
        return time.toLocaleDateString() + ", " + time.toLocaleTimeString().
        replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getCurrentTime: function() {
        return new Date().toLocaleTimeString().
        replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

};

app.init();

