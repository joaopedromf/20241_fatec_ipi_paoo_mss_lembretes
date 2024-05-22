import express from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())
const palavraChave = "importante"

interface Observacao{
    id: string;
    texto: string;
    lembreteId: string;
    status: string;
}

interface Evento{
    tipo: string,
    dados: {}
}

const funcoes: Record<string, Function> = {
    ObservacaoCriada: (observacao: Observacao) => {
        //use um if/else para fazer essa logica, atualizando o status da observação
        observacao.status = observacao.texto.includes(palavraChave) ?  'importante' : 'comum'
        //a seguir emita um evento direcionando ao barramento do tipo ObservacaoClassificada
        axios.post('http://192.168.15.85:10000/eventos', {
            tipo: 'ObservacaoClassificada',
            dados: { ...observacao }
        })
    }
}

app.post('/eventos', (req, res) => {
    try{
        console.log(req.body)
        funcoes[req.body.tipo](req.body.dados)
    }
    catch(e){
        res.end()
    }
})

const port = 7000
app.listen(port, async () => {
    console.log(`Classificação. Porta ${port}`)
    const result = await axios.get('http://192.168.15.85:10000/eventos');
    result.data.forEach((valor: Evento, indice: number, colecao: Evento[]) => {
        try{
            funcoes[valor.tipo](valor.dados);
        }
        catch(e){}
    })
})