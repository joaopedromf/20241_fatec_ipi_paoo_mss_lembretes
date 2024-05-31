import express, { Request } from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())
/*
{
    "1": {
        "id": "1",
        "texto": "Fazer café"
    },
    "2": {
        "id": "2",
        "texto": "Nadar"
    }
}
*/
interface lembrete{
    id: string;
    texto: string;
}
const lembretes: Record <string, lembrete> = {}
let id: string = '1'

const criarLog = (req: Request) => {
    axios.post('http://192.168.15.85:11000/logs', {
        mss: 'lembretes',
        metodo: req.method, 
        caminho: req.path
    })
}

//GET /lembretes obter a coleção de lembretes
app.get('/lembretes', (req, res) => {
    criarLog(req)
    res.json(lembretes)
})

//POST /lembretes cadastrar novo lembrete
app.post('/lembretes', (req, res) => {
    //extrair o texto do corpo da requisição {"texto": "Fazer café"}
    const { texto } = req.body
    //construir um novo lembrete
    const lembrete = {id, texto} // id: id, texto: texto
    //armazenar o novo lembrete
    lembretes[id] = lembrete
    //incremento o id
    id = (+id + 1).toString()
    //emitindo o evento
    axios.post('http://192.168.15.85:10000/eventos', {
        tipo: 'LembreteCriado',
        dados: lembrete
    })
    //criar log
    criarLog(req)
    //responder ao cliente
    res.json(lembrete)
})

//POST /eventos
app.post('/eventos', (req, res) => {
    try{
        console.log(req.body)
    }
    catch(e){}
    res.send()
})

//GET /lembretes/{id} obter um lembrete pelo id
//pesquisar como podemos pegar o id dado que ele faz parte da url
app.get('/lembretes/:id', (req, res) => {
    const { id } = req.params;
    const lembrete = lembretes[id]
    if(lembrete){
        res.json(lembrete)
    }
    else{
        res.status(404).send('Lembrete não encontrado')
    }
    criarLog(req)
})

const port = 4000
app.listen(port, () => {
    console.log('Nova versão')
    console.log('Agora usando o Docker Hub')
    console.log(`Lembretes. Porta ${port}.`)
})