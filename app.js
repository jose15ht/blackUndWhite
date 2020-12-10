const yargs = require('yargs')
const http = require('http')
const jimp = require('jimp')
const fs = require('fs')
const url = require('url')

const key = '123'

const arvg = yargs.command(
  'login',
  'comando para iniciar el servidor',
  {
    key:{
      description: 'llave de ingreso',
      demand: true,
      alias: 'k'
    }
  },
  (args) => {
    if(args.key == key) {
      greyImage()
    } else {
      console.log('Llave inválida')
    }
  }
).help().argv


function greyImage(){
  http.createServer((req, res) => {
    if(req.url == '/'){
        res.writeHead(200, { 'Content-Type' : 'text/html'})
        fs.readFile('index.html','utf8', (err, file) => {
            res.end(file)
        })
    } else if (req.url == '/style.css') {
        res.writeHead(200, { 'Content-Type' : 'text/css'})
        fs.readFile('style.css', (err, file) => {
            res.end(file)
        })
    } else if (req.url.includes('/submit')) {
        const params = url.parse(req.url, true).query
        const image = params.image
          jimp.read(image, (err, img) => {
            img.resize(350, jimp.AUTO)
               .quality(60) 
               .grayscale() 
               .writeAsync('newImg.jpg')
               .then(()=>{
                   fs.readFile('newImg.jpg', (err, pic) =>{
                       res.writeHead(200, { 'Content-Type': 'image/jpeg'})
                       res.end(pic)
                   })
               })
        }) 
    }
}).listen(3000, () => console.log('Atento al server'))
}
