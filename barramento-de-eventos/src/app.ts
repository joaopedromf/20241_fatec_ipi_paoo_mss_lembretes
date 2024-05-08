import express from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())

app.post('/eventos', (req, res) => {
    const evento = req.body
    console.log(evento)
    //enviando o evento para o mss de lembretes
    axios.post('http://localhost:4000/eventos', evento)
    //enviando o evento para o mss de observações
    axios.post('http://localhost:5000/eventos', evento)
    //enviando o evento para o mss de consulta
    axios.post('http://localhost:6000/eventos', evento)
    //envia o evento para o mss de classificação
    axios.post('http://localhost:7000/eventos', evento)
    res.end()
})

const port = 10000
app.listen(port, () => {
    console.log(`Barramento de eventos. Porta ${port}`)
})