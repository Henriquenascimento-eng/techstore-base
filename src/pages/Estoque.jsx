import { formatarPreco } from '../utils/formatarPreco'

export default function Estoque({ produtos, listaEspera = [] }) {
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const pessoasPorProduto = listaEspera.reduce((acumulador, registro) => {
    const chave = registro.produtoId
    acumulador[chave] = acumulador[chave] || []
    acumulador[chave].push(registro)
    return acumulador
  }, {})

  const produtosComEspera = produtos.filter((produto) => pessoasPorProduto[produto.id]?.length)
  const produtosSemPreco = produtos.filter((produto) => !Number.isFinite(Number(produto.price)))

  const resumoPorCategoria = Object.values(
    produtos.reduce((acumulador, produto) => {
      const categoria = produto.category
      const produtoAtual = acumulador[categoria] || {
        categoria,
        valorEstoque: 0,
        lucroEstimado: 0,
        clientesEsperando: 0,
        produtosSemPreco: 0,
        itensEmRisco: 0,
      }

      const precoValido = Number.isFinite(Number(produto.price))
      const quantidade = Number(produto.estoque) || 0

      if (precoValido) {
        const valorProduto = Number(produto.price) * quantidade
        produtoAtual.valorEstoque += valorProduto
        produtoAtual.lucroEstimado += valorProduto * 0.35
      } else {
        produtoAtual.produtosSemPreco += 1
      }

      if (produto.estoque === 0) {
        produtoAtual.itensEmRisco += 1
      }

      if (pessoasPorProduto[produto.id]?.length) {
        produtoAtual.clientesEsperando += pessoasPorProduto[produto.id].length
      }

      acumulador[categoria] = produtoAtual
      return acumulador
    }, {})
  ).sort((a, b) => b.valorEstoque - a.valorEstoque)

  const valorTotalEstoque = resumoPorCategoria.reduce((total, item) => total + item.valorEstoque, 0)
  const lucroTotalEstimado = resumoPorCategoria.reduce((total, item) => total + item.lucroEstimado, 0)
  const clientesEsperando = listaEspera.length

  return (
    <section className="dashboard-lojista">
      <p className="sobretitulo">Área interna</p>
      <h1>Painel do lojista</h1>

      <div className="dashboard-grid">
        <article className="dashboard-card dashboard-card-destaque">
          <span>Valor em estoque</span>
          <strong>{formatarPreco(valorTotalEstoque)}</strong>
          <small>Receita potencial se vender tudo hoje</small>
        </article>

        <article className="dashboard-card">
          <span>Clientes aguardando</span>
          <strong>{clientesEsperando}</strong>
          <small>Na fila de reposição</small>
        </article>

        <article className="dashboard-card">
          <span>Produtos sem preço</span>
          <strong>{produtosSemPreco.length}</strong>
          <small>Esperando o time de suprimentos</small>
        </article>

        <article className="dashboard-card">
          <span>Lucro estimado</span>
          <strong>{formatarPreco(lucroTotalEstimado)}</strong>
          <small>Margem bruta estimada</small>
        </article>
      </div>

      <div className="tabela-moldura tabela-dashboard">
        <table className="tabela">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Valor em estoque</th>
              <th>Lucro estimado</th>
              <th>Fila de espera</th>
              <th>Produtos sem preço</th>
            </tr>
          </thead>
          <tbody>
            {resumoPorCategoria.map((categoria) => (
              <tr key={categoria.categoria}>
                <td>{categoria.categoria}</td>
                <td>{formatarPreco(categoria.valorEstoque)}</td>
                <td>{formatarPreco(categoria.lucroEstimado)}</td>
                <td>{categoria.clientesEsperando}</td>
                <td>{categoria.produtosSemPreco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Produtos em estoque</h2>
      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Lista de espera</h2>

      {produtosComEspera.length === 0 ? (
        <p className="aviso">Nenhum cliente está esperando reposição no momento.</p>
      ) : (
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {produtosComEspera.flatMap((produto) =>
                (pessoasPorProduto[produto.id] || []).map((registro) => (
                  <tr key={`${produto.id}-${registro.id}`}>
                    <td>{produto.title}</td>
                    <td>{registro.nome}</td>
                    <td>{registro.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
