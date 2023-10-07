const http = require('http'); const url = require('url');
const GET = 'GET'; const POST = 'POST';
const dictionary = {}
http.createServer(function(req,res){
    res.writeHead(200, {
        "Content-Type": "text/HTML",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
    
    });
    if(req.method === GET){
        const q = url.parse(req.url, true);
        if(q.query["term"] in dictionary){
            res.end(`${dictionary[q.query["term"]]}`);
        }
        else{
        res.end("Item not found");
        }
    } else if (req.method === POST) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString(); // convert buffer to string
        });
        
        req.on('end', () => {
            const data = JSON.parse(body);
            dictionary[data.term] = data.definition
            console.log(dictionary)
            res.end(`Received: ${data.term} and ${data.definition} `);
        });
    }
}).listen(8888);
