const http = require('http'); 
const url = require('url');
const PORT = process.env.PORT || 8888;
const GET = 'GET'; const POST = 'POST';
const dictionary = {};
const search_route = '/search/'
const create_route = '/create'
let count = 0;
let request = 0;
let reply;
http.createServer(function(req,res){
    res.writeHead(200, {
        "Content-Type": "text/HTML",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
    
    });
    const { pathname, query } = url.parse(req.url, true);
    if(req.method === GET){
        if(pathname === search_route){
        const term = query.term
        request += 1;
        if(term in dictionary){
            reply = `${term}: ${dictionary[term]}`;
        }
        else{
            reply = `Request # ${request}, word ${term} not found!`;
        }
        res.end(JSON.stringify(reply));
    }
    } else if (req.method === POST) {
        if(pathname === create_route){
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
    }
}).listen(PORT);
