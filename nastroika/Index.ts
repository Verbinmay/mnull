const express = require('express')
const app = express()
const port = 3000
// настраиваем приложение , реагировать на запрос
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/samurais', (req, res) => {
  const a = 4;
  if (a>5) {
    res.send('OK')
  } else {
    res.send('Hello Word!')
  }
})

// слушай порт и извести по старту программы 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

