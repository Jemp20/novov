/* Shared SVG cap illustrations with Greek motifs */

export function CapObsidian({ size = 300 }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <rect width="300" height="300" fill="#111"/>
      {/* Greek key border */}
      <rect x="4" y="4" width="292" height="292" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.2"/>
      {/* Base ellipse */}
      <ellipse cx="150" cy="196" rx="98" ry="20" fill="#0D0D0D" stroke="#C9A96E" strokeWidth="0.7"/>
      {/* Crown */}
      <path d="M58 196 Q72 118 150 106 Q228 118 242 196 Z" fill="#1a1a1a" stroke="#C9A96E" strokeWidth="1"/>
      {/* Panel stitching */}
      <path d="M150 106 L150 196" stroke="#C9A96E" strokeWidth="0.3" strokeDasharray="3,6" opacity="0.4"/>
      <path d="M104 110 Q120 196 150 196" stroke="#C9A96E" strokeWidth="0.3" strokeDasharray="3,6" opacity="0.3"/>
      <path d="M196 110 Q180 196 150 196" stroke="#C9A96E" strokeWidth="0.3" strokeDasharray="3,6" opacity="0.3"/>
      {/* Brim */}
      <path d="M50 196 Q43 200 41 210 Q41 222 53 222 Q62 222 73 216 L73 196 Z" fill="#222" stroke="#C9A96E" strokeWidth="0.6"/>
      {/* Button + stalk */}
      <line x1="150" y1="106" x2="150" y2="70" stroke="#C9A96E" strokeWidth="0.6"/>
      <circle cx="150" cy="64" r="7" fill="none" stroke="#C9A96E" strokeWidth="1"/>
      <circle cx="150" cy="64" r="3" fill="#C9A96E" opacity="0.6"/>
      {/* Greek laurel emblem */}
      <text x="150" y="168" textAnchor="middle" fontFamily="serif" fontSize="18" fill="#C9A96E" letterSpacing="8" opacity="0.85">N·V</text>
      {/* Small meander below text */}
      <path d="M120,178 L126,178 L126,174 L132,174 L132,178 L138,178 L138,174 L144,174 L144,178 L150,178 L150,174 L156,174 L156,178 L162,178 L162,174 L168,174 L168,178 L174,178 L174,174 L180,174 L180,178"
        stroke="#C9A96E" strokeWidth="0.5" strokeLinecap="square" fill="none" opacity="0.4"/>
    </svg>
  )
}

export function CapAurum({ size = 300 }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <rect width="300" height="300" fill="#141008"/>
      <rect x="4" y="4" width="292" height="292" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.2"/>
      <ellipse cx="150" cy="196" rx="98" ry="20" fill="#0D0A04" stroke="#C9A96E" strokeWidth="0.7"/>
      <path d="M58 196 Q72 118 150 106 Q228 118 242 196 Z" fill="#1e1508" stroke="#C9A96E" strokeWidth="1"/>
      <path d="M150 106 L150 196" stroke="#C9A96E" strokeWidth="0.3" strokeDasharray="3,6" opacity="0.4"/>
      <path d="M50 196 Q43 200 41 210 Q41 222 53 222 Q62 222 73 216 L73 196 Z" fill="#1e1508" stroke="#C9A96E" strokeWidth="0.6"/>
      <line x1="150" y1="106" x2="150" y2="68" stroke="#C9A96E" strokeWidth="0.6"/>
      {/* Ionic capital button */}
      <path d="M140,68 Q144,62 150,60 Q156,62 160,68 L156,72 L144,72 Z" fill="#C9A96E" opacity="0.7"/>
      {/* Sun rays / Helios motif */}
      {[0,45,90,135,180,225,270,315].map(deg => (
        <line key={deg}
          x1={150 + 14*Math.cos(deg*Math.PI/180)}
          y1={168 + 14*Math.sin(deg*Math.PI/180)}
          x2={150 + 22*Math.cos(deg*Math.PI/180)}
          y2={168 + 22*Math.sin(deg*Math.PI/180)}
          stroke="#C9A96E" strokeWidth="0.7" opacity="0.5"/>
      ))}
      <circle cx="150" cy="168" r="10" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.6"/>
      <text x="150" y="172" textAnchor="middle" fontFamily="serif" fontSize="9" fill="#C9A96E" letterSpacing="2" opacity="0.9">AURUM</text>
    </svg>
  )
}

export function CapIvory({ size = 300 }) {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <rect width="300" height="300" fill="#0f0f10"/>
      <rect x="4" y="4" width="292" height="292" fill="none" stroke="#E8D5B0" strokeWidth="0.4" opacity="0.2"/>
      <ellipse cx="150" cy="196" rx="98" ry="20" fill="#0a0a0b" stroke="#E8D5B0" strokeWidth="0.7"/>
      <path d="M58 196 Q72 118 150 106 Q228 118 242 196 Z" fill="#171718" stroke="#E8D5B0" strokeWidth="1"/>
      <path d="M150 106 L150 196" stroke="#E8D5B0" strokeWidth="0.3" strokeDasharray="3,6" opacity="0.3"/>
      <path d="M50 196 Q43 200 41 210 Q41 222 53 222 Q62 222 73 216 L73 196 Z" fill="#1a1a1a" stroke="#E8D5B0" strokeWidth="0.6"/>
      {/* Owl of Athena motif */}
      <circle cx="145" cy="163" r="4" fill="none" stroke="#E8D5B0" strokeWidth="0.7" opacity="0.6"/>
      <circle cx="155" cy="163" r="4" fill="none" stroke="#E8D5B0" strokeWidth="0.7" opacity="0.6"/>
      <circle cx="145" cy="163" r="1.5" fill="#E8D5B0" opacity="0.5"/>
      <circle cx="155" cy="163" r="1.5" fill="#E8D5B0" opacity="0.5"/>
      <path d="M143 169 Q150 174 157 169" stroke="#E8D5B0" strokeWidth="0.6" fill="none" opacity="0.5"/>
      <path d="M142 157 L148 160" stroke="#E8D5B0" strokeWidth="0.5" opacity="0.4"/>
      <path d="M158 157 L152 160" stroke="#E8D5B0" strokeWidth="0.5" opacity="0.4"/>
      <line x1="150" y1="106" x2="150" y2="72" stroke="#E8D5B0" strokeWidth="0.6"/>
      <circle cx="150" cy="66" r="8" fill="none" stroke="#E8D5B0" strokeWidth="0.8"/>
      <circle cx="150" cy="66" r="4" fill="#E8D5B0" opacity="0.4"/>
    </svg>
  )
}

export function CapSmall({ accent = '#C9A96E', label = 'N·V', size = 120 }) {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 100/120}>
      <rect width="120" height="100" fill="#161616"/>
      <ellipse cx="60" cy="75" rx="42" ry="9" fill="#0D0D0D" stroke={accent} strokeWidth="0.4"/>
      <path d="M22 75 Q28 42 60 36 Q92 42 98 75 Z" fill="#1f1f1f" stroke={accent} strokeWidth="0.7"/>
      <path d="M17 75 Q14 78 13 83 Q13 88 19 88 Q24 88 30 84 L30 75 Z" fill="#222" stroke={accent} strokeWidth="0.4"/>
      <text x="60" y="62" textAnchor="middle" fontFamily="serif" fontSize="9" fill={accent} opacity="0.8" letterSpacing="3">{label}</text>
      {/* Tiny meander at base */}
      <path d="M44,68 L47,68 L47,65 L50,65 L50,68 L53,68 L53,65 L56,65 L56,68 L60,68 L60,65 L64,65 L64,68 L67,68 L67,65 L70,65 L70,68 L73,68 L73,65 L76,65 L76,68"
        stroke={accent} strokeWidth="0.4" strokeLinecap="square" fill="none" opacity="0.35"/>
    </svg>
  )
}
