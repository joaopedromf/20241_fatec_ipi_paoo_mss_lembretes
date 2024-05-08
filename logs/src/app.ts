import express from 'express'
import {v4 as uuidv4} from 'uuid'

const app = express()
app.use(express.json())

const logs: Record<string, string> = {}

app.post('/logs', (req, res) => {
    const log = req.body
    const id = uuidv4()
    logs[id] = `${new Date().toLocaleString().replace(',', '')} - (mss-${log.mss}) ${log.metodo} ${log.caminho}`
})

app.get('/logs', (req, res) => {
    res.status(200).json(logs)
})

const port = 11000
app.listen(port, () => {
    console.log(`Logs. Porta ${port}.`)
})