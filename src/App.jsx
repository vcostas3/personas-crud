import { useState, useEffect, useCallback } from 'react'
import { supabase, isConfigured } from './lib/supabase'
import PersonaList from './components/PersonaList'
import PersonaModal from './components/PersonaModal'

function NotConfigured() {
  return (
    <>
      <header className="app-header">
        <span className="header-icon">👥</span>
        <h1>Gestión de Personas</h1>
      </header>
      <main className="app-container">
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
          <h2 style={{ marginBottom: '0.75rem', color: '#1a1a2e' }}>Configuración pendiente</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Para conectar con la base de datos, crea el archivo <code style={{ background: '#f0f2f5', padding: '2px 6px', borderRadius: 4 }}>.env</code> en la raíz del proyecto con las credenciales de Supabase:
          </p>
          <pre style={{ background: '#f0f2f5', padding: '1rem', borderRadius: 8, textAlign: 'left', display: 'inline-block', fontSize: '0.88rem' }}>
{`VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui`}
          </pre>
          <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.85rem' }}>
            Luego ejecuta los archivos SQL en <strong>supabase/migration.sql</strong> y <strong>supabase/seed.sql</strong> en el editor SQL de Supabase.
          </p>
        </div>
      </main>
    </>
  )
}

export default function App() {
  if (!isConfigured) return <NotConfigured />
  const [personas, setPersonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)        // null | { mode: 'create'|'edit'|'delete', persona }
  const [toasts, setToasts] = useState([])

  // ── Toast ─────────────────────────────────────
  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  // ── Fetch ──────────────────────────────────────
  const fetchPersonas = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('personas')
      .select('*')
      .order('apellidos', { ascending: true })
    if (error) addToast('Error al cargar los datos', 'error')
    else setPersonas(data)
    setLoading(false)
  }, [addToast])

  useEffect(() => { fetchPersonas() }, [fetchPersonas])

  // ── Create ─────────────────────────────────────
  const handleCreate = async (form) => {
    const { error } = await supabase.from('personas').insert([form])
    if (error) { addToast('Error al crear la persona', 'error'); return }
    addToast('Persona creada correctamente ✓')
    setModal(null)
    fetchPersonas()
  }

  // ── Update ─────────────────────────────────────
  const handleUpdate = async (form) => {
    const { error } = await supabase
      .from('personas')
      .update(form)
      .eq('id', modal.persona.id)
    if (error) { addToast('Error al actualizar la persona', 'error'); return }
    addToast('Persona actualizada correctamente ✓')
    setModal(null)
    fetchPersonas()
  }

  // ── Delete ─────────────────────────────────────
  const handleDelete = async () => {
    const { error } = await supabase
      .from('personas')
      .delete()
      .eq('id', modal.persona.id)
    if (error) { addToast('Error al eliminar la persona', 'error'); return }
    addToast('Persona eliminada correctamente ✓')
    setModal(null)
    fetchPersonas()
  }

  // ── Save router ────────────────────────────────
  const handleSave = (form) => {
    if (modal?.mode === 'edit') handleUpdate(form)
    else handleCreate(form)
  }

  return (
    <>
      <header className="app-header">
        <span className="header-icon">👥</span>
        <h1>Gestión de Personas</h1>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn btn-success"
            onClick={() => setModal({ mode: 'create', persona: null })}
          >
            + Nueva persona
          </button>
        </div>
      </header>

      <main className="app-container">
        <PersonaList
          personas={personas}
          loading={loading}
          onEdit={(p) => setModal({ mode: 'edit', persona: p })}
          onDelete={(p) => setModal({ mode: 'delete', persona: p })}
        />
      </main>

      {/* Add / Edit modal */}
      {(modal?.mode === 'create' || modal?.mode === 'edit') && (
        <PersonaModal
          persona={modal.persona}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm modal */}
      {modal?.mode === 'delete' && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>🗑 Confirmar eliminación</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="confirm-text">
                ¿Estás seguro de que deseas eliminar a{' '}
                <strong>{modal.persona.nombre} {modal.persona.apellidos}</strong>?
                <br /><br />
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === 'success' ? '✓' : '✗'} {t.msg}
          </div>
        ))}
      </div>
    </>
  )
}
