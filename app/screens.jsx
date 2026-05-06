// Screens — Diariamente

const { useState, useEffect, useRef, useMemo } = React;
const { ACCESS, CATEGORIES, EQUIPMENT } = window.DIARIA;

// ─────────────────────────────────────────────────────
// Header (logo + slogan)
// ─────────────────────────────────────────────────────
function AppHeader({ count }) {
  return (
    <div style={{ padding: '14px 18px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 44, height: 50, position: 'relative',
          filter: 'drop-shadow(0 4px 8px rgba(0,102,204,0.35))',
        }}>
          {/* Map pin shape with accessibility wheelchair inside */}
          <svg width="44" height="50" viewBox="0 0 44 50">
            {/* Pin outline (filled blue) */}
            <path d="M22 2
                     C 11 2, 2 10, 2 21
                     C 2 33, 22 48, 22 48
                     C 22 48, 42 33, 42 21
                     C 42 10, 33 2, 22 2 Z"
              fill="#0066CC"/>
            {/* White circle inside */}
            <circle cx="22" cy="20" r="13" fill="white"/>
            {/* Wheelchair symbol inside the white circle */}
            <g fill="#0066CC">
              {/* head */}
              <circle cx="25" cy="13" r="2"/>
              {/* body + leg path */}
              <path d="M23.5 16.5
                       c-1 0-1.8.7-2 1.7
                       l-1 4
                       c-.3 1 .5 2 1.5 2
                       l3.5 0
                       l1.8 4
                       c.3.7 1.1 1 1.8.7
                       c.7-.3 1-1.1.7-1.8
                       l-2.2-5
                       c-.3-.6-.9-1-1.6-1
                       l-2.2 0
                       l.4-1.8
                       l2.2 0
                       c1 0 1.8-.8 1.8-1.8
                       c0-1-.8-1.8-1.8-1.8
                       l-2.9 0 z"/>
              {/* wheel */}
              <circle cx="20" cy="23" r="5" fill="none" stroke="#0066CC" strokeWidth="1.6"/>
              <circle cx="20" cy="23" r="1"/>
            </g>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Diariamente
          </div>
          <div style={{ fontSize: 11.5, color: '#6B7785', marginTop: 2, fontWeight: 500 }}>
            Tu ciudad, accesible para todos
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 999, background: '#F1F5F9',
          display: 'grid', placeItems: 'center', color: '#0B1220',
        }}>
          <Icon name="user" size={20} />
        </div>
      </div>

      {/* Search */}
      <div style={{
        marginTop: 12, display: 'flex', alignItems: 'center', gap: 8,
        background: '#F1F5F9', borderRadius: 14, padding: '11px 14px',
      }}>
        <Icon name="search" size={18} stroke="#6B7785" />
        <div style={{ color: '#6B7785', fontSize: 14, fontWeight: 500 }}>Buscar lugar o dirección…</div>
        <div style={{ marginLeft: 'auto', fontSize: 11, color: '#0066CC', fontWeight: 700 }}>
          {count} lugares
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Filter chips
// ─────────────────────────────────────────────────────
function FilterRow({ active, onToggle }) {
  return (
    <div className="no-scrollbar" style={{
      display: 'flex', gap: 8, padding: '4px 18px 12px',
      overflowX: 'auto',
    }}>
      {CATEGORIES.map(c => {
        const on = active.includes(c.id);
        return (
          <button key={c.id}
            onClick={() => onToggle(c.id)}
            className={on ? 'chip-active' : ''}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 13px', borderRadius: 999,
              border: '1px solid #E2E8F0', background: 'white',
              fontSize: 12.5, fontWeight: 600, color: '#0B1220',
              whiteSpace: 'nowrap', cursor: 'pointer',
              transition: 'all 0.15s',
            }}>
            <Icon name={c.icon} size={14} />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Legend
// ─────────────────────────────────────────────────────
function Legend() {
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 500,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
      borderRadius: 12, padding: '8px 10px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      fontSize: 10.5, fontWeight: 600,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {Object.values(ACCESS).map(a => (
        <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: a.color, border: '1.5px solid white', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }}/>
          <span>{a.short}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Place detail sheet
// ─────────────────────────────────────────────────────
function PlaceSheet({ place, onClose, onFav, isFav }) {
  if (!place) return null;
  const acc = ACCESS[place.access];
  const cat = CATEGORIES.find(c => c.id === place.cat);
  const eqList = EQUIPMENT.filter(e => place.eq[e.id]);
  const eqMissing = EQUIPMENT.filter(e => !place.eq[e.id]);

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1100,
      background: 'white', borderRadius: '20px 20px 0 0',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.18)',
      maxHeight: '70%', overflowY: 'auto', overflowX: 'hidden',
    }} className="sheet-in no-scrollbar">

      {/* Drag handle */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: '#D1D9E2' }}/>
      </div>

      {/* Close */}
      <button onClick={onClose}
        style={{
          position: 'absolute', top: 14, right: 14, width: 30, height: 30,
          borderRadius: 999, background: '#F1F5F9', border: 'none',
          display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}>
        <Icon name="x" size={16} />
      </button>

      <div style={{ padding: '4px 18px 22px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: acc.color + '22', color: acc.color,
            display: 'grid', placeItems: 'center', flexShrink: 0,
          }}>
            <Icon name={cat.icon} size={22} stroke={acc.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 28 }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
              {place.name}
            </div>
            <div style={{ fontSize: 12, color: '#6B7785', marginTop: 3 }}>
              {cat.label} · {place.address}
            </div>
          </div>
        </div>

        {/* Access badge + rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: acc.color, color: 'white',
            padding: '6px 11px', borderRadius: 999,
            fontSize: 12, fontWeight: 700,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: 'white' }}/>
            {acc.label}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="star" size={15} stroke="#F5B400" />
            <span className="num" style={{ fontSize: 13, fontWeight: 700 }}>{place.rating.toFixed(1)}</span>
            <span className="num" style={{ fontSize: 11.5, color: '#6B7785' }}>({place.reviews})</span>
          </div>
        </div>

        {/* Note */}
        <div style={{
          marginTop: 14, padding: 12, borderRadius: 12,
          background: '#F4F7FB', fontSize: 12.5, lineHeight: 1.5,
          color: '#374151',
        }}>
          {place.note}
        </div>

        {/* Equipment */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7785', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Equipamiento disponible
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {EQUIPMENT.map(e => {
              const has = place.eq[e.id];
              return (
                <div key={e.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 11px', borderRadius: 10,
                  background: has ? '#ECFDF3' : '#F8FAFC',
                  color: has ? '#0F7A3B' : '#94A3B8',
                  border: `1px solid ${has ? '#BBF1CC' : '#E6ECF2'}`,
                  fontSize: 12, fontWeight: 600,
                }}>
                  <Icon name={e.icon} size={16} stroke={has ? '#16A34A' : '#94A3B8'} />
                  <span style={{ flex: 1 }}>{e.label}</span>
                  {has
                    ? <Icon name="check" size={14} stroke="#16A34A" strokeWidth={2.5} />
                    : <Icon name="x" size={13} stroke="#94A3B8" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stars rating */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6B7785', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            ¿Cómo valoras la accesibilidad?
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} className="star" style={{
                width: 38, height: 38, borderRadius: 10,
                background: '#F4F7FB', border: 'none', cursor: 'pointer',
                display: 'grid', placeItems: 'center',
              }}>
                <Icon name="star-o" size={20} stroke="#F5B400" />
              </button>
            ))}
          </div>
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button onClick={() => onFav(place.id)}
            style={{
              flex: 1, padding: '13px', borderRadius: 12,
              background: isFav ? '#FEE2E2' : '#F4F7FB',
              color: isFav ? '#DC2626' : '#0B1220',
              border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <Icon name={isFav ? 'heart-fill' : 'heart'} size={16} />
            {isFav ? 'En Mi ruta' : 'Añadir a Mi ruta'}
          </button>
          <button style={{
            flex: 1, padding: '13px', borderRadius: 12,
            background: '#0066CC', color: 'white',
            border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 4px 12px rgba(0,102,204,0.3)',
          }}>
            <Icon name="route" size={16} stroke="white" />
            Cómo llegar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Comerciante form sheet
// ─────────────────────────────────────────────────────
function ComercianteSheet({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', address: '', cat: 'tiendas', access: 'total',
    eq: { rampa: false, ascensor: false, bano: false, puerta: false, audio: false, brailleo: false },
  });
  const valid = form.name.trim() && form.address.trim();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleEq = (k) => setForm(f => ({ ...f, eq: { ...f.eq, [k]: !f.eq[k] } }));

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1200,
      background: 'rgba(11,18,32,0.45)', backdropFilter: 'blur(2px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div className="sheet-in no-scrollbar" style={{
        width: '100%', maxHeight: '92%', background: 'white',
        borderRadius: '20px 20px 0 0', overflowY: 'auto', overflowX: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: '#D1D9E2' }}/>
        </div>

        <div style={{ padding: '8px 18px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: '#FEF3C7', color: '#B45309',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name="building" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>
                Modo Comerciante
              </div>
              <div style={{ fontSize: 11.5, color: '#6B7785' }}>
                Declara tu establecimiento accesible
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 999,
              background: '#F1F5F9', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {/* Form fields */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Field label="Nombre del establecimiento">
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Ej. Panadería La Esquina"
                style={inputStyle} />
            </Field>
            <Field label="Dirección">
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="Ej. 12 Rue Saint-Denis, 75001"
                style={inputStyle} />
            </Field>
            <Field label="Tipo">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => set('cat', c.id)}
                    style={{
                      padding: '8px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                      border: '1px solid #E2E8F0',
                      background: form.cat === c.id ? '#0B1220' : 'white',
                      color: form.cat === c.id ? 'white' : '#0B1220',
                      cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}>
                    <Icon name={c.icon} size={13} />
                    {c.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Nivel de accesibilidad">
              <div style={{ display: 'flex', gap: 6 }}>
                {Object.values(ACCESS).map(a => (
                  <button key={a.id} onClick={() => set('access', a.id)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: 12,
                      border: `1.5px solid ${form.access === a.id ? a.color : '#E2E8F0'}`,
                      background: form.access === a.id ? a.color + '15' : 'white',
                      color: form.access === a.id ? a.color : '#0B1220',
                      cursor: 'pointer', fontWeight: 700, fontSize: 11.5,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}>
                    <span style={{ width: 12, height: 12, borderRadius: 999, background: a.color }}/>
                    {a.short}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Equipamiento disponible">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {EQUIPMENT.map(e => {
                  const on = form.eq[e.id];
                  return (
                    <label key={e.id} onClick={() => toggleEq(e.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 11px', borderRadius: 10,
                        background: on ? '#E0F2FE' : '#F4F7FB',
                        border: `1px solid ${on ? '#7DD3FC' : '#E6ECF2'}`,
                        cursor: 'pointer', fontSize: 12, fontWeight: 600,
                        color: on ? '#075985' : '#0B1220',
                      }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 5,
                        background: on ? '#0066CC' : 'white',
                        border: `1.5px solid ${on ? '#0066CC' : '#CBD5E1'}`,
                        display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>
                        {on && <Icon name="check" size={11} stroke="white" strokeWidth={3} />}
                      </span>
                      <Icon name={e.icon} size={14} stroke={on ? '#075985' : '#6B7785'} />
                      <span style={{ flex: 1 }}>{e.label}</span>
                    </label>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Submit */}
          <button onClick={() => valid && onSubmit(form)}
            disabled={!valid}
            style={{
              marginTop: 16, width: '100%', padding: '14px',
              borderRadius: 14, border: 'none',
              background: valid ? '#0066CC' : '#CBD5E1',
              color: 'white', fontWeight: 800, fontSize: 14,
              cursor: valid ? 'pointer' : 'not-allowed',
              boxShadow: valid ? '0 6px 16px rgba(0,102,204,0.3)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            <Icon name="shield-check" size={18} stroke="white" />
            Publicar mi establecimiento
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '11px 13px', borderRadius: 12,
  border: '1px solid #E2E8F0', background: '#F8FAFC',
  fontSize: 13.5, fontFamily: 'inherit', color: '#0B1220',
  outline: 'none',
};
function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7785', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Mi ruta sheet
// ─────────────────────────────────────────────────────
function MiRutaSheet({ favIds, places, onClose, onPick, onRemove }) {
  const list = favIds.map(id => places.find(p => p.id === id)).filter(Boolean);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 1200,
      background: 'rgba(11,18,32,0.45)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div className="sheet-in no-scrollbar" style={{
        width: '100%', maxHeight: '85%', background: 'white',
        borderRadius: '20px 20px 0 0', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: '#D1D9E2' }}/>
        </div>
        <div style={{ padding: '8px 18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: '#DBEAFE', color: '#0066CC',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon name="route" size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>
                Mi ruta accesible
              </div>
              <div style={{ fontSize: 11.5, color: '#6B7785' }}>
                {list.length} {list.length === 1 ? 'lugar guardado' : 'lugares guardados'}
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 30, height: 30, borderRadius: 999,
              background: '#F1F5F9', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <Icon name="x" size={16} />
            </button>
          </div>

          {list.length === 0 ? (
            <div style={{
              marginTop: 22, padding: 22, borderRadius: 14, textAlign: 'center',
              background: '#F4F7FB', color: '#6B7785', fontSize: 13, lineHeight: 1.5,
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🗺️</div>
              Aún no has guardado lugares.<br/>
              Pulsa <strong style={{ color: '#0B1220' }}>Añadir a Mi ruta</strong> en cualquier lugar para empezar.
            </div>
          ) : (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {list.map((p, i) => {
                const acc = ACCESS[p.access];
                const cat = CATEGORIES.find(c => c.id === p.cat);
                return (
                  <div key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: 11, borderRadius: 13,
                    background: '#F8FAFC', border: '1px solid #E6ECF2',
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 999,
                      background: '#0066CC', color: 'white',
                      display: 'grid', placeItems: 'center',
                      fontSize: 12, fontWeight: 800, flexShrink: 0,
                    }} className="num">{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }} onClick={() => onPick(p)}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7785', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name={cat.icon} size={11} />
                        {cat.label}
                        <span style={{ width: 7, height: 7, borderRadius: 999, background: acc.color, marginLeft: 4 }}/>
                        {acc.short}
                      </div>
                    </div>
                    <button onClick={() => onRemove(p.id)}
                      style={{
                        width: 30, height: 30, borderRadius: 999,
                        background: 'white', border: '1px solid #E6ECF2',
                        display: 'grid', placeItems: 'center', cursor: 'pointer',
                      }}>
                      <Icon name="x" size={14} stroke="#6B7785" />
                    </button>
                  </div>
                );
              })}

              {list.length >= 2 && (
                <button style={{
                  marginTop: 6, padding: '13px',
                  background: '#0066CC', color: 'white',
                  border: 'none', borderRadius: 14, cursor: 'pointer',
                  fontWeight: 800, fontSize: 14,
                  boxShadow: '0 6px 16px rgba(0,102,204,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Icon name="route" size={17} stroke="white" />
                  Calcular itinerario accesible
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Bottom tab bar
// ─────────────────────────────────────────────────────
function TabBar({ tab, setTab, onComerciante, onRuta, favCount }) {
  const tabs = [
    { id: 'mapa',    label: 'Mapa',    icon: 'map' },
    { id: 'ruta',    label: 'Mi ruta', icon: 'route', badge: favCount, onClick: onRuta },
    { id: 'add',     label: 'Comerciante', icon: 'plus', primary: true, onClick: onComerciante },
    { id: 'impacto', label: 'Impacto', icon: 'sparkle' },
    { id: 'perfil',  label: 'Perfil',  icon: 'user' },
  ];
  return (
    <div className="tabbar-glass" style={{
      position: 'absolute', left: 12, right: 12, bottom: 22, zIndex: 800,
      borderRadius: 22, padding: '8px 6px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 12px 30px rgba(11,18,32,0.12)',
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        if (t.primary) {
          return (
            <button key={t.id} onClick={t.onClick}
              style={{
                width: 46, height: 46, borderRadius: 14,
                background: 'linear-gradient(135deg, #0066CC, #2A8DF2)',
                color: 'white', border: 'none', cursor: 'pointer',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 6px 16px rgba(0,102,204,0.4)',
                marginTop: -16,
              }}>
              <Icon name={t.icon} size={22} stroke="white" strokeWidth={2.4} />
            </button>
          );
        }
        return (
          <button key={t.id}
            onClick={() => { if (t.onClick) t.onClick(); else setTab(t.id); }}
            style={{
              flex: 1, height: 44, border: 'none', background: 'transparent',
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
              color: active ? '#0066CC' : '#6B7785',
              position: 'relative',
            }}>
            <Icon name={t.icon} size={20} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 9.5, fontWeight: 700 }}>{t.label}</span>
            {t.badge > 0 && (
              <span className="num" style={{
                position: 'absolute', top: 0, right: '50%', transform: 'translateX(20px)',
                background: '#EF4444', color: 'white',
                fontSize: 9, fontWeight: 800,
                minWidth: 16, height: 16, borderRadius: 999,
                padding: '0 4px',
                display: 'grid', placeItems: 'center',
                boxShadow: '0 0 0 2px white',
              }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Animated impact stat
// ─────────────────────────────────────────────────────
function CountUp({ to, prefix = '', suffix = '', duration = 1400 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="num">{prefix}{n}{suffix}</span>;
}

function ImpactPanel({ extras = 0, comerciantes = 15 }) {
  return (
    <div style={{
      margin: '4px 14px 92px', padding: '16px 16px 18px',
      borderRadius: 18,
      background: 'linear-gradient(135deg, #0B1220 0%, #0F2547 100%)',
      color: 'white',
      boxShadow: '0 10px 24px rgba(11,18,32,0.25)',
      position: 'relative', overflow: 'hidden',
    }} className="fade-up">
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 160, height: 160,
        borderRadius: 999, background: 'radial-gradient(circle, rgba(42,141,242,0.5), transparent 70%)',
      }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <Icon name="sparkle" size={16} stroke="#7DD3FC" />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7DD3FC' }}>
          Nuestro impacto
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, color: '#E2E8F0', position: 'relative' }}>
        Construyendo una ciudad más inclusiva, cada día.
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, position: 'relative' }}>
        <Stat n={150 + extras} suffix="+" label="lugares accesibles" />
        <Stat n={500} suffix="+" label="usuarios activos" />
        <Stat n={comerciantes} suffix="" label="comercios participantes" />
      </div>
    </div>
  );
}
function Stat({ n, suffix, label }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '10px 9px',
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <CountUp to={n} suffix={suffix} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', marginTop: 4, lineHeight: 1.25 }}>
        {label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fade-up" style={{
      position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)',
      zIndex: 1500, background: '#0B1220', color: 'white',
      padding: '10px 16px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
      boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 8,
      whiteSpace: 'nowrap',
    }}>
      <Icon name="check" size={14} stroke="#22C55E" strokeWidth={3} />
      {msg}
    </div>
  );
}

Object.assign(window, {
  AppHeader, FilterRow, Legend, PlaceSheet, ComercianteSheet, MiRutaSheet,
  TabBar, ImpactPanel, Toast,
});
