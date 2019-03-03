(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {

    const package = require('../package.json');
    window.ChatEngineCore.plugin[package.name] = require('../src/plugin.js');

})();

},{"../package.json":2,"../src/plugin.js":3}],2:[function(require,module,exports){
module.exports={
  "name": "chat-engine-desktop-notifications",
  "version": "0.0.3",
  "author": "Ian Jennings",
  "main": "src/plugin.js",
  "dependencies": {
    "chat-engine": "0.5.x"
  }
}

},{}],3:[function(require,module,exports){
/**
* Fires a Notification via the [Web Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/notification)
* whenever a message is received in the supplied {@link Chat}.
* @module chat-engine-desktop-notifications
*/

const defaults = {timeout: 1000};

/**
* @function
* @ceplugin
* @param {Object} config The config object
* @param {String} [config.event="message"] The event that will trigger a desktop notification
* @param {module:chat-engine-desktop-notifications~title} config.title A function that returns title of the notification.
* @param {module:chat-engine-desktop-notifications~message} config.message A function that returns the notification message.
* @param {module:chat-engine-desktop-notifications~icon} config.icon A function that returns link to an image to use for the notification icon.
* @param {module:chat-engine-desktop-notifications~callback} config.callback A function to call when the notification is clicked.
* @example
* room.chat.plugin(ChatEngineCore.plugin['chat-engine-desktop-notifications']({
*     title: (event) => {
*         return 'Message In ' + room.name
*     },
*     message: (event) => {
*         return event.data.text;
*     },
*     icon: (event) => {
*         return '/examples/flowtron/logo@2x.png';
*     },
*     callback: (event) => {
*         window.focus();
*     }
* }));
*/
module.exports = (config = {}) => {

    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
      if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
      }

      if (Notification.permission !== "granted")
        Notification.requestPermission();
    });

    let lastNotification = false;

    function notifyMe(title, icon, body, callback) {

      if(lastNotification) {

        lastNotification.close();
        lastNotification = false;

      }

      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      } else {

        lastNotification = new Notification(title || 'Notification title', {
          icon: icon || 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
          body: body || "Hey there! You've been notified!",
        });


      /**
       * Fired when the desktop notification is clicked on by the user.
       * @callback callback
       * @param {Object} event
       */
        lastNotification.onclick = callback;

      }

    }

    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    let defaultTitle = (event) => {
        return 'New Message In ' + event.chat.channel;
    };

    let defaultIcon = (event) => {
        return false
    };

    let defaultMessage = (event) => {
        return JSON.stringify(event.data);
    };

    let defaultCallback = (event) => {
      window.focus();
      return false;
    };

    config.event = config.event || 'message';
    config.title = config.title || defaultTitle;
    config.icon = config.icon || defaultIcon;
    config.message = config.message || defaultMessage;
    config.callback = config.callback || defaultCallback;

    let isVisible = true;

    function handleVisibilityChange() {
      if (document[hidden]) {
        isVisible = false;
      } else {
        isVisible = true;
      }
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
      console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
      // Handle page visibility change
      document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }

    class extension {

        construct() {

            this.parent.on(config.event, (event) => {

                if(!isVisible) {

                /**
                 * Provides a template function to generate a notification title.
                 * @callback title
                 * @param {Object} title
                 */

                /**
                 * Provides a template function to generate a notification icon.
                 * @callback icon
                 * @param {Object} event
                 */

                /**
                 * Provides a template function to generate a notification message.
                 * @callback message
                 * @param {Object} event
                 */
                  notifyMe(config.title(event), config.icon(event), config.message(event), config.callback);
                }

            });

        }

    };

    // attach methods to Chat
    return {
        namespace: 'desktop-notifications',
        extends: {
            Chat: extension
        }
    }

}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92Ni4xMS4wL2xpYi9ub2RlX21vZHVsZXMvY2hhdC1lbmdpbmUtcGx1Z2luL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIudG1wL3dyYXAuanMiLCJwYWNrYWdlLmpzb24iLCJzcmMvcGx1Z2luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCBwYWNrYWdlID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJyk7XG4gICAgd2luZG93LkNoYXRFbmdpbmVDb3JlLnBsdWdpbltwYWNrYWdlLm5hbWVdID0gcmVxdWlyZSgnLi4vc3JjL3BsdWdpbi5qcycpO1xuXG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIm5hbWVcIjogXCJjaGF0LWVuZ2luZS1kZXNrdG9wLW5vdGlmaWNhdGlvbnNcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjNcIixcbiAgXCJhdXRob3JcIjogXCJJYW4gSmVubmluZ3NcIixcbiAgXCJtYWluXCI6IFwic3JjL3BsdWdpbi5qc1wiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJjaGF0LWVuZ2luZVwiOiBcIjAuNS54XCJcbiAgfVxufVxuIiwiLyoqXG4qIEZpcmVzIGEgTm90aWZpY2F0aW9uIHZpYSB0aGUgW1dlYiBOb3RpZmljYXRpb25zIEFQSV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL25vdGlmaWNhdGlvbilcbiogd2hlbmV2ZXIgYSBtZXNzYWdlIGlzIHJlY2VpdmVkIGluIHRoZSBzdXBwbGllZCB7QGxpbmsgQ2hhdH0uXG4qIEBtb2R1bGUgY2hhdC1lbmdpbmUtZGVza3RvcC1ub3RpZmljYXRpb25zXG4qL1xuXG5jb25zdCBkZWZhdWx0cyA9IHt0aW1lb3V0OiAxMDAwfTtcblxuLyoqXG4qIEBmdW5jdGlvblxuKiBAY2VwbHVnaW5cbiogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIG9iamVjdFxuKiBAcGFyYW0ge1N0cmluZ30gW2NvbmZpZy5ldmVudD1cIm1lc3NhZ2VcIl0gVGhlIGV2ZW50IHRoYXQgd2lsbCB0cmlnZ2VyIGEgZGVza3RvcCBub3RpZmljYXRpb25cbiogQHBhcmFtIHttb2R1bGU6Y2hhdC1lbmdpbmUtZGVza3RvcC1ub3RpZmljYXRpb25zfnRpdGxlfSBjb25maWcudGl0bGUgQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGl0bGUgb2YgdGhlIG5vdGlmaWNhdGlvbi5cbiogQHBhcmFtIHttb2R1bGU6Y2hhdC1lbmdpbmUtZGVza3RvcC1ub3RpZmljYXRpb25zfm1lc3NhZ2V9IGNvbmZpZy5tZXNzYWdlIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBub3RpZmljYXRpb24gbWVzc2FnZS5cbiogQHBhcmFtIHttb2R1bGU6Y2hhdC1lbmdpbmUtZGVza3RvcC1ub3RpZmljYXRpb25zfmljb259IGNvbmZpZy5pY29uIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGxpbmsgdG8gYW4gaW1hZ2UgdG8gdXNlIGZvciB0aGUgbm90aWZpY2F0aW9uIGljb24uXG4qIEBwYXJhbSB7bW9kdWxlOmNoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9uc35jYWxsYmFja30gY29uZmlnLmNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSBub3RpZmljYXRpb24gaXMgY2xpY2tlZC5cbiogQGV4YW1wbGVcbiogcm9vbS5jaGF0LnBsdWdpbihDaGF0RW5naW5lQ29yZS5wbHVnaW5bJ2NoYXQtZW5naW5lLWRlc2t0b3Atbm90aWZpY2F0aW9ucyddKHtcbiogICAgIHRpdGxlOiAoZXZlbnQpID0+IHtcbiogICAgICAgICByZXR1cm4gJ01lc3NhZ2UgSW4gJyArIHJvb20ubmFtZVxuKiAgICAgfSxcbiogICAgIG1lc3NhZ2U6IChldmVudCkgPT4ge1xuKiAgICAgICAgIHJldHVybiBldmVudC5kYXRhLnRleHQ7XG4qICAgICB9LFxuKiAgICAgaWNvbjogKGV2ZW50KSA9PiB7XG4qICAgICAgICAgcmV0dXJuICcvZXhhbXBsZXMvZmxvd3Ryb24vbG9nb0AyeC5wbmcnO1xuKiAgICAgfSxcbiogICAgIGNhbGxiYWNrOiAoZXZlbnQpID0+IHtcbiogICAgICAgICB3aW5kb3cuZm9jdXMoKTtcbiogICAgIH1cbiogfSkpO1xuKi9cbm1vZHVsZS5leHBvcnRzID0gKGNvbmZpZyA9IHt9KSA9PiB7XG5cbiAgICAvLyByZXF1ZXN0IHBlcm1pc3Npb24gb24gcGFnZSBsb2FkXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghTm90aWZpY2F0aW9uKSB7XG4gICAgICAgIGFsZXJ0KCdEZXNrdG9wIG5vdGlmaWNhdGlvbnMgbm90IGF2YWlsYWJsZSBpbiB5b3VyIGJyb3dzZXIuIFRyeSBDaHJvbWl1bS4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gIT09IFwiZ3JhbnRlZFwiKVxuICAgICAgICBOb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oKTtcbiAgICB9KTtcblxuICAgIGxldCBsYXN0Tm90aWZpY2F0aW9uID0gZmFsc2U7XG5cbiAgICBmdW5jdGlvbiBub3RpZnlNZSh0aXRsZSwgaWNvbiwgYm9keSwgY2FsbGJhY2spIHtcblxuICAgICAgaWYobGFzdE5vdGlmaWNhdGlvbikge1xuXG4gICAgICAgIGxhc3ROb3RpZmljYXRpb24uY2xvc2UoKTtcbiAgICAgICAgbGFzdE5vdGlmaWNhdGlvbiA9IGZhbHNlO1xuXG4gICAgICB9XG5cbiAgICAgIGlmIChOb3RpZmljYXRpb24ucGVybWlzc2lvbiAhPT0gXCJncmFudGVkXCIpIHtcbiAgICAgICAgTm90aWZpY2F0aW9uLnJlcXVlc3RQZXJtaXNzaW9uKCk7XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGxhc3ROb3RpZmljYXRpb24gPSBuZXcgTm90aWZpY2F0aW9uKHRpdGxlIHx8ICdOb3RpZmljYXRpb24gdGl0bGUnLCB7XG4gICAgICAgICAgaWNvbjogaWNvbiB8fCAnaHR0cDovL2Nkbi5zc3RhdGljLm5ldC9zdGFja2V4Y2hhbmdlL2ltZy9sb2dvcy9zby9zby1pY29uLnBuZycsXG4gICAgICAgICAgYm9keTogYm9keSB8fCBcIkhleSB0aGVyZSEgWW91J3ZlIGJlZW4gbm90aWZpZWQhXCIsXG4gICAgICAgIH0pO1xuXG5cbiAgICAgIC8qKlxuICAgICAgICogRmlyZWQgd2hlbiB0aGUgZGVza3RvcCBub3RpZmljYXRpb24gaXMgY2xpY2tlZCBvbiBieSB0aGUgdXNlci5cbiAgICAgICAqIEBjYWxsYmFjayBjYWxsYmFja1xuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgICAgbGFzdE5vdGlmaWNhdGlvbi5vbmNsaWNrID0gY2FsbGJhY2s7XG5cbiAgICAgIH1cblxuICAgIH1cblxuICAgIC8vIFNldCB0aGUgbmFtZSBvZiB0aGUgaGlkZGVuIHByb3BlcnR5IGFuZCB0aGUgY2hhbmdlIGV2ZW50IGZvciB2aXNpYmlsaXR5XG4gICAgdmFyIGhpZGRlbiwgdmlzaWJpbGl0eUNoYW5nZTtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikgeyAvLyBPcGVyYSAxMi4xMCBhbmQgRmlyZWZveCAxOCBhbmQgbGF0ZXIgc3VwcG9ydFxuICAgICAgaGlkZGVuID0gXCJoaWRkZW5cIjtcbiAgICAgIHZpc2liaWxpdHlDaGFuZ2UgPSBcInZpc2liaWxpdHljaGFuZ2VcIjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgaGlkZGVuID0gXCJtc0hpZGRlblwiO1xuICAgICAgdmlzaWJpbGl0eUNoYW5nZSA9IFwibXN2aXNpYmlsaXR5Y2hhbmdlXCI7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBoaWRkZW4gPSBcIndlYmtpdEhpZGRlblwiO1xuICAgICAgdmlzaWJpbGl0eUNoYW5nZSA9IFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiO1xuICAgIH1cblxuICAgIGxldCBkZWZhdWx0VGl0bGUgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuICdOZXcgTWVzc2FnZSBJbiAnICsgZXZlbnQuY2hhdC5jaGFubmVsO1xuICAgIH07XG5cbiAgICBsZXQgZGVmYXVsdEljb24gPSAoZXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfTtcblxuICAgIGxldCBkZWZhdWx0TWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZXZlbnQuZGF0YSk7XG4gICAgfTtcblxuICAgIGxldCBkZWZhdWx0Q2FsbGJhY2sgPSAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5mb2N1cygpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBjb25maWcuZXZlbnQgPSBjb25maWcuZXZlbnQgfHwgJ21lc3NhZ2UnO1xuICAgIGNvbmZpZy50aXRsZSA9IGNvbmZpZy50aXRsZSB8fCBkZWZhdWx0VGl0bGU7XG4gICAgY29uZmlnLmljb24gPSBjb25maWcuaWNvbiB8fCBkZWZhdWx0SWNvbjtcbiAgICBjb25maWcubWVzc2FnZSA9IGNvbmZpZy5tZXNzYWdlIHx8IGRlZmF1bHRNZXNzYWdlO1xuICAgIGNvbmZpZy5jYWxsYmFjayA9IGNvbmZpZy5jYWxsYmFjayB8fCBkZWZhdWx0Q2FsbGJhY2s7XG5cbiAgICBsZXQgaXNWaXNpYmxlID0gdHJ1ZTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UoKSB7XG4gICAgICBpZiAoZG9jdW1lbnRbaGlkZGVuXSkge1xuICAgICAgICBpc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzVmlzaWJsZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2FybiBpZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgYWRkRXZlbnRMaXN0ZW5lciBvciB0aGUgUGFnZSBWaXNpYmlsaXR5IEFQSVxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgZG9jdW1lbnRbaGlkZGVuXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgY29uc29sZS5sb2coXCJUaGlzIGRlbW8gcmVxdWlyZXMgYSBicm93c2VyLCBzdWNoIGFzIEdvb2dsZSBDaHJvbWUgb3IgRmlyZWZveCwgdGhhdCBzdXBwb3J0cyB0aGUgUGFnZSBWaXNpYmlsaXR5IEFQSS5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEhhbmRsZSBwYWdlIHZpc2liaWxpdHkgY2hhbmdlXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKHZpc2liaWxpdHlDaGFuZ2UsIGhhbmRsZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjbGFzcyBleHRlbnNpb24ge1xuXG4gICAgICAgIGNvbnN0cnVjdCgpIHtcblxuICAgICAgICAgICAgdGhpcy5wYXJlbnQub24oY29uZmlnLmV2ZW50LCAoZXZlbnQpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmKCFpc1Zpc2libGUpIHtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFByb3ZpZGVzIGEgdGVtcGxhdGUgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSBub3RpZmljYXRpb24gdGl0bGUuXG4gICAgICAgICAgICAgICAgICogQGNhbGxiYWNrIHRpdGxlXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRpdGxlXG4gICAgICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBQcm92aWRlcyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGEgbm90aWZpY2F0aW9uIGljb24uXG4gICAgICAgICAgICAgICAgICogQGNhbGxiYWNrIGljb25cbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRcbiAgICAgICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIFByb3ZpZGVzIGEgdGVtcGxhdGUgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgYSBub3RpZmljYXRpb24gbWVzc2FnZS5cbiAgICAgICAgICAgICAgICAgKiBAY2FsbGJhY2sgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudFxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICAgbm90aWZ5TWUoY29uZmlnLnRpdGxlKGV2ZW50KSwgY29uZmlnLmljb24oZXZlbnQpLCBjb25maWcubWVzc2FnZShldmVudCksIGNvbmZpZy5jYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLy8gYXR0YWNoIG1ldGhvZHMgdG8gQ2hhdFxuICAgIHJldHVybiB7XG4gICAgICAgIG5hbWVzcGFjZTogJ2Rlc2t0b3Atbm90aWZpY2F0aW9ucycsXG4gICAgICAgIGV4dGVuZHM6IHtcbiAgICAgICAgICAgIENoYXQ6IGV4dGVuc2lvblxuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=
