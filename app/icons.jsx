// Tiny SVG icon set — stroke-based, accessible
function Icon({ name, size = 22, stroke = 'currentColor', strokeWidth = 2, fill = 'none', style }) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'wheelchair': return (
      <svg {...props}>
        {/* head */}
        <circle cx="14" cy="4.2" r="1.9" fill="currentColor" stroke="none"/>
        {/* torso + arm reaching down to push wheel */}
        <path d="M14 7 L14 12 L18.5 12" />
        <path d="M14 9 L11 13" />
        {/* leg / footrest */}
        <path d="M18.5 12 L20 16" />
        {/* big wheel */}
        <circle cx="14" cy="17" r="5" />
        {/* hub */}
        <circle cx="14" cy="17" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
    );
    case 'wheelchair-solid': return (
      <svg {...props} fill="currentColor" stroke="none">
        <circle cx="14.5" cy="4" r="2.2"/>
        <path d="M13.2 7.2c-.7 0-1.3.6-1.3 1.3v3.6c0 .7.6 1.3 1.3 1.3h3.4l1.7 3.4c.3.6 1 .8 1.6.5.6-.3.8-1 .5-1.6l-2-4c-.2-.5-.7-.8-1.2-.8h-2.5V8.5c0-.7-.6-1.3-1.5-1.3Z"/>
        <path d="M11.5 9.8c-.6-.2-1.3.1-1.5.7l-1 2.5c-2 .9-3.4 2.9-3.4 5.2 0 3.2 2.6 5.7 5.7 5.7 2.6 0 4.8-1.7 5.5-4.1h-2.2c-.6 1.2-1.9 2-3.3 2-2 0-3.7-1.6-3.7-3.6 0-1.2.6-2.3 1.5-3l-.4 1.1c-.2.5.1 1.1.6 1.3.5.2 1.1-.1 1.3-.6l1.6-4.1c.2-.6-.1-1.2-.7-1.4Z"/>
      </svg>
    );
    case 'map': return (
      <svg {...props}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14"/><path d="M15 6v14"/></svg>
    );
    case 'route': return (
      <svg {...props}><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H14a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8h5.5"/></svg>
    );
    case 'plus': return (<svg {...props}><path d="M12 5v14M5 12h14"/></svg>);
    case 'user': return (<svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>);
    case 'search': return (<svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>);
    case 'filter': return (<svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>);
    case 'star': return (<svg {...props} fill="currentColor" stroke="none"><path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z"/></svg>);
    case 'star-o': return (<svg {...props}><path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.3 6.5 20.3l1.1-6.3L3 9.6l6.3-.9L12 3Z"/></svg>);
    case 'chevron-down': return (<svg {...props}><path d="m6 9 6 6 6-6"/></svg>);
    case 'chevron-left': return (<svg {...props}><path d="m15 6-6 6 6 6"/></svg>);
    case 'chevron-right': return (<svg {...props}><path d="m9 6 6 6-6 6"/></svg>);
    case 'check': return (<svg {...props}><path d="m5 12 5 5 9-11"/></svg>);
    case 'x': return (<svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>);
    case 'heart': return (<svg {...props}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>);
    case 'heart-fill': return (<svg {...props} fill="currentColor" stroke="none"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>);
    case 'pin': return (<svg {...props}><path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>);
    case 'bus': return (<svg {...props}><rect x="4" y="4" width="16" height="13" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="20" r="1.4" fill="currentColor"/><circle cx="16" cy="20" r="1.4" fill="currentColor"/><path d="M4 17v2M20 17v2"/></svg>);
    case 'shopping-bag': return (<svg {...props}><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7a3 3 0 1 1 6 0"/></svg>);
    case 'landmark': return (<svg {...props}><path d="M3 21h18M5 21V11M19 21V11M9 21V11M15 21V11M3 11l9-6 9 6"/></svg>);
    case 'utensils': return (<svg {...props}><path d="M7 3v8a3 3 0 0 0 3 3v7"/><path d="M11 3v6"/><path d="M14 9V3"/><path d="M17 3c-1.5 0-3 2-3 5s1.5 5 3 5v8"/></svg>);
    case 'pill': return (<svg {...props}><rect x="2" y="9" width="20" height="6" rx="3" transform="rotate(-30 12 12)"/><path d="m9 15 6-6"/></svg>);
    case 'ramp': return (<svg {...props}><path d="M3 19h18"/><path d="M21 19 5 19l13-12 3 12Z"/></svg>);
    case 'elevator': return (<svg {...props}><rect x="5" y="3" width="14" height="18" rx="1"/><path d="m9 8 3-3 3 3"/><path d="m9 16 3 3 3-3"/></svg>);
    case 'wc': return (<svg {...props}><circle cx="8" cy="4" r="1.6"/><path d="M6.5 14H5l1.5-6h3L11 14H9.5l-.5 7h-2l-.5-7Z"/><circle cx="16" cy="4" r="1.6"/><path d="M14 7h4l-1 6h-1v8h-2v-8h-1l-1-6h2"/></svg>);
    case 'door': return (<svg {...props}><path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M4 21h16"/><circle cx="14" cy="13" r="0.8" fill="currentColor"/></svg>);
    case 'audio': return (<svg {...props}><path d="M5 9h3l5-4v14l-5-4H5z"/><path d="M16 8a4 4 0 0 1 0 8"/><path d="M19 5a8 8 0 0 1 0 14"/></svg>);
    case 'braille': return (<svg {...props} fill="currentColor" stroke="none"><circle cx="8" cy="7" r="1.6"/><circle cx="16" cy="7" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6" opacity="0.3"/><circle cx="8" cy="17" r="1.6" opacity="0.3"/><circle cx="16" cy="17" r="1.6"/></svg>);
    case 'sparkle': return (<svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>);
    case 'shield-check': return (<svg {...props}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>);
    case 'building': return (<svg {...props}><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M9 11h2M9 15h2M13 7h2M13 11h2M13 15h2"/></svg>);
    default: return null;
  }
}

window.Icon = Icon;
