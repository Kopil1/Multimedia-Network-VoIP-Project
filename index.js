const program = require('commander')
const net = require('net')
const mic = require('mic')
const Speaker = require('speaker')
const package = require('./package.json')

program
  .version(package.version)
  .option('-c, --connect <host:port>')
  .option('-l, --listen <port>')
  .option('-i, --input ')
  .option('-o, --output')

  .parse(process.argv)

const mode = !program.connect ? 'listen' : 'connect'

let speakerConfig = {

    channels: 2,
    bitDepth: 16, // for noise reduction
    sampleRate: 44100, // voice speed

}

let micConfig = {

    encoding: 'signed-integer',
    channels: 2,
    bitwidth: 16,
    rate: 44100,
    
}

console.log('Mode: ' + mode)
console.log('\nSpeaker config')
console.log(speakerConfig)
console.log('\nMic config')
console.log(micConfig)

function setupTvoipStream(socket) {
    socket.on('error', error => {
        console.error("Socket-error: " + error)
    })
    let micInstance = mic(micConfig)
    let micInputStream = micInstance.getAudioStream()

    micInputStream.on('error', err => {
        console.error("Mic-Error" + err)
    })

    let speakerInstance = new Speaker(speakerConfig)
    speakerInstance.on('open', () => {
        console.log("Speaker : open")
    })
    speakerInstance.on('close', () => {
        console.log("Speaker : close")
    })
    socket.pipe(speakerInstance)

    micInputStream.pipe(socket) 
    micInstance.start()
    
}


if (mode === 'listen') {
    console.log('--listen: ' + program.listen)
    const server = net.createServer()

    server.on('connection', socket => {
        console.log('A client has connected.')
        setupTvoipStream(socket)
    })
    server.listen(program.listen, () => {
        console.log('Server is listening')
    })
} else {
    const host = program.connect.split(':')[0]
    const port = program.connect.split(':')[1]
    console.log('Host: ' + host)
    console.log('Port: ' + port)

    function tvoipConnect(host, port) {
        const client = new net.Socket()

        client.connect({host: host, port: port}, ()=>{
            console.log('Connected to server.')
            setupTvoipStream(client)
        })
    }
    
    tvoipConnect(host, port)
}