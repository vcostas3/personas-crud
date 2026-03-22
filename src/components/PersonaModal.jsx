import { useState, useEffect } from 'react'

export default function PersonaModal({ persona, onSave, onClose }) {
  const isEdit = !!persona?.id

  const [form, setForm] = useState({ nombre: '', apellidos: '', telefono: '', email: '', direccion: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (persona) setForm({
      nombre:    persona.nombre    || '',
      apellidos: persona.apellidos || '',
      telefono:  persona.telefono  || '',
      email:     persona.email     || '',
      direccion: persona.direccion || '',
    })
  }, [persona])

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'El nombre es obligatorio'
    if (!form.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'El email no tiene un formato válido'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSaving(true)
    await onSave({
      nombre:    form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      telefono:  form.telefono.trim()  || null,
      email:     form.email.trim()     || null,
      direccion: form.direccion.trim() || null,
    })
    setSaving(false)
  }

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }))
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? '✏️ Editar Persona' : '➕ Nueva Persona'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={handleChange('nombre')}
                  className={errors.nombre ? 'error' : ''}
                  placeholder="Ej: Carlos"
                  autoFocus
                />
                {errors.nombre && <p className="field-error">{errors.nombre}</p>}
              </div>

              <div className="form-group">
                <label>Apellidos *</label>
                <input
                  type="text"
                  value={form.apellidos}
                  onChange={handleChange('apellidos')}
                  className={errors.apellidos ? 'error' : ''}
                  placeholder="Ej: García López"
                />
                {errors.apellidos && <p className="field-error">{errors.apellidos}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange('telefono')}
                  placeholder="Ej: 612 345 678"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  className={errors.email ? 'error' : ''}
                  placeholder="Ej: carlos@email.com"
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={form.direccion}
                onChange={handleChange('direccion')}
                placeholder="Ej: Calle Mayor 1, Madrid"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" />Guardando...</> : (isEdit ? 'Guardar cambios' : 'Crear persona')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
