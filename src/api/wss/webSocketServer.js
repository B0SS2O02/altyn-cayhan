const { WebSocketServer } = require('ws')
const crypto = require('crypto')
function objectWebSocketServer() {
    let data
    const wss = new Map();
    function addWebSocketServer(object) {
        wss.set(object);
    }
    function removeWebSocketServer(object) {
        wss.delete(object)
    }
    function getWebSocketServer() {
        return wss
    }
    function setData(object) {
        data = object
    }
    function getData() {
        return data
    }
    async function post(data) {
        let _data = data || getData()
        if (typeof _data === 'object') {
            _data = JSON.stringify(data)
        }
        [...wss.keys()].forEach((client) => {
            client.send(_data);
        });
    }
    return {
        setData,
        removeWebSocketServer,
        getWebSocketServer,
        getData,
        post,
        addWebSocketServer,
    }
}
const wss = new objectWebSocketServer()

const connectWSS = (port = 3002) => {
    sockserver = new WebSocketServer({ port: port })
    sockserver.on('connection', socket => {
        wss.addWebSocketServer(socket)
        console.log('New client connected!')
        socket.on('close', () => {
            console.log('Client has disconnected!')
            wss.removeWebSocketServer(socket)
        })
        socket.onerror = function () {
            console.log('websocket error')
        }
    })
}

module.exports = { connectWSS, wss }

