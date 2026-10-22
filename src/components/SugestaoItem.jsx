import { useState } from 'react'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const [adicionando, setAdicionando] = useState(false)
  const precoValido = Number.isFinite(Number(produto?.price))

  function handleAdicionar() {
    if (!precoValido || produto.estoque === 0 || adicionando) return

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
        className="botao botao-pequeno"
        onClick={handleAdicionar}
        disabled={!precoValido || produto.estoque === 0 || adicionando}
      >
        {adicionando ? 'Adicionando...' : precoValido ? 'Comprar' : 'Indisponível'}
      </button>
    </div>
  )
}
