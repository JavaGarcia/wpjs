# wpjs
A wrapper of yowsup (WhatsApp with Nodejs)

This wrapper is a simple test of yowsup with Nodejs

I hope someday fix some bugs and add new features.

## Usage
 You need to have yowsup installed, 
 
#### Connect
```javascript
var wpjs = require('./index.js');

wpjs.connect({number: '57300349xxx', password: '=XXXXX'}, function (state) {}); 
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
  console.log(message.date)// arrival date
  console.log(message.data)// message...
}); 
```
### Made with :heart: in Colombia.

