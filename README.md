# wpjs
A wrapper of yowsup (WhatsApp with Nodejs)

This wrapper is a simple test. 
If you want to try it, you are going to need install yowsup and change the path into the code. 

I hope someday fix some bugs and add new features.

## Usage
 You need to have youwup installed, 
 
#### Connect
```javascript
var wpjs = require('./index.js');

wpjs.connect({number: '57300349xxx', password: '=XXXXX'}, function (state) {}); 
```

#### Send text message
```javascript
wpjs.send({to: '57300349xxx', type: 'txt', data: 'Im busy...'}); 
```
### Made with :heart: in Colombia.

