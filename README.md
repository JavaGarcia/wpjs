# WPJS (Whatsapp nodejs)

WPJS is a client of whatsapp in nodejs

###Features
* Sender messages type text
* Receiver messags type text


## Usage
 You need to have yowsup installed, 
 
#### Connect
```javascript
var wpjs = require('./index.js');

wpjs.connect({number: '57300349xxx', password: '=XXXXX', yowsup:"PATH_YOWSUP_INSTALLED"}, function(state){
 console.log(state)
}); 
```

#### Send text message
```javascript
wpjs.send({to: '57300349xxx', type: 'txt', data: 'Im busy...'}); 
```
#### inbox text message
```javascript
wpjs.on('inbox',function(message){
  console.log(message.type)//type of message (txt)
  console.log(message.from)// number_src of message
  console.log(message.username) // nickname 
  console.log(message.date)// arrival date
  console.log(message.data)// message...
}); 
```

#### Echo example
```javascript
var wpjs = require('./index.js');

wpjs.connect({number: '57300349xxx', password: '=XXXXX', yowsup:"PATH_YOWSUP_INSTALLED"}, function(state){
 console.log(state)
});

wpjs.on('inbox',function(message){
 console.log('[INBOX] User:'+message.username+' from:'+message.from+' data: '+message.data);
 wpjs.send({to: message.from, type: 'txt', data: message.data}); 
}); 
```

### Made with :heart: in Colombia.

