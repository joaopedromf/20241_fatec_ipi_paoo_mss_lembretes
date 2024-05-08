import express, { Request } from 'express'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
const app = express()
app.use(express.json())

/* 
a estrutura da base de observações...
{
    "1": [
        {
            "id": "100",
            "texto": "Comprar açúcar"
        },
        {
            "id": "101",
            "texto": "Ver um filme"
        },
    ]
}
*/
interface Observacao{
    id: string;
    texto: string;
}
const observacoes: Record<string, Observacao[]> = {}

const criarLog = (req: Request) => {
    axios.post('http://localhost:7000/logs', {
        mss: 'observacoes',
        metodo: req.method, 
        caminho: req.path
    })
}

//POST /lembretes/123456/observacoes
app.post('/lembretes/:id/observacoes', (req, res) => {
    //1. gerar id de observação (descobrir como usar a versão 4 do uuid Typescript)
    const idObs = uuidv4()
    //2. extrair o texto do corpo da requisição
    const { texto } = req.body
    //3. pegar a coleção de observações do lembrete cujo id se encontra na url, caso exista. Caso contrário, pego uma coleção nova, vazia.
    const observacoesDoLembrete: Observacao[] = observacoes[req.params.id] || []
    //4. Na coleção pega no passo anterior, adiciono um novo objeto caracterizado por id e texto
    const obs = {id: idObs, texto}
    observacoesDoLembrete.push(obs)
    //5. Atualizar o ponteiro na base global para que ele aponte para a coleção que contém a nova observação
    observacoes[req.params.id] = observacoesDoLembrete
    //três potinhos é o operador spread
    //emitindo um evento
    axios.post('http://localhost:10000/eventos', {
        tipo: 'ObservacaoCriada',
        dados: {...obs, lembreteId: req.params.id}
    })
    //criar log
    criarLog(req)
    //6. Responder para o cliente com o status 201 e entregando a ele a coleção atualizada
    res.status(201).json(observacoesDoLembrete)
})

//GET /lembretes/123456/observacoes
app.get('/lembretes/:id/observacoes', (req, res) => {
    criarLog(req)
    res.json(observacoes[req.params.id] || []);
})

app.post('/eventos', (req, res) => {
    console.log(req.body)
    res.send()
})

const port = 5000
app.listen(port, () => {
    console.log(`Observações. ${port}.`)
})