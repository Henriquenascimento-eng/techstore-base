import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarAviso }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nomeAviso, setNomeAviso] = useState('')
  const [emailAviso, setEmailAviso] = useState('')
  const [mensagemAviso, setMensagemAviso] = useState('')
  const [produtoAdicionandoId, setProdutoAdicionandoId] = useState(null)

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const precoValido = Number.isFinite(Number(produto?.price))
  const esgotado = produto.estoque === 0
  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && item.estoque > 0)
    .slice(0, 4)

  function enviarAviso(evento) {
    evento.preventDefault()

    if (!nomeAviso.trim() || !emailAviso.trim()) {
      setMensagemAviso('Preencha nome e e-mail para receber o aviso.')
      return
    }

    onRegistrarAviso(produto.id, {
      nome: nomeAviso.trim(),
      email: emailAviso.trim(),
    })

    setMensagemAviso('Você foi cadastrado para receber o aviso quando o produto voltar.')
    setNomeAviso('')
    setEmailAviso('')
  }

  function handleAdicionar(item) {
    if (item.estoque === 0 || !Number.isFinite(Number(item.price)) || produtoAdicionandoId === item.id) {
      return
    }

    setProdutoAdicionandoId(item.id)
    onAdicionar(item)

    window.setTimeout(() => {
      setProdutoAdicionandoId(null)
    }, 300)
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoValido ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}` : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          <button
            className="botao botao-grande"
            onClick={() => handleAdicionar(produto)}
            disabled={esgotado || !precoValido || produtoAdicionandoId === produto.id}
          >
            {produtoAdicionandoId === produto.id
              ? 'Adicionando...'
              : precoValido
                ? 'Adicionar ao carrinho'
                : 'Indisponível'}
          </button>

          {esgotado && (
            <form onSubmit={enviarAviso} className="cupom" style={{ marginTop: '1rem' }}>
              <label htmlFor="nome-aviso" className="rotulo">
                Receber aviso quando o produto voltar
              </label>
              <input
                id="nome-aviso"
                value={nomeAviso}
                onChange={(evento) => setNomeAviso(evento.target.value)}
                placeholder="Seu nome"
                style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
              />
              <input
                type="email"
                value={emailAviso}
                onChange={(evento) => setEmailAviso(evento.target.value)}
                placeholder="Seu e-mail"
                style={{ display: 'block', marginBottom: '0.5rem', width: '100%' }}
              />
              <button type="submit" className="botao botao-secundario">
                Avise-me
              </button>
            </form>
          )}

          {mensagemAviso && <p className="aviso">{mensagemAviso}</p>}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">
              {Number.isFinite(Number(item.price))
                ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')}`
                : 'Preço indisponível'}
            </p>
            <button
              className="botao"
              onClick={() => handleAdicionar(item)}
              disabled={!Number.isFinite(Number(item.price)) || item.estoque === 0 || produtoAdicionandoId === item.id}
            >
              {produtoAdicionandoId === item.id
                ? 'Adicionando...'
                : Number.isFinite(Number(item.price))
                  ? 'Adicionar ao carrinho'
                  : 'Indisponível'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
