const { response } = require('express');
const http = require('http'); const url = require('url');
const GET = 'GET'; const POST = 'POST';
const dictionary = {};
let count = 0;
let request = 0;
let reply;
http.createServer(function(req,res){
    res.writeHead(200, {
        "Content-Type": "text/HTML",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
    
    });
    if(req.method === GET){
        request += 1;
        const q = url.parse(req.url, true);
        if(q.query["term"] in dictionary){
            reply = `${q.query["term"]}: ${dictionary[q.query["term"]]}`;
        }
        else{
            reply = `Request # ${request}, word ${q.query["term"]} not found!`;
        }
        res.end(JSON.stringify(reply));
    } else if (req.method === POST) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString(); // convert buffer to string
        });
        
        req.on('end', () => {
            const data = JSON.parse(body);
            if(data.term in dictionary){
                reply = "Warning, item already exists"
            }
            else{
                dictionary[data.term] = data.definition;
                count += 1;
                reply = `Request # ${count}\nNew entry recorded:\n"${data.term} : ${data.definition}"`
            }
            res.end(JSON.stringify(reply));
        })
    }
}).listen(8888);
