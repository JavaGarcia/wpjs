//
// # [wpjs] Whatsapp js 
//
//  A node wrapper for yowsup
//  Javier García - Colombia 
var spawn       = require('child_process').spawn;
var Emitter     = require('events').EventEmitter;
var noop        = function() {};
var emitter     = new Emitter().on('error', noop);
var MSJ_IN      = /^\[(\d+)@.*(\(.*\)).*\](.*)/;
var args        = ['-u'];
  args.push('yowsup/yowsup-cli');//CAMBIAR
  args.push('demos');
  args.push('-d');// deb
  args.push('-y');
var cmd;
function send(obj){
    if(obj.type=='txt'){
         cmd.stdin.write('/message send '+obj.to+' "'+obj.data+'"\n\n');
    }
}

emitter.on('process',function(inMsj) {
console.log(inMsj)
  // if it's disconnected
  if(inMsj=='[offline]:'){
    emitter.emit('control','offline... try to connect...')
    cmd.stdin.write('/L\n'); //Connect
    cmd.stdin.write('\n'); //Connect fix
  }
  //after login 1 time!
  if(inMsj=='Auth: Logged in!'){
      emitter.emit('online',inMsj);
  }
  //login fail
  if(inMsj=='Auth Error, reason not-authorized'){
    emitter.emit('online',inMsj);
  }
  
  // Message in
  var msj = inMsj.match(MSJ_IN);
  if(msj){
      var fecha = msj[2].replace(' ','-').replace('(','').replace(')','').replace(':','-').split('-');
      emitter.emit('inbox',{
          date:new Date(fecha[2],parseInt(fecha[1])-1,fecha[0],fecha[3],fecha[4]),
          data:msj[3].replace('\t',''),
          from:msj[1],
          type:'txt'
      });
  }

  
});
function connect(opts, cb) {
    //console.log(opts)
    if(opts.number && opts.password){
        args.push('-l',opts.number+':'+opts.password);
        cmd = spawn('python', args, {cwd: __dirname});
        cmd.stdin.setEncoding('utf8');
        cmd.stdout.on('data', function (data) {
            var outConsole = data.toString().trim();
            //filter 
            emitter.emit('process',outConsole);
        });
        emitter.on('online',function(o){
            emitter.emit('control',o)
            //send({type:'txt',to:'573003487735',data:'prueba'})
            return cb(o) 
        });
        

    }else{
        emitter.emit('Error: not found number||password arguments')
        return cb('Error: not found number||password arguments')
    }
    
}

emitter.connect = connect;
emitter.send = send;
module.exports = emitter;
