const fs = require ('fs')
const server = http.createServer((request, response)=> {
    switch(reques.url){
        case '/home': {
            const data = 'best free online course'
            response.write(data)
            response.end()
            break;
        }
        default:{
            response.write('404 not found')
            response.end()
        }
    }
})
server.listen(3003)