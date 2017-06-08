//
// # [wpjs] Whatsapp js 
//
//  A node wrapper for yowsup
//  Javier García - Colombia 
//var colors = require('colors');
var spawn       = require('child_process').spawn;
var Emitter     = require('events').EventEmitter;
var noop        = function() {};
var emitter     = new Emitter().on('error', noop);
var MSJ_IN      = /^\[(\d+)@.*(\(.*\)).*\](.*)/;
var MSJ_USER    = /notify="(.*)" from="(.*)@/;
//var MSJ_USER    = /message from="(.*)@.*notify="(.*)" offline/;
var args        = ['-u'];
var miniDB      = {};
var cmd;
function send(obj){
    if(obj.type=='txt'){
         cmd.stdin.write('/message send '+obj.to+' "'+obj.data+'"\n\n');
    }
}

emitter.on('process',function(inData) {
  // if it's disconnected
  var inMsj = inData.data;
  if(inMsj.indexOf('[offline]:')>=0){
    emitter.emit('control','offline... try to connect...')
    cmd.stdin.write('/L\n'); //Connect
    cmd.stdin.write('/L\n'); //RE-Connect "just in case"
  }
  //after login 1 time!
  if(inMsj=='Auth: Logged in!'){
      emitter.emit('online',inMsj);
  }
  //login fail
  if(inMsj=='Auth Error, reason not-authorized'){
    emitter.emit('online',inMsj);
  }
  //before message, to get name
  if(inData.deb){
      //console.log(inData)
      var user_number = inMsj.match(MSJ_USER);
      if(user_number != null && user_number){
          //save number and user name
          console.log(user_number)
        if(user_number[2] in miniDB){
            //ya existe, actualizar nombre
            miniDB[user_number[2]].username = user_number[1]
            
        }else{
            miniDB[user_number[2]] = {username:user_number[1]}
        }
      }
      
  }
  
  // Message in
  var msj = inMsj.match(MSJ_IN);
  if(msj){
      var fecha = msj[2].replace(' ','-').replace('(','').replace(')','').replace(':','-').split('-');
      if(msj[1] in miniDB){
          emitter.emit('inbox',{
              date:new Date(fecha[2],parseInt(fecha[1])-1,fecha[0],fecha[3],fecha[4]),
              data:msj[3].replace('\t',''),
              from:msj[1],
              username:miniDB[msj[1]].username,
              type:'txt'
          });
      }else{
             emitter.emit('inbox',{
              date:new Date(fecha[2],parseInt(fecha[1])-1,fecha[0],fecha[3],fecha[4]),
              data:msj[3].replace('\t',''),
              from:msj[1],
              username:"null",
              type:'txt'
          });
      }
  }

  
});
function connect(opts, cb) {
    //console.log(opts)
    if(opts.number && opts.password){
        args.push(opts.yowsup || 'yowsup-cli');//Path or global yowup-cli
        args.push('demos');
        args.push('-d');// deb
        args.push('-y');
        args.push('-l',opts.number+':'+opts.password);
        cmd = spawn('python', args, {cwd: __dirname});
        cmd.stdin.setEncoding('utf8');
        cmd.stdout.on('data', function (data) {
            var outConsole = {}
            outConsole.data = data.toString('utf-8').trim();
            outConsole.deb = false;
            //filter 
            emitter.emit('process',outConsole);
        });
         cmd.stderr.on('data', function (data) {
             
            var outConsole = {}
            outConsole.data = data.toString('utf-8').trim();
            outConsole.deb = true;
            //filter 
            emitter.emit('process',outConsole);
        });
        
        
        emitter.on('online',function(o){
            emitter.emit('control',o)
            return cb(o) 
        });
        

    }else{
        emitter.emit('Error: number||password arguments')
        return cb('Error: number||password arguments')
    }
    
}

emitter.connect = connect;
emitter.send = send;
module.exports = emitter;
