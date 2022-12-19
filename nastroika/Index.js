const express = require('express')
const app = express()
const port = 3000
// настраиваем приложение , реагировать на запрос
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/samurais', (req, res) => {
  res.send('Hello samurais!!!!')
})
// post запрос 
app.post('/samurais', (req, res) => {
  res.send('We have created samurai!')
})


// слушай порт и извести по старту программы 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

