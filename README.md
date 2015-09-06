# notifyMe.js
-------

notifyMe.js is a pure lightweight JavaScript library to create graphical text notifications on screen corners. It has no jQuery dependecy. You only need to load the javascript and css files to your page, and use the simple API to start launching notifications on your page. It is tested on Chrome, Firefox, Opera, Safari and IE 9+. It benefits CSS3 transitions when they are available.

Demo page: http://www.ayberkakici.com/notifyMe.js

##Setting Up

Please include the CSS and JS files!
```
 <link rel="stylesheet" href="styles/notifyMe.min.css">
 <script src="js/notifyMe.min.js"></script>
```

##Usage

```

notifyMe.create({
    position: 'topLeft', //Positions are: ['topRight', 'topLeft', 'bottomLeft', 'bottomRight'],optional field with default value: 'topRight'
    type: 'info', // Types are: ['info', 'warning', 'success', 'error'], optional field with default value: 'info'
    title: 'NotifyMe Example with 5000ms timeout', //required field
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent consequat enim non sapien venenatis sollicitudin', //required field
    timeout: 5000, //Remove notification after timeout expire, optional field without default value
    pauseOnHover: true, //Pause the timeout when mouse is over the notification, true or false, optional field with default value: false
    closeBtn: true, //Shows a close button, true or false, optional field with default value: true
    addClass: 'additional-class', // Add 'additional-class' into existing class names, optional field without default value
    click: function(){ //Click event handler function, optional field without default value
        alert('clicked');
    }
});
```
