import {
    BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    LineChart, Line, ComposedChart, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#00D9BC', '#4A9EFF', '#9B8AFA', '#FFC03D', '#FF5C57', '#32D68A', '#E879F9']

const CustomTooltip = ({ active, payload, label, isCurrency }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#e8eaf0'
            }}>
                {label && <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>}
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color || p.fill, marginTop: 2 }}>
                        {p.name}: <strong>
                            {isCurrency ? fmtINR(p.value) : p.value?.toLocaleString("en-IN")}
                        </strong>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

function fmtINR(val) {
    const n = Number(val);
    if (isNaN(n)) return String(val);
    if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
    if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
    if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n.toLocaleString("en-IN")}`;
}

function renderChart(chartData, ghost = false) {
    if (!chartData) return null

    const type = chartData.type
    const C = { border: 'rgba(255,255,255,0.04)', sub: '#8b95a8', card: '#1a2035' }
    const P = COLORS
    const ghostC = "rgba(255,255,255,0.05)"

    const axisTick = { fill: '#6B80A0', fontSize: 11, fontFamily: "'Inter', sans-serif" }
    const gridStroke = "rgba(255,255,255,0.04)"
    const isCurrency = chartData.title?.toLowerCase().includes('revenue') || chartData.title?.toLowerCase().includes('deal') || chartData.title?.toLowerCase().includes('sales') || false
    const tt = <CustomTooltip isCurrency={isCurrency} />

    const labels = chartData.labels || []
    const datasets = chartData.datasets || []

    // Transform datasets for Recharts
    const data = labels.map((lbl, i) => {
        const row = { name: lbl }
        datasets.forEach(ds => { row[ds.label] = ds.data[i] })
        return row
    })

    // Determine keys
    const xKey = "name"
    const yKeys = datasets.map(ds => ds.label)

    switch (type) {
        case "bar":
        case "stackedBar":
            return (
                <ResponsiveContainer width="100%" height={210}>
                    <BarChart data={data} margin={{ top: 6, right: 4, left: -12, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                        <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: C.border }} tickLine={false} dy={10} />
                        <YAxis tick={axisTick} width={60} axisLine={false} tickLine={false}
                            tickFormatter={v => isCurrency ? fmtINR(v) : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                        {!ghost && <Tooltip content={tt} cursor={{ fill: "rgba(255,255,255,0.025)" }} />}
                        {!ghost && yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />}
                        {yKeys.map((k, i) => (
                            <Bar key={k} dataKey={k} stackId={type === 'stackedBar' ? 'a' : undefined} fill={ghost ? ghostC : P[i % P.length]} radius={type === 'stackedBar' ? [0, 0, 0, 0] : [5, 5, 0, 0]} barSize={type === 'stackedBar' ? 40 : 32}>
                                {yKeys.length === 1 && data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={ghost ? ghostC : P[index % P.length]} />
                                ))}
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            );
        case "line": return (
            <ResponsiveContainer width="100%" height={210}>
                <LineChart data={data} margin={{ top: 6, right: 4, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: C.border }} tickLine={false} dy={10} />
                    <YAxis tick={axisTick} width={60} axisLine={false} tickLine={false}
                        tickFormatter={v => isCurrency ? fmtINR(v) : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                    {!ghost && <Tooltip content={tt} />}
                    {!ghost && yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />}
                    {yKeys.map((k, i) => (
                        <Line key={k} type="monotone" dataKey={k}
                            stroke={ghost ? ghostC : P[i % P.length]}
                            strokeWidth={ghost ? 1.5 : 2.5}
                            dot={ghost ? false : { r: 4, fill: P[i % P.length], stroke: C.card, strokeWidth: 2 }}
                            activeDot={ghost ? false : { r: 6 }} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        );
        case "area": return (
            <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={data} margin={{ top: 6, right: 4, left: -12, bottom: 0 }}>
                    <defs>
                        {yKeys.map((k, i) => (
                            <linearGradient key={k} id={`ag-${chartData.id || chartData?.title || 'default'}-${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={ghost ? ghostC : P[i % P.length]} stopOpacity={ghost ? 0.15 : 0.35} />
                                <stop offset="95%" stopColor={ghost ? ghostC : P[i % P.length]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: C.border }} tickLine={false} dy={10} />
                    <YAxis tick={axisTick} width={60} axisLine={false} tickLine={false}
                        tickFormatter={v => isCurrency ? fmtINR(v) : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                    {!ghost && <Tooltip content={tt} />}
                    {yKeys.map((k, i) => (
                        <Area key={k} type="monotone" dataKey={k}
                            stroke={ghost ? ghostC : P[i % P.length]}
                            fill={`url(#ag-${chartData.id || chartData?.title || 'default'}-${i})`}
                            strokeWidth={ghost ? 1.5 : 2.5} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        );
        case "pie": {
            const pieData = labels.map((lbl, i) => ({
                name: lbl,
                value: datasets[0]?.data[i] ?? 0,
            }))
            return (
                <ResponsiveContainer width="100%" height={210}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name"
                            cx="50%" cy="50%" outerRadius={82} innerRadius={40} paddingAngle={3}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={{ stroke: '#6B80A0', strokeWidth: 1 }}>
                            {pieData.map((_, i) => (
                                <Cell key={i} fill={ghost ? ghostC : P[i % P.length]}
                                    stroke="var(--surface)" strokeWidth={2} style={{ outline: 'none' }} />
                            ))}
                        </Pie>
                        {!ghost && <Tooltip content={tt} />}
                        {!ghost && <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />}
                    </PieChart>
                </ResponsiveContainer>
            );
        }
        case "horizontalBar": {
            const hData = labels.map((lbl, i) => ({
                name: lbl,
                value: datasets[0]?.data[i] ?? 0,
            }))
            return (
                <ResponsiveContainer width="100%" height={210}>
                    <BarChart layout="vertical" data={hData} margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={true} vertical={false} />
                        <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} />
                        <YAxis dataKey="name" type="category" tick={axisTick} axisLine={false} tickLine={false} width={80} />
                        {!ghost && <Tooltip content={tt} cursor={{ fill: "rgba(255,255,255,0.025)" }} />}
                        <Bar dataKey="value" fill={ghost ? ghostC : P[0]} radius={[0, 5, 5, 0]} barSize={20}>
                            {hData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ghost ? ghostC : P[index % P.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            );
        }
        case "composed": return (
            <ResponsiveContainer width="100%" height={210}>
                <ComposedChart data={data} margin={{ top: 6, right: 4, left: -12, bottom: 0 }}>
                    <defs>
                        <linearGradient id={`comp-${chartData.id || 'def'}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={P[0]} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={P[0]} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis dataKey={xKey} tick={axisTick} axisLine={{ stroke: C.border }} tickLine={false} dy={10} />
                    <YAxis tick={axisTick} width={60} axisLine={false} tickLine={false}
                        tickFormatter={v => isCurrency ? fmtINR(v) : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                    {!ghost && <Tooltip content={tt} />}
                    <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />
                    <Area type="monotone" dataKey={datasets[0]?.label} fill={`url(#comp-${chartData.id || 'def'})`} stroke={P[0]} strokeWidth={2} />
                    {datasets.length > 1 && (
                        <Line type="monotone" dataKey={datasets[1]?.label} stroke={P[1]} strokeWidth={2.5} dot={{ r: 4, fill: P[1], stroke: C.card, strokeWidth: 2 }} />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        );
        case "radar": {
            const radarData = labels.map((lbl, i) => {
                const row = { subject: lbl }
                datasets.forEach(ds => { row[ds.label] = ds.data[i] })
                return row
            })
            return (
                <ResponsiveContainer width="100%" height={210}>
                    <RadarChart data={radarData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} cx="50%" cy="50%" outerRadius={70}>
                        <PolarGrid stroke={gridStroke} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: C.sub, fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={['auto', 'auto']} tick={false} axisLine={false} />
                        {!ghost && <Tooltip content={tt} />}
                        {!ghost && yKeys.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />}
                        {yKeys.map((k, i) => (
                            <Radar key={k} name={k} dataKey={k} stroke={ghost ? ghostC : P[i % P.length]} fill={ghost ? ghostC : P[i % P.length]} fillOpacity={ghost ? 0.1 : 0.4} />
                        ))}
                    </RadarChart>
                </ResponsiveContainer>
            );
        }
        default: return <div style={{ color: '#8b95a8', textAlign: 'center', padding: 20 }}>Unsupported chart type</div>;
    }
}

export default function ChartCard({ chartData, title, subtitle, colSpan = 6, children }) {
    return (
        <div className={`chart-card col-${colSpan}`}>
            <div className="chart-card-header">
                <div>
                    <div className="chart-card-title">{title || chartData?.title || 'Chart'}</div>
                    {subtitle && <div className="chart-card-subtitle">{subtitle}</div>}
                </div>
                <button className="chart-menu">⋯</button>
            </div>
            {children}
            <div className="chart-wrap" style={{ height: 210 }}>
                {chartData ? renderChart(chartData) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#56637a', fontSize: 13 }}>
                        No data yet
                    </div>
                )}
            </div>
        </div>
    )
}
