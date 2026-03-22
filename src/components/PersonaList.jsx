import { useState, useMemo } from 'react'

const PAGE_SIZE = 10

export default function PersonaList({ personas, loading, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('apellidos')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return personas.filter(p =>
      !q ||
      p.nombre?.toLowerCase().includes(q) ||
      p.apellidos?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.telefono?.toLowerCase().includes(q)
    )
  }, [personas, search])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[sortField]?.toLowerCase() ?? ''
      const vb = b[sortField]?.toLowerCase() ?? ''
      return sortDir === 'asc' ? va.localeCompare(vb, 'es') : vb.localeCompare(va, 'es')
    })
  }, [filtered, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageData = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1) }

  const sortIcon = (field) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>
    return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const pageNumbers = () => {
    const pages = []
    const delta = 2
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, apellidos, email o teléfono..."
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '1rem' }}
              onClick={() => { setSearch(''); setPage(1) }}
            >✕</button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-info">
          {loading
            ? 'Cargando...'
            : `${filtered.length} persona${filtered.length !== 1 ? 's' : ''}${search ? ` encontrada${filtered.length !== 1 ? 's' : ''}` : ' en total'}`
          }
        </div>

        <table>
          <thead>
            <tr>
              <th style={{ width: 55 }}>ID</th>
              <th onClick={() => handleSort('nombre')}>Nombre {sortIcon('nombre')}</th>
              <th onClick={() => handleSort('apellidos')}>Apellidos {sortIcon('apellidos')}</th>
              <th className="col-telefono" onClick={() => handleSort('telefono')}>Teléfono {sortIcon('telefono')}</th>
              <th className="col-email" onClick={() => handleSort('email')}>Email {sortIcon('email')}</th>
              <th style={{ width: 150 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="state-row">
                <td colSpan={6}><span className="spinner" />Cargando datos...</td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr className="state-row">
                <td colSpan={6}>{search ? 'No se encontraron resultados.' : 'No hay personas registradas.'}</td>
              </tr>
            ) : (
              pageData.map(p => (
                <tr key={p.id}>
                  <td className="td-id">#{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellidos}</td>
                  <td className="td-secondary col-telefono">{p.telefono || <span className="td-empty">—</span>}</td>
                  <td className="td-secondary col-email">{p.email || <span className="td-empty">—</span>}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-warning btn-sm" onClick={() => onEdit(p)}>✏️ Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(p)}>🗑 Borrar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && sorted.length > 0 && (
          <div className="pagination">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="pagination-buttons">
              <button className="page-btn" onClick={() => setPage(1)} disabled={currentPage === 1}>«</button>
              <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
              {pageNumbers().map(n => (
                <button
                  key={n}
                  className={`page-btn ${n === currentPage ? 'active' : ''}`}
                  onClick={() => setPage(n)}
                >{n}</button>
              ))}
              <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
              <button className="page-btn" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>»</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
