//let Mic = require('node-microphone');
let mic = require('mic');
var fs = require('fs');
var ee = require('events');



const defaults = {
    flags: 'w',
    defaultEncoding: 'utf8',
    fd: null,
    mode: 0o666,
    autoClose: true
};

var micInstance;
var micInputStream;
var outputFileStream;
var recEmit = new ee.EventEmitter();

module.exports = {
    recordWavV1 : function () {
        micInstance = mic({
            rate: '16000',
            device:'plughw:2,0',
            filetype:'wav',
            channels: '1',
            debug: true,
            exitOnSilence: 10
        });
        micInputStream = micInstance.getAudioStream();
         
        outputFileStream = fs.createWriteStream('./question.wav');
         
        micInputStream.pipe(outputFileStream);
         
        micInputStream.on('data', function(data) {
            //console.log("MicInputStream : Recieved Input Stream: " + data.length);
        });

        micInputStream.on('end', function() {
            console.log("MicInputStream : End event recevied");
            //micInputStream.pipe(curlStream);
            
        });

        outputFileStream.on('end', function() {
            console.log("outputFileStream : End event recevied");
            //recEmit.emit('FileReady');
            recEmit.emit('AudioFlushed');
            
        });
         
        micInputStream.on('error', function(err) {
            cosole.log("MicInputStream : Error in Input Stream: " + err);
        });
         
        micInputStream.on('startComplete', function() {
            console.log("MicInputStream : Got SIGNAL startComplete");
        });
            
        micInputStream.on('stopComplete', function() {
            console.log("MicInputStream : Got SIGNAL stopComplete");
            recEmit.emit('FileReady');
        });

        /*recEmit.on('FileReady', function() {
            console.log("FileReady Event received");
            //request(options, callback);
        });*/

            
        micInputStream.on('pauseComplete', function() {
            console.log("MicInputStream : Got SIGNAL pauseComplete");
        });
         
        micInputStream.on('resumeComplete', function() {
            console.log("MicInputStream : Got SIGNAL resumeComplete");
        });
         
        micInputStream.on('silence', function() {
            console.log("MicInputStream : Got SIGNAL silence");
            micInstance.stop();
        });
         
        micInputStream.on('processExitComplete', function() {
            console.log("MicInputStream : Got SIGNAL processExitComplete");
        });
        
        module.exports.micInputStream = micInputStream;
        //module.exports.outputFileStream = outputFileStream;
        module.exports.micInstance = micInstance;
        micInstance.start();
        //return {"audioStream":micInputStream, "audioInstance":micInstance};
    },

    //micInputStream: micInputStream,

    //micInstance : micInstance,

    //outputFileStream : outputFileStream,

    recEmit : recEmit
}

