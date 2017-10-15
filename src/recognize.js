'use strict';



var express = require('express');
var uniqid = require("uniqid");
var record = require("./record");
var fs = require("fs");
var myUniqId = "";
var app = express();
//var curl = require('curlrequest');



var serviceOptions = {
    "event": {
        "header": {
            "namespace": "SpeechRecognizer",
            "name": "Recognize",
            "messageId": getUniqId(),
            "dialogRequestId": "dialog-" + myUniqId
        },
        "payload": {
            "profile": "CLOSE_TALK",
            "format": "AUDIO_L16_RATE_16000_CHANNELS_1"
        }
    }
};

var accessToken = "Atza|IwEBIMaNisQ1pabSTGXC27EJ1kDwqA-xgi5UQL52FLLf6NHZFd0hDBobyBgiEoSqwrYUG8vK2O9_HVVvnxEr_nDDpKBKfMDfZq9WEH_4YOKChPYh4e6Q_46yI4ViEcSAwdjMQIPXArHCw0YcZRtZhqRYh9OxfEewuQE3dygWjkGFEqcM7Mo4ys0v1Lc0DgmLd6gCoXHcrmc_HwdN71LOH3VZRz44UjyYgUUfPTZi25uk7chrP3DFXaXPxrfvVySMwmYSyRXtV-nczBxTNsKb8YrzEctZ25sEi5m_dByoyif9DFpy0b-0ziI4jyIhvV6zuPkOIB8uMHBnjD_5Sv6rAVM6IgVSYL0Ag61xGnZvoCxCIDVhh53pww36lNPSRVuIOok4-ifqOXnHckEgWTZW5TzOBs3EtzqPtZzXKD6bB4oLanYmfWRXeshgtA5P2sQRoBRjemylTj4WwDX0HLzkWk3fCdlXAj_lx82b3gt8ROltrKQVJ587DC0tVTD678u7gT2q6RUHLdxy4R7wJmITWdRCvjU8Tt8rVo2cNeNrG3HtIzndXQ";

function getUniqId() {
    myUniqId = uniqid();
    return myUniqId;
};


//app.get('/invokeCurl', (req, res) => {
module.exports = {
    invoke: function (aToken, audioObj) {


        const { spawn } = require('child_process');

        var args = ["--verbose",
            "--url", "https://avs-alexa-na.amazon.com:443/v20160207/events",
            "--form", "event=" + JSON.stringify(serviceOptions),
            //"--form", "audio=@hello",
            "--form", "audio=@-",
            "--header", "Authorization: Bearer " + aToken];
        // "--output", "response.out"];

        const myCurl = spawn('curl', args);
        const cv = spawn('cvlc', ['-']);

        record.recEmit.once('FileReady', function () {
            console.log("FileReady Event received");
            fs.createReadStream("./question.wav").pipe(myCurl.stdin);
        });


        //myCurl.stdout.pipe(fs.createWriteStream('response'));
        myCurl.stdout.pipe(cv.stdin);

        myCurl.stderr.on('data', (data) => {
            console.log(`Curl stderr:`, data.toString('utf-8'));
        });

        cv.stderr.on('data', (data) => {
            console.log(`VLC stderr:`, data.toString('utf-8'));
        });

        myCurl.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}
    //});


















/*var request = require("request-http2");
var uniqid = require("uniqid");
var record = require("./record");
var fs = require("fs");
var myUniqId = "";



var serviceOptions = {
    "event": {
        "header": {
            "namespace": "SpeechRecognizer",
            "name": "Recognize",
            "messageId": getUniqId(),
            "dialogRequestId": "dialog-" + myUniqId
        },
        "payload": {
            "profile": "CLOSE_TALK",
            "format": "AUDIO_L16_RATE_16000_CHANNELS_1"
        }
    }
};

var options = {
    url: "https://avs-alexa-na.amazon.com/v20160207/events",
    http2: true,
    method: "POST",
    auth: {
        bearer: "Atza|IwEBIHmIScW9nXAIu1NunxEpgi9VQXl6K4P7Yx8xzLzuTm8Om5zWjx6IAwb_SYbS20xu2JuFmxPeOLZhDnI3XyzRX4y0YjTl8BcVGM6bfgcqVlBfkIYH5e5t_pzj18iwkNTYJ-24ByDzfy2rRLxvo6BP0Qvn9h4WIgKF_EdjEPL0dA18afRZU9PeXO5YqO6-XgNN5Jqktq3k8B4tmpDCIaL1Eo_VWptqmlMhVJBcKOkRabYVzyKVy7go-ZG_Nv6fU2AooLpe8X_KjEVJjmUIOkXDMRcDy4tjtCDXkeUCfV0QaSpGiVYjDRuyBHw3s0gJVql_yjpYln2OZe1t5tg3teBgvQ0hNumTJXJ4z23w7x9hBnvUtu3zbm6VNpM5zpmdlhGuc87b033CYly2akOsp5gus9sfZ5gqfs_ImP-9vR5uGHEkPyqXOxkdXBASFjMeRAeI07bP-njodhkNIU8HXmK1LHZm0x7D9ayz6R9Yj-yeY35vZn7wE1DcJr8Csp3j-CpTsHH0L8J2ic8HlUlF8gcgAXYC"
    },
    headers: [
        {
            "name": "content-type",
            "value": "multipart/form-data"
        }
    ],
    multipart: {
        data: [
            {
                "Content-Disposition": "form-data ; name : \"metadata\"",
                "content-type": "application/json",
                "charset": "UTF-08",
                "body": JSON.stringify(serviceOptions)
            },
            {
                "Content-Disposition": "form-data; name:\"audio\"",
                "Content-Type": "application/octet-stream",
                "body" : fs.readFileSync("/home/vxsrini/alexa/avs/alexa-avs/src/question.wav")
                //"body" : "This is a test body"
            }
        ]
    }
};


module.exports = {
    invoke: function (aToken, audioObj) {



        require('request-debug')(request, function (type, data, r) {


            console.log("Request Type = ", JSON.stringify(type));
            console.log("Request Data = ", JSON.stringify(data));
            console.log("Request r = ", JSON.stringify(r));
        });
        options.auth.bearer = aToken;
        //request(options, callback);
        //record.recEmit.on('FileReady', function() {
        //    console.log("FileReady Event received");
            //options.multipart.data[1].body = record.micInputStream;
        //    request(options, callback);
        //});
    }
}

function callback(error, response, body) {
    //var respStream = fs.createWriteStream('./response.wav')
    console.log('error:', error); // Print the error if one occurred 
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    console.log('body:', body);
    //respStream.write (JSON.stringify(response));
    //respStream.write (JSON.stringify(body));

    if (!error && response.statusCode == 200) {
        console.log("Received successful response");
        //var info = JSON.parse(body);
        //console.log(JSON.stringify(info));
        //console.log(info.forks_count + " Forks");
    }
}

function getUniqId() {
    myUniqId = uniqid();
    return myUniqId;
};*/

