// Diariamente — main app

const { PARIS, PLACES: SEED, ACCESS } = window.DIARIA;

// ─────────────────────────────────────────────────────
// Map component
// ─────────────────────────────────────────────────────
function MapView({ places, onSelect, selectedId, favIds }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef({});

  // Build a custom HTML pin
  const makeIcon = (place, isActive) => {
    const acc = ACCESS[place.access];
    const colorClass = place.access === 'total' ? 'green' : place.access === 'parcial' ? 'yellow' : 'red';
    const isFav = favIds.includes(place.id);
    const html = `
      <div class="pin-wrap ${isActive ? 'pin-active' : ''}" style="color:${acc.color}">
        <div class="pin ${colorClass}">
          ${isFav ?
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>' :
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3.5"/></svg>'}
        </div>
      </div>`;
    return L.divIcon({
      html, className: 'diaria-pin',
      iconSize: [34, 42], iconAnchor: [17, 42]
    });
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: PARIS, zoom: 14,
      zoomControl: false, attributionControl: true
    });
    // CartoDB Positron — clean, accessible-feeling tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CARTO',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);
    L.control.zoom({ position: 'topleft' }).addTo(map);
    mapRef.current = map;
  }, []);

  // Sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old
    Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
    markersRef.current = {};

    places.forEach((p) => {
      const m = L.marker(p.coords, { icon: makeIcon(p, p.id === selectedId) });
      m.on('click', () => onSelect(p));
      m.addTo(map);
      markersRef.current[p.id] = m;
    });
  }, [places, selectedId, favIds]);

  // Pan to selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const p = places.find((x) => x.id === selectedId);
    if (!p) return;
    map.flyTo(p.coords, Math.max(map.getZoom(), 15), { duration: 0.6 });
  }, [selectedId]);

  return <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />;
}

// ─────────────────────────────────────────────────────
// App root
// ─────────────────────────────────────────────────────
function App() {
  const [places, setPlaces] = useState(SEED);
  const [activeFilters, setActiveFilters] = useState([]); // empty = all
  const [selected, setSelected] = useState(null);
  const [favIds, setFavIds] = useState([]);
  const [showComer, setShowComer] = useState(false);
  const [showRuta, setShowRuta] = useState(false);
  const [tab, setTab] = useState('mapa');
  const [toast, setToast] = useState('');
  const [extras, setExtras] = useState(0);

  // Welcome screen on first paint
  const [welcome, setWelcome] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setWelcome(false), 1900);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return places;
    return places.filter((p) => activeFilters.includes(p.cat));
  }, [places, activeFilters]);

  const toggleFilter = (id) => {
    setActiveFilters((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const toggleFav = (id) => {
    setFavIds((prev) => {
      if (prev.includes(id)) {
        flash('Lugar quitado de Mi ruta');
        return prev.filter((x) => x !== id);
      }
      flash('Añadido a Mi ruta');
      return [...prev, id];
    });
  };

  const submitComerciante = (form) => {
    // Place near centre with small jitter
    const jitter = () => (Math.random() - 0.5) * 0.012;
    const newPlace = {
      id: Date.now(),
      name: form.name,
      address: form.address,
      cat: form.cat,
      access: form.access,
      coords: [PARIS[0] + jitter(), PARIS[1] + jitter()],
      eq: { ...form.eq },
      rating: 4.2, reviews: 1,
      note: 'Lugar declarado por su comerciante. Pendiente de validación.'
    };
    setPlaces((p) => [...p, newPlace]);
    setShowComer(false);
    setExtras((x) => x + 1);
    flash('¡Establecimiento publicado! Gracias 💙');
    setTimeout(() => setSelected(newPlace), 350);
  };

  // Mobile prototype contents
  const phoneContent =
  <div style={{
    position: 'absolute', inset: 0, background: '#FFFFFF',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
    paddingTop: 54
  }}>
      {/* Welcome splash */}
      {welcome && <Welcome />}

      <AppHeader count={filtered.length} />
      <FilterRow active={activeFilters} onToggle={toggleFilter} />

      {/* Map area */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <MapView places={filtered} onSelect={setSelected}
      selectedId={selected?.id} favIds={favIds} />
        <Legend />

        {/* Floating Mi ruta pill bottom-left */}
        {favIds.length > 0 &&
      <button onClick={() => setShowRuta(true)}
      style={{
        position: 'absolute', left: 12, bottom: 92, zIndex: 700,
        background: 'white', border: 'none',
        padding: '8px 12px 8px 8px', borderRadius: 999,
        boxShadow: '0 6px 16px rgba(11,18,32,0.18)',
        display: 'flex', alignItems: 'center', gap: 8,
        cursor: 'pointer'
      }}>
            <span style={{
          width: 28, height: 28, borderRadius: 999,
          background: '#0066CC', color: 'white',
          display: 'grid', placeItems: 'center'
        }}>
              <Icon name="route" size={14} stroke="white" />
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 800 }}>Mi ruta</span>
            <span className="num" style={{
          background: '#EF4444', color: 'white',
          fontSize: 10, fontWeight: 800,
          padding: '2px 7px', borderRadius: 999
        }}>{favIds.length}</span>
          </button>
      }

        {/* Toast */}
        <Toast msg={toast} />
      </div>

      {/* Impact strip — visible above tab bar; appears as a stacked card */}
      <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      zIndex: 600, pointerEvents: 'none'
    }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ImpactPanel extras={extras} comerciantes={15 + extras} />
        </div>
      </div>

      <TabBar tab={tab} setTab={setTab}
    onComerciante={() => setShowComer(true)}
    onRuta={() => setShowRuta(true)}
    favCount={favIds.length} />

      {selected && !showComer && !showRuta &&
    <PlaceSheet place={selected} onClose={() => setSelected(null)}
    onFav={toggleFav} isFav={favIds.includes(selected.id)} />
    }

      {showComer &&
    <ComercianteSheet onClose={() => setShowComer(false)} onSubmit={submitComerciante} />
    }

      {showRuta &&
    <MiRutaSheet favIds={favIds} places={places}
    onClose={() => setShowRuta(false)}
    onPick={(p) => {setShowRuta(false);setSelected(p);}}
    onRemove={(id) => setFavIds((prev) => prev.filter((x) => x !== id))} />
    }
    </div>;


  return (
    <div className="stage">
      <div style={{
        display: 'flex', gap: 36, alignItems: 'center',
        flexWrap: 'wrap', justifyContent: 'center'
      }}>
        {/* Left sidecar — info for the audience */}
        <Sidecar places={places} favCount={favIds.length} extras={extras} />

        {/* The phone */}
        <IOSDevice width={390} height={844} dark={false}>
          {phoneContent}
        </IOSDevice>

        {/* Right sidecar — usage notes */}
        <RightSidecar />
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// Welcome splash
// ─────────────────────────────────────────────────────
function Welcome() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 2000,
      background: 'linear-gradient(160deg, #0066CC 0%, #003B7A 100%)',
      color: 'white',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32, textAlign: 'center',
      animation: 'fadeOut 0.5s ease 1.4s forwards'
    }}>
      <style>{`
        @keyframes fadeOut { to { opacity: 0; } }
        @keyframes scaleIn { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideText { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Logo: bold white square with ISA symbol — universally readable */}
      <div style={{
        position: 'relative', width: 160, height: 160,
        animation: 'scaleIn 0.55s cubic-bezier(.2,.9,.3,1.4) both'
      }}>
        <div style={{
          width: 160, height: 160, borderRadius: 36,
          background: 'white',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 14px 30px rgba(0,0,0,0.25)',
        }}>
          {/* International Symbol of Access — solid blue, extra-large */}
          <svg width="110" height="110" viewBox="0 0 100 100" fill="#0066CC">
            <circle cx="62" cy="14" r="8"/>
            <path d="M55 27 L 50 48 L 70 48 L 78 70 L 86 67 L 78 43 L 64 43 L 67 30 Z"/>
            <circle cx="46" cy="68" r="22" fill="none" stroke="#0066CC" strokeWidth="6"/>
            <circle cx="46" cy="68" r="4"/>
          </svg>
        </div>
        {/* Location pin badge */}
        <div style={{
          position: 'absolute', bottom: -6, right: -6,
          width: 56, height: 56, borderRadius: 999,
          background: '#22C55E',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 8px 18px rgba(0,0,0,0.3)',
          border: '4px solid #0066CC',
        }}>
          <Icon name="pin" size={26} stroke="white" strokeWidth={2.8} />
        </div>
      </div>

      <div style={{ marginTop: 26, fontWeight: 800, fontSize: 32, letterSpacing: '-0.03em',
        animation: 'slideText 0.6s ease 0.2s both' }}>
        Diariamente
      </div>
      <div style={{ marginTop: 8, fontSize: 14, color: '#BFD9F4', maxWidth: 240, lineHeight: 1.4,
        animation: 'slideText 0.6s ease 0.35s both' }}>
        Tu ciudad, accesible para todos.
      </div>
    </div>);

}

// ─────────────────────────────────────────────────────
// Sidecars (helpful context for the oral presentation)
// ─────────────────────────────────────────────────────
function Sidecar({ places, favCount, extras }) {
  const total = places.filter((p) => p.access === 'total').length;
  const parcial = places.filter((p) => p.access === 'parcial').length;
  const no = places.filter((p) => p.access === 'no').length;
  return (
    <div className="sidecar fade-up" style={{
      width: 280, color: '#0B1220',
      display: 'flex', flexDirection: 'column', gap: 16
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#0066CC' }}>

        </div>
        <h3 style={{ margin: '6px 0 0', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          Diariamente
        </h3>
        <p style={{ margin: '8px 0 0', fontSize: 13.5, color: '#4B5563', lineHeight: 1.5 }}>
          Una aplicación para que las personas con movilidad reducida puedan
          desplazarse por la ciudad con confianza.
        </p>
      </div>

      <div style={{
        background: 'white', borderRadius: 14, padding: 14,
        boxShadow: '0 4px 14px rgba(11,18,32,0.05)', border: '1px solid #E6ECF2'
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#6B7785', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          La ciudad en cifras
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
          { c: '#22C55E', l: 'Totalmente accesible', n: total },
          { c: '#F5B400', l: 'Parcialmente accesible', n: parcial },
          { c: '#EF4444', l: 'No accesible', n: no }].
          map((r) =>
          <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: r.c }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{r.l}</span>
              <span className="num" style={{ fontSize: 13, fontWeight: 800 }}>{r.n}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{
        background: '#0B1220', color: 'white', borderRadius: 14, padding: 14
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Estado actual
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 10 }}>
          <Mini n={favCount} l="en Mi ruta" />
          <Mini n={extras} l="comercios añadidos" />
        </div>
      </div>
    </div>);

}
function Mini({ n, l }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="num" style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{n}</div>
      <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 4, fontWeight: 600 }}>{l}</div>
    </div>);

}

function RightSidecar() {
  const items = [
  { t: 'Mapa interactivo', d: 'Visualiza la accesibilidad de cada lugar con código de color.' },
  { t: 'Filtros por categoría', d: 'Transportes, tiendas, edificios públicos, restaurantes, farmacias.' },
  { t: 'Modo Comerciante', d: 'Los negocios pueden declarar su accesibilidad y aparecer en el mapa.' },
  { t: 'Mi ruta', d: 'Guarda tus lugares favoritos para planificar un itinerario accesible.' }];

  return (
    <div className="sidecar fade-up" style={{
      width: 280, color: '#0B1220',
      display: 'flex', flexDirection: 'column', gap: 14
    }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#22C55E' }}>
          Cómo funciona
        </div>
        <h3 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Cuatro funciones clave
        </h3>
      </div>
      {items.map((it, i) =>
      <div key={i} style={{
        background: 'white', borderRadius: 12, padding: 12,
        border: '1px solid #E6ECF2', display: 'flex', gap: 11
      }}>
          <div className="num" style={{
          width: 26, height: 26, borderRadius: 8,
          background: '#0066CC', color: 'white',
          display: 'grid', placeItems: 'center',
          fontWeight: 800, fontSize: 13, flexShrink: 0
        }}>{i + 1}</div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{it.t}</div>
            <div style={{ fontSize: 12, color: '#6B7785', marginTop: 3, lineHeight: 1.4 }}>{it.d}</div>
          </div>
        </div>
      )}
      <div style={{
        background: '#ECFDF5', borderRadius: 12, padding: 12,
        border: '1px solid #BBF7D0', fontSize: 12, color: '#166534', lineHeight: 1.45
      }}>
        <strong>Impacto social:</strong> una herramienta colaborativa que hace
        visible lo invisible y construye una ciudad más justa.
      </div>
    </div>);

}

// Boot
ReactDOM.createRoot(document.getElementById('root')).render(<App />);