'use strict';


// 导入http模块:
var http = require('http');//http 模块
var url  = require('url');//地址模块
var fs   = require('fs');//文件读取模块
var path = require('path');//路径模块
var express = require('express');
let Web3 = require('web3');//导入web3模块

let web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
console.log("good");
var abi =[{"constant":false,"inputs":[],"name":"Adduser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"setChannel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"left","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"pay","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"input","type":"uint256"},{"name":"output","type":"uint256"}],"name":"setIO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getUserInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getCurrentNum","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buildChannel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getDonator","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"t","type":"uint256"}],"name":"getAvailable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getChannel","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userlist","outputs":[{"name":"addr","type":"address"},{"name":"IsConsumer","type":"bool"},{"name":"hadPaid","type":"bool"},{"name":"amount","type":"uint256"},{"name":"channelIndex","type":"uint256"},{"name":"isInUsed","type":"bool"},{"name":"isVaild","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_index","type":"uint256"}],"name":"Index","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_amount","type":"uint256"}],"name":"IO","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_IsConsumer","type":"uint256"}],"name":"hadPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_channelIndex","type":"uint256"}],"name":"channelIndex","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_finish","type":"uint256"}],"name":"buildChan","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_left","type":"uint256"}],"name":"canLeave","type":"event"},{"anonymous":false,"inputs":[],"name":"addSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_amount","type":"uint256"},{"indexed":false,"name":"_channelIndex","type":"uint256"},{"indexed":false,"name":"_IsConsumer","type":"uint256"}],"name":"InfoEvent","type":"event"}];

//得到合约对象;

var address = "0x650d10b262d8f3985cd80352a26449204d73e35b";
var metacoin = web3.eth.contract(abi).at(address);
console.log(web3.eth.accounts[0]);
let addr;
let accounts = web3.eth.accounts;

console.log(accounts);

// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:
    console.log(request.method + ': ' + request.url);

    var pathname = url.parse(request.url).path;

    console.log(pathname);
    if(pathname === '/')
    {
    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});
    // 将HTTP响应的HTML内容写入response:
    var filepath = path.join('.',pathname,'/HTML/index.html');
    console.log(filepath + '1');
    
    fs.stat(filepath,function(err,stats){
        if(!err && stats.isFile())
        {
            console.log('200 ' + request.url);
            response.writeHead(200);
            fs.createReadStream(filepath).pipe(response);
        }else
        {
            console.log('404 ' + request.url);
            response.writeHead(404);
            response.end('404 Not Found');
        }
    });
    }
    else if(pathname[1] === 'A')
    {
        console.log("AddUser");
        addr = pathname.slice(2);
        console.log(addr+'3');
        for(var i in accounts)
        {
            if(addr === accounts[i])
            {
                console.log(accounts[i]);

                //init
                var value =  metacoin.getCurrentNum.call();
                console.log(value);
                var str = "";
                for(var i = 0;i < value;i++)
                {
                    str += metacoin.getAvailable.call(String(i));
                    console.log(str);
                    str += ",";
                }
                str = value + "," + str;
                str += "/";
                console.log(str);
                //add user
                metacoin.Adduser.sendTransaction({from:addr,gas:100000
                },function(err,result){
                    if(!err)
                    {
                        console.log(err + "result :" + result + "1");
                        // getuserinfo trans : infoevent watch
                    }
                    else{
                        console.log(err);
                    }
                });
                        var InfoEvent = metacoin.InfoEvent();
                        var respstr = '';
                        metacoin.getUserInfo.sendTransaction({from:addr,gas:100000
                        },function(err,result){
                            console.log(err + "result :" + result + "2");
                        });
                        InfoEvent.watch(function(err,result){
                            if(!err)
                            {
                                console.log("user Info : ");
                                console.log("amount : " + result.args._amount);
                                console.log("channel Index : "+result.args._channelIndex);
                                console.log("Consumer : " + result.args._IsConsumer);
                               respstr = "1,"+result.args._amount+","+result.args._channelIndex+","+result.args._IsConsumer;
                               str += respstr;
                               response.end(str);
                            }
                            else
                            {
                               respstr = "0,"+err;
                               response.end( str+respstr);
                            }
                            InfoEvent.stopWatching(); 
                            console.log(str);  
                        });
            

                console.log("2");
               
                break;
              
            }
            console.log("i");

        }         
    }
    else if(pathname[1] === 'B')
    {
        console.log("BuildChanel");
        //build channel
        var str;
        metacoin.buildChannel.sendTransaction({from:addr,gas:100000
        },function(err,result){
            console.log(err + "result :" + result);
        });
        var buildChanEvent = metacoin.buildChan();
        buildChanEvent.watch(function(err,result){
            if(!err)
            {
                var str = "";
                str += result.args._finish;
                console.log("build channel: " + str);//_finish = 1 if complete
                response.end(str);
                console.log("success");
             }
            else 
            {
                console.log(err);
            }
            buildChanEvent.stopWatching();
        });
        


        
    }
    else if(pathname[1] === 'P')
    {
        

            console.log("Pay: " + pathname);
            // io transaction : io watch
            var IOEvent1 = metacoin.IO();
            var hadPaidEvent = metacoin.hadPaid();
            var value = pathname.split(',');
            metacoin.setIO.sendTransaction(value[1],value[2],{from:addr,gas:100000
            },function(err,result){
                console.log(err + "result :" + result);
                t = metacoin.getAmount.call();
                console.log(String(t));
            });
            IOEvent1.watch(function(err,result){
            if(!err)
            {
                t = result.args._amount;
                console.log("Pay _amount : "+ t);
                IOEvent1.stopWatching();

                //pay transaction : hadpay watch and io watch
                metacoin.pay.sendTransaction({from:addr,gas:100000,value:t
                },function(err,result){
                    console.log(err + "result :" + result);
                    console.log("amount:"+metacoin.getAmount.call());
                });
                hadPaidEvent.watch(function(err,result){
                    if(!err)
                    {
                        var value = String(result.args._isConsumer);
                        console.log("pay : "+ value);
                            response.end(value);
                    }
                    else
                    {
                        console.log("payerr: " + err);
                    }
                    hadPaidEvent.stopWatching();
                });
            }
            else
            {
                console.log(err);
            }
            IOEvent1.stopWatching();
        });
    }
    else if(pathname[1] == 'L')
    {
        console.log("Leave");  
        var value = pathname.split(',');
        var IOEvent1  = metacoin.IO();
        var t;
        metacoin.setIO.sendTransaction(value[1],value[2],{from:addr,gas:100000
        },function(err,result){
            console.log(err + "result :" + result);
        });
        IOEvent1.watch(function(err,result){
            if(!err)
            {
                t = result.args._amount;
                IOEvent1.stopWatching();
                console.log("Leave Amount : "+ t);
                metacoin.left.sendTransaction({from:addr,gas:100000
                },function(err,result){
                    console.log(err + "result :" + result);
                });
                response.end('1');

            }
            else
            {
                console.log(err);
            }
            IOEvent1.stopWatching();
        });
    }
    else if(pathname[1] == 'T')//set channel
    {
        var value = pathname.split(',');
        //setchannel trans: index watch, channelIndex watch
        var IndexEvent = metacoin.Index();
        metacoin.setChannel.sendTransaction(value[1],{from:addr,gas:100000
        },function(err,result){
            console.log(err + "result :" + result);
        });
        IndexEvent.watch(function(err,result){
            if(!err)
            {
                var str = "" + result.args._index;
                console.log("event Index: " + str);
                response.end(str);
            }
            else 
            {
                console.log(err);
                response.end("" +err);
            }
            IndexEvent.stopWatching();
        });
    }
    
    /*
    else if(pathname[1] == 'I') // init the channel
    {
        var value =  metacoin.getCurrentNum.call();
        console.log(value);
        
        var str = "";
        for(var i = 0;i < value;i++)
        {
            str += metacoin.getAvailable.call(String(i));
            console.log(str);
            str += ",";
        }
        str = value + "," + str;
        response.end(str);
    }*/
    else 
    {
        var filepath = path.join('.',pathname);
        console.log(filepath + '2');
        fs.stat(filepath,function(err,stats){
            if(!err&&stats.isFile())
            {
                console.log('200' + request.url);
                response.writeHead(200);
                fs.createReadStream(filepath).pipe(response);
            }else
            {
                console.log('404 ' + request.url);
                response.writeHead(404);
                response.end('404 Not Found');
            }
        });    
    }

});

// 让服务器监听8088端口:
server.listen(3000);

console.log('Server is running at http://127.0.0.1:3000/'); 