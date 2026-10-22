import { useState } from 'react'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const [adicionando, setAdicionando] = useState(false)
  const precoValido = Number.isFinite(Number(produto?.price))
  const podeAdicionar = precoValido && produto.estoque > 0 && !adicionando

  function handleAdicionar() {
    if (!podeAdicionar) return

    setAdicionando(true)
    onAdicionar(produto)

    window.setTimeout(() => {
      setAdicionando(false)
    }, 300)
  }

  return (
    <div className="sugestao">
      <div className="sugestao-imagem-moldura">
        <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
      </div>
      <div className="sugestao-info">
        <p className="sugestao-titulo">{produto.title}</p>
        <p className="preco preco-pequeno">{formatarPreco(produto.price)}</p>
      </div>
      <button
        type="button"
        className="botao botao-pequeno"
        onClick={handleAdicionar}
        disabled={!podeAdicionar}
      >
        {adicionando ? 'Adicionando...' : precoValido ? 'Comprar' : 'Indisponível'}
      </button>
    </div>
  )
}
