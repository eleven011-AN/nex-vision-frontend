/* ═══════════════════════════ DESIGN TOKENS */
const C = {
    bg: "#060810",
    surface: "#0B0F1A",
    card: "#0F1520",
    card2: "#131B28",
    border: "#1A2436",
    borderHi: "#243350",
    teal: "#00D9BC",
    tealGlow: "rgba(0,217,188,0.15)",
    coral: "#FF5C57",
    amber: "#FFC03D",
    blue: "#4A9EFF",
    violet: "#9B8AFA",
    green: "#32D68A",
    text: "#E0E8F4",
    sub: "#6B80A0",
    muted: "#2E3E56",
};

/* ═══════════════════════════ SVG ICON LIBRARY */
const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {
    const s = { width: size, height: size, display: "inline-block", flexShrink: 0, ...style };
    const paths = {
        logo: <><rect x="3" y="3" width="7" height="7" rx="1.5" fill={color} /><rect x="14" y="3" width="7" height="7" rx="1.5" fill={color} opacity=".6" /><rect x="3" y="14" width="7" height="7" rx="1.5" fill={color} opacity=".6" /><rect x="14" y="14" width="7" height="7" rx="1.5" fill={color} opacity=".3" /></>,
        upload: <><path d="M12 15V3M12 3L8 7M12 3L16 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 17v1a2 2 0 002 2h14a2 2 0 002-2v-1" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
        file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" /><polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" /></>,
        bar: <><rect x="3" y="10" width="4" height="10" rx="1" fill={color} /><rect x="10" y="6" width="4" height="14" rx="1" fill={color} opacity=".7" /><rect x="17" y="2" width="4" height="18" rx="1" fill={color} opacity=".5" /></>,
        line: <path d="M3 17L8 11L13 14L19 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
        pie: <><path d="M12 2a10 10 0 0110 10H12V2z" fill={color} /><path d="M12 12L2.93 15.5A10 10 0 0012 22V12z" fill={color} opacity=".6" /><path d="M12 12H22a10 10 0 01-9.07 9.95L12 12z" fill={color} opacity=".3" /></>,
        area: <><path d="M3 17L8 11L13 14L19 6L21 8V20H3V17z" fill={color} opacity=".25" /><path d="M3 17L8 11L13 14L19 6" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" /></>,
        brain: <><path d="M12 2C8 2 5 5 5 9c0 1.5.5 3 1.5 4L5 20h14l-1.5-7C18.5 12 19 10.5 19 9c0-4-3-7-7-7z" stroke={color} strokeWidth="1.6" fill="none" /><path d="M9 9h.01M15 9h.01M12 13v2" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
        lightning: <path d="M13 2L4.09 12.96H12L10.91 22L20 11.04H12.91L13 2z" fill={color} />,
        search: <><circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.8" fill="none" /><path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
        trending: <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><polyline points="17,6 23,6 23,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></>,
        trendDown: <><polyline points="23,18 13.5,8.5 8.5,13.5 1,6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /><polyline points="17,18 23,18 23,12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></>,
        target: <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" fill="none" /><circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.8" fill="none" /><circle cx="12" cy="12" r="2" fill={color} /></>,
        trophy: <><path d="M8 2H16L18 8C18 11.31 15.31 14 12 14C8.69 14 6 11.31 6 8L8 2z" stroke={color} strokeWidth="1.6" fill="none" /><path d="M6 8H3V9C3 10.66 4.34 12 6 12" stroke={color} strokeWidth="1.6" fill="none" /><path d="M18 8H21V9C21 10.66 19.66 12 18 12" stroke={color} strokeWidth="1.6" fill="none" /><path d="M12 14V18M8 22H16M10 18H14" stroke={color} strokeWidth="1.6" strokeLinecap="round" /></>,
        database: <><ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} strokeWidth="1.6" fill="none" /><path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke={color} strokeWidth="1.6" fill="none" /><path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" stroke={color} strokeWidth="1.6" fill="none" /></>,
        check: <polyline points="20,6 9,17 4,12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
        warning: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="1.8" fill="none" /><line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" /><line x1="12" y1="17" x2="12.01" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" /></>,
        bulb: <><path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a2 2 0 002 2h4a2 2 0 002-2v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z" stroke={color} strokeWidth="1.6" fill="none" /><path d="M9 21h6M10 17h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" /></>,
        user: <><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" fill="none" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" /></>,
        clock: <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" fill="none" /><polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" /></>,
        grid: <><rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8" fill="none" /><rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8" fill="none" /><rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8" fill="none" /><rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth="1.8" fill="none" /></>,
        rupee: <><path d="M6 3h12M6 8h12M11.5 8L7 21M6 8C6 11.31 8.69 14 12 14s6-2.69 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></>,
        send: <><line x1="22" y1="2" x2="11" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" /><polygon points="22,2 15,22 11,13 2,9 22,2" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round" /></>,
        info: <><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" fill="none" /><line x1="12" y1="8" x2="12" y2="8.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" /><line x1="12" y1="12" x2="12" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" /></>,
        layers: <><polygon points="12,2 2,7 12,12 22,7 12,2" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round" /><polyline points="2,17 12,22 22,17" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" /><polyline points="2,12 12,17 22,12" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" /></>,
        chartLine: <><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" /><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" /><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" /></>,
        arrow: <><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" /><polyline points="12,5 19,12 12,19" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></>,
        india: <><rect x="3" y="6" width="18" height="12" rx="1.5" fill="none" stroke={color} strokeWidth="1.5" /><rect x="3" y="6" width="18" height="4" fill={color} opacity=".9" /><rect x="3" y="10" width="18" height="4" fill="none" /><rect x="3" y="14" width="18" height="4" fill={color} opacity=".4" /><circle cx="12" cy="12" r="1.5" stroke={color} strokeWidth="1.2" fill="none" /></>,
    };
    return (
        <svg viewBox="0 0 24 24" style={s} fill="none" xmlns="http://www.w3.org/2000/svg">
            {paths[name] || <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />}
        </svg>
    );
};

/* ═══════════════════════════ KPI CARD */
const KPI_ACCENTS = [C.teal, C.coral, C.amber, C.violet, C.green, C.blue];

export default function KpiCard({ kpi, ghost, index }) {
    const accent = KPI_ACCENTS[index % KPI_ACCENTS.length];
    return (
        <div style={{
            background: `linear-gradient(160deg, ${C.card} 0%, ${C.card2} 100%)`,
            border: `1px solid ${ghost ? C.border : C.borderHi}`,
            borderRadius: 16, padding: 0,
            opacity: ghost ? 0.38 : 1,
            animation: ghost ? "none" : `fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 0.06}s both`,
            overflow: "hidden",
            boxShadow: ghost ? "none" : "0 4px 24px rgba(0,0,0,0.3)",
            position: "relative",
            minWidth: 160 // Added for consistent sizing across the 4 grid spaces
        }}>
            {ghost && (
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
                    background: "linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.012) 50%,transparent 62%)",
                    backgroundSize: "200% 100%", animation: "shimmer 3s ease-in-out infinite",
                }} />
            )}
            <div style={{
                height: 3,
                background: ghost ? C.muted : `linear-gradient(90deg,${accent},${accent}60)`,
            }} />
            <div style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                        color: ghost ? C.muted : C.sub, fontFamily: "'DM Mono',monospace",
                    }}>
                        {kpi.label}
                    </div>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: ghost ? C.muted + "22" : `${accent}15`,
                        border: `1px solid ${ghost ? C.border : accent + "28"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Icon name={ghost ? kpi.iconName : (kpi.iconName || "chartLine")} size={13}
                            color={ghost ? C.muted : accent} />
                    </div>
                </div>
                <div style={{
                    fontSize: kpi.value?.toString().length > 8 ? 20 : 24, fontWeight: 800,
                    color: ghost ? C.muted : C.text,
                    fontFamily: "'DM Mono',monospace", letterSpacing: "-0.02em", lineHeight: 1,
                }}>
                    {kpi.value}
                </div>
                {kpi.change && (
                    <div style={{
                        marginTop: 8, fontSize: 12, fontWeight: 600,
                        color: kpi.positive ? C.green : C.coral,
                        display: "flex", alignItems: "center", gap: 5,
                    }}>
                        <Icon name={kpi.positive ? "trending" : "trendDown"} size={13} color={kpi.positive ? C.green : C.coral} />
                        {kpi.change}
                    </div>
                )}
            </div>
        </div>
    );
}
