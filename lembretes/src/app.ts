import express from 'express'
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
//GET /lembretes obter a coleção de lembretes
app.get('/lembretes', (req, res) => {
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
    //responder ao cliente
    res.json(lembrete)
})

//GET /lembretes/{id} obter um lembrete pelo id
//pesquisar como podemos pegar o id dado que ele faz parte da url
app.get('', (req, res) => {

})

const port = 4000
app.listen(port, () => console.log(`Lembretes. Porta ${port}.`))