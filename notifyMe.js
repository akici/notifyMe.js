/**
 * NotifyMe v1.0.0 Created by Ayberk AKICI on 23-Aug-15.
 * Text notifications on screen corners
 */

;(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    // Now we're wrapping the factory and assigning the return
    // value to the root (window) and returning it as well to
    // the AMD loader.
    define(factory);
  } else if(typeof module === "object" && module.exports) {
    // I've not encountered a need for this yet, since I haven't
    // run into a scenario where plain modules depend on CommonJS
    // *and* I happen to be loading in a CJS browser environment
    // but I'm including it for the sake of being thorough
    module.exports = factory();
  } else {
    root.notifyMe = factory();
  }
}(this, function() {
    'use strict';

    // Initialize library with some defaults
    var defaults = {
        position: ['topRight', 'topLeft', 'bottomLeft', 'bottomRight'],
        type: ['info', 'warning', 'success', 'error'],
        pauseOnHover: false,
        closeBtn: true
    };

    /*Validation functions are intended to check through the argument list values within create() method to make sure they 
    have correct types and values*/

    /*validateString takes two parameters ($type, $option) and throws error if property is not defined in the argument list
    and if the value is not a string throw another error, otherwise it returns $option argument. validateString() is used for
    required options those types are string
    */
    function validateString($type, $option){
        if(typeof $option === 'undefined'){
            throw new Error($type+' field is missing in the argument list notifyMe.create()');
        }
        else if(typeof $option !== 'string') {
            throw new Error($type+' value must be a string in the argument list notifyMe.create()');
        }
        else {
            return $option;
        }
    }

    /*validateArray takes two parameters ($default, $option) and looks for $option argument in the corresponding array 
    within defaults object, if it exist in the array, it returns $option argument value, otherwise it returns first item 
    of the corresponding array which is default value
    */
    function validateArray($default, $option){
        var option='';
        for (var i = 0; i<defaults[$default].length; i++){
            if($option === defaults[$default][i]) {
               option = $option;
            }
        }
        if(option==='') {
            option = defaults[$default][0];
        }

        return option;
    }

    /*validateNumber takes two parameters ($type, $option) and checks if $option argument is defined, if it's not
    undefined, it checks type of $option argument is number. If it's a number it returns $option argument value,
    otherwise it throws an error by using $type argument
    */
    function validateNumber($type, $option) {
        if(typeof $option !== 'undefined') {
            if(typeof  parseInt($option) === 'number') {
                return $option;
            }
            else {
                throw new Error($type+' value must be a number in the argument list notifyMe.create()');
            }
        }
    }

    /*validateFunction takes two parameters ($type, $option) and checks if $option argument is defined, if it's not
    undefined, it checks type of $option argument is function. If it's a function it returns $option argument value,
    otherwise it throws an error by using $type argument
    */
    function validateFunction($type, $option) {
        if(typeof $option !== 'undefined') {
            if(typeof  $option === 'function') {
                return $option;
            }
            else {
                throw new Error($type+' value must be a function in the argument list notifyMe.create()');
            }
        }
    }

    /*validateBool takes two parameters ($default, $option) and checks if $option argument is a boolean, if it's a
    boolean returns $option argument, otherwise it returns corresponding default value within defaults object
    */
    function validateBool($default, $option) {
       return typeof $option === 'boolean' ? $option : defaults[$default];
    }

    //Position adjust the position of notifyMeContainer div according position property in the argument list.
    /*It takes two parameters ($position, $container), by using switch case statement it adds corresponding styles
    according to $position argument to the corresponding container div according to $container argument.
    */
    function position($position, $container) {
        switch ($position) {
            case 'topLeft':
                $container.style.top = '5px';
                $container.style.left = '10px';
                break;
            case 'topRight':
                $container.style.top = '5px';
                $container.style.right = '10px';
                break;
            case 'bottomLeft':
                $container.style.bottom = '5px';
                $container.style.left = '10px';
                break;
            case 'bottomRight':
                $container.style.bottom = '5px';
                $container.style.right = '10px';
                break;
        }
    }

    //Generate container div according to position and returns container element
    /*Create a container div and set an id according to position. Checks the DOM and make sure if container div wasn't 
    created before, and then it sets corresponding class and id attributes, adjust position of the container div by calling 
    position($position, container) function and finally append it into the document body.
    */
    function createContainer($position) {
        var container = document.createElement('div'),
            containerId = 'notifyMeContainer-'+$position,
            containerExist = document.getElementById(containerId);
        if (containerExist === null){
            container.setAttribute('class', 'notifyMeContainer');
            container.setAttribute('id', containerId);
            position($position, container);
            document.body.appendChild(container);
        }

        return  document.getElementById(containerId);
    }

    //Generate notification div and returns notification element
    /*Create notification div, title h4 and text p elements with corresponding classes, adds a close button into notification element
    by invoking addCloseBtn($container, notification, $closeBtn) function, sets title and text HTML's from argument list and append them
    into the notification div, add a click event handler by calling addClick(notification, $click) function. And finally check if the 
    position contains 'top' string, create notifications from top to bottom, else create notifications from bottom to top in DOM
    */
    function createNotification($type, $container, $position, $title, $text, $closeBtn, $addClass, $click, $pauseOnHover, $timeout) {
        var notification = document.createElement('div');
        var title = document.createElement('h4');
        var text = document.createElement('p');
        addCloseBtn($container, notification, $closeBtn);
        notification.setAttribute('class', 'notification '+$type);
        title.setAttribute('class', 'notifyMeTitle');
        title.innerHTML = $title;
        text.setAttribute('class', 'notifyMeText');
        text.innerHTML = $text;
        notification.appendChild(title);
        notification.appendChild(text);
        addClick(notification, $click);
        addClass(notification, $addClass);

        $position.indexOf('top') > -1 ? $container.appendChild(notification) :  $container.insertBefore(notification, $container.childNodes[0]);
        removeNotification($container, notification, $timeout, $pauseOnHover); //Remove notification
        return notification;

    }

    //Add close button into notification element
    /*If the $closeBtn truthy a button element with corresponding class and html is generated and a click event handler that 
    removes the notification by calling removeNotification($container, $notification, 0) is added. stopImmediatePropagation 
    method prevents click event to bubble up so that click event won't be triggered within notification div element. Finally 
    button is appended into notification element
    */
    function addCloseBtn($container, $notification, $closeBtn) {
        if($closeBtn) {
            var closeBtn = document.createElement('button');
            closeBtn.setAttribute('class', 'close');
            closeBtn.innerHTML = '<span aria-hidden="true">&#10006;</span>';
            closeBtn.onclick = function(e) {
                e.stopImmediatePropagation();
                removeNotification($container, $notification, 0);
            }
            $notification.appendChild(closeBtn);
        }
    }

    //Add optionally additional class into notification element
    /*If addClass options exist, then it append $addClass into $notification div element*/
    function addClass($notification, $addClass) {
        if($addClass) {
            $notification.className += ' ' + $addClass;
        }
    }




    //Remove notification element
    /*
    A timer variable is defined in the upper scope which allows us to set and clear timeout method. The function firstly make 
    sure $timeout argument is truthy and greater than zero and accordingly it invoke setTimeout method by passing 
    $container.removeChild($notification) function and $timeout argument and set this method into the timer variable as value.
    If $timeout argument equals zero then it calls clearTimeout(timer) method and stop the timer that prevent setTimeout method
    reattempt to invoke $container.removeChild($notification) method that is called after clearTimeout(timer) 
    */
    function removeNotification($container, $notification, $timeout, $pauseOnHover) {
        var timerId, start, remaining = $timeout;
        function startOrResume() {
            start = new Date().getTime();
            window.clearTimeout(timerId);
            timerId = window.setTimeout(function(){
                $container.removeChild($notification);
            }, remaining);

            $notification.setAttribute('data-timer', timerId);
            $notification.setAttribute('data-remaining', start);
        }
        function pause() {
            timerId = $notification.getAttribute('data-timer');
            window.clearTimeout(timerId);
            remaining -= new Date().getTime() - $notification.getAttribute('data-remaining');
        }
            
        if ($timeout && $timeout > 0) {
            startOrResume();
        }
        if($timeout && $timeout > 0 && $pauseOnHover) {
            $notification.onmouseout = startOrResume;
            $notification.onmouseover = pause;
        }
        if ($timeout === 0) {
            pause();
            $container.removeChild($notification);
        }
        
    }


    //Add onclick event handler
    /*
    If $option argument is truthy set $option argument as an onclick event handler to the $notification argument
    */
    function addClick ($notification, $option) {
       return $option ?  $notification.onclick = $option : false;
    }
    //Public methods
    return {
        //create() method allows us to generate notification instances
        create: function(options) {
            var options = options || {}, //Set options as an empty object if there is no argument list passed
                position = validateArray('position', options.position), //Validates position
                type = validateArray('type', options.type), //Validates type
                title = validateString('title', options.title), //Validates title
                text = validateString('text', options.text), //Validates text
                timeout = validateNumber('timeOut', options.timeout), //Validates timeout
                closeBtn = validateBool('closeBtn', options.closeBtn), //Validates closeBtn
                addClass = options.addClass, //addClass needs no validation since it is an optional string
                click = validateFunction('click', options.click), //Validates click
                pauseOnHover = validateBool('pauseOnHover', options.pauseOnHover), //Validates pauseOnHover
                container = createContainer(position), //Create container and returns container element
                notification = createNotification(type, container, position, title, text, closeBtn, addClass, click, pauseOnHover, timeout); //Create notification and return notification element
            return notification;
        },
        //Removes a specific notification element which is specified as function parameter
        remove: function($notification) {
            var timer = $notification.getAttribute('data-timer');
            window.clearTimeout(timer);
            $notification.parentElement.removeChild($notification);
        },
        //Removes all generated notifications by create() method
        removeAll: function() {
            var allNotifications = document.getElementsByClassName('notification'),
                i = allNotifications.length;
            while(i--) {
                window.clearTimeout(allNotifications[i].getAttribute('data-timer'));
                allNotifications[i].parentNode.removeChild(allNotifications[i]);
            }
            
        }
    }
}));