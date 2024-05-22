import express, { Request } from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())

interface Observacao{
    id: string,
    texto: string,
    lembreteId: string
}

interface Lembrete{
    id: string;
    texto: string;
    observacoes?: Observacao[]
}

interface Evento{
    tipo: string,
    dados: {}
}

const baseConsolidada: Record<string, Lembrete> = {}

const funcoes: Record<string, Function> = {
    LembreteCriado: (lembrete: Lembrete) => {
        baseConsolidada[lembrete.id] = lembrete
    },
    ObservacaoCriada: (observacao: Observacao) => {
        //1. pego o lembrete a que a observacao que acabou de chegar esta associada e dele acesso a coleção de observações na base consolidada, se ela existir
        //2 caso contrário, pego uma coleção vazia
        const observacoes = baseConsolidada[observacao.lembreteId]['observacoes'] || []
        //3. adiciono a observação nesta coleção
        observacoes.push(observacao)
        //4. acesso a base consolidada indexando-a de lembreteId, dele pego a chave observacoes e a ela associo a nova coleção
        baseConsolidada[observacao.lembreteId]['observacoes'] = observacoes
    },
    //tratar ObservacaoAtualizada
    //substituir a observacao existente no banco, pela nova. Encontre ela pelo id e substitua
    ObservacaoAtualizada: (observacao: Observacao) => {
        const observacoesAux: Observacao[] = baseConsolidada[observacao.lembreteId]['observacoes']!
        const indice = observacoesAux?.findIndex(o => o.id === observacao.id)!
        observacoesAux[indice] = observacao
    }
}

const criarLog = (req: Request) => {
    axios.post('http://192.168.15.85:11000/logs', {
        mss: 'consulta',
        metodo: req.method, 
        caminho: req.path
    })
}

app.get('/lembretes', (req, res) => {
    criarLog(req)
    res.status(200).json(baseConsolidada)
})

app.post('/eventos', (req, res) => {
    //{tipo: ....., dados: ......}
    try{
        console.log(req.body)
        funcoes[req.body.tipo](req.body.dados)
    }
    catch(e){
        res.end()
    }
})

const port = 6000
app.listen(port, async () => {
    console.log(`Consulta. Porta ${port}`)
    const result = await axios.get('http://192.168.15.85:10000/eventos');
    result.data.forEach((valor: Evento, indice: number, colecao: Evento[]) => {
        try{
            funcoes[valor.tipo](valor.dados);
        }
        catch(e){}
    })
})