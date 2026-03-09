import KpiCard from './KpiCard'
import ChartCard from './ChartCard'
import { Sparkles, Database, Upload, Lock, MessageSquare } from 'lucide-react'

const KPI_COLORS = ['teal', 'coral', 'purple', 'amber']

const PLACEHOLDER_KPIS = [
    { label: "Total Revenue", value: "——", trend: "-", up: true, iconName: "rupee" },
    { label: "Avg Deal Size", value: "——", trend: "-", up: true, iconName: "chartLine" },
    { label: "Win Rate", value: "——", trend: "-", up: true, iconName: "target" },
    { label: "Total Leads", value: "——", trend: "-", up: true, iconName: "database" },
]

const PLACEHOLDER_CHARTS = [
    {
        title: "Revenue Forecast",
        type: "line",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{ label: "Simulated", data: [10, 20, 15, 30, 25, 40] }]
    },
    {
        title: "Deal Stage Pipeline",
        type: "bar",
        labels: ["Lead", "Meeting", "Proposal", "Closed"],
        datasets: [{ label: "Count", data: [40, 25, 10, 5] }]
    },
    {
        title: "Sales by Region",
        type: "pie",
        labels: ["North", "South", "East", "West"],
        datasets: [{ label: "Distribution", data: [35, 25, 20, 20] }]
    },
    {
        title: "Top Performers",
        type: "horizontalBar",
        labels: ["Alice", "Bob", "Charlie", "Diana"],
        datasets: [{ label: "Rev.", data: [150, 120, 90, 60] }]
    }
]

export default function Dashboard({ kpis, charts, loading, subtitle, queryPrompt, datasetInfo, onUploadClick }) {
    const hasData = datasetInfo != null
    const displayKpis = kpis || []
    const hasCharts = charts && charts.length > 0

    return (
        <main className="dashboard-area">
            {/* Loading overlay */}
            <div className={`loading-overlay ${loading ? 'visible' : ''}`}>
                <div className="loading-spinner" />
                <div className="loading-text">Generating Dashboard…</div>
                <div className="loading-sub" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Analyzing with AI <Sparkles size={14} />
                </div>
            </div>

            {/* Top bar */}
            <div className="dashboard-topbar">
                <div>
                    <div className="dashboard-title">
                        {queryPrompt
                            ? `Results: "${queryPrompt.slice(0, 50)}${queryPrompt.length > 50 ? '…' : ''}"`
                            : 'DataSense AI Overview'}
                    </div>
                    <div className="dashboard-subtitle">
                        {subtitle || (hasData ? 'Dataset ready for analysis' : 'No dataset loaded')}
                    </div>
                </div>
                <div className="dashboard-filters">
                    <button
                        className="btn btn-primary"
                        style={{ fontSize: 12, padding: '7px 14px' }}
                        onClick={() => window.location.reload()}
                    >
                        <Sparkles size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Status bar */}
            <div className="status-bar">
                <div className="status-dot" style={{ background: hasData ? 'var(--teal)' : 'var(--text-3)' }} />
                <div>
                    <strong>AI Engine {hasData ? 'Ready' : 'Waiting'}</strong> ·
                    {hasData ? ' Dataset connected' : ' Please upload a file'}
                </div>
                {hasData && (
                    <div className="status-right" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Database size={14} /> {datasetInfo.rows.toLocaleString()} Records · {datasetInfo.columns.length} Columns
                    </div>
                )}
            </div>

            {!hasData ? (
                <div className="placeholder-dashboard" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(6, 8, 16, 0.4) 0%, rgba(6, 8, 16, 0.95) 100%)', borderRadius: 'var(--radius-xl)' }}>
                        <div className="empty-state" style={{ background: 'var(--card)', border: '1px solid var(--border)', padding: '40px 60px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: 480 }}>
                            <div className="e-icon" style={{ background: 'var(--surface)', width: 64, height: 64, margin: '0 auto 20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lock size={28} color="var(--teal)" />
                            </div>
                            <h3>Unlock Your Dashboard</h3>
                            <p style={{ fontSize: 14, color: 'var(--sub)', lineHeight: 1.6, marginBottom: 24 }}>
                                This is a completely dynamic layout. Upload a CSV, Excel, or JSON file to instantly generate an AI-powered overview of your specific data.
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', padding: '12px 20px', fontSize: 15 }} onClick={onUploadClick}>
                                <Upload size={16} style={{ marginRight: 8 }} /> Upload Data to Begin
                            </button>
                        </div>
                    </div>
                    {/* Background Skeletons */}
                    <div style={{ opacity: 0.3, pointerEvents: 'none', filter: 'grayscale(100%)' }}>
                        <div className="kpi-row">
                            {PLACEHOLDER_KPIS.map((kpi, i) => (
                                <KpiCard key={i} kpi={kpi} index={i} ghost={true} />
                            ))}
                        </div>
                        <div className="chart-grid">
                            <ChartCard chartData={PLACEHOLDER_CHARTS[0]} title={PLACEHOLDER_CHARTS[0].title} colSpan={8} />
                            <ChartCard chartData={PLACEHOLDER_CHARTS[1]} title={PLACEHOLDER_CHARTS[1].title} colSpan={4} />
                        </div>
                        <div className="chart-grid">
                            <ChartCard chartData={PLACEHOLDER_CHARTS[2]} title={PLACEHOLDER_CHARTS[2].title} colSpan={4} />
                            <ChartCard chartData={PLACEHOLDER_CHARTS[3]} title={PLACEHOLDER_CHARTS[3].title} colSpan={8} />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* KPI Row */}
                    {displayKpis.length > 0 && (
                        <div className="kpi-row">
                            {displayKpis.slice(0, 4).map((kpi, i) => (
                                <KpiCard
                                    key={i}
                                    kpi={kpi}
                                    index={i}
                                    ghost={false}
                                />
                            ))}
                        </div>
                    )}

                    {/* Charts */}
                    {hasCharts ? (
                        <>
                            {/* Row 1 */}
                            <div className="chart-grid">
                                {charts[0] && (
                                    <ChartCard
                                        chartData={charts[0]}
                                        title={charts[0].title}
                                        colSpan={charts[1] ? 8 : 12}
                                    />
                                )}
                                {charts[1] && (
                                    <ChartCard
                                        chartData={charts[1]}
                                        title={charts[1].title}
                                        colSpan={4}
                                    />
                                )}
                            </div>

                            {/* Row 2 */}
                            {charts.length > 2 && (
                                <div className="chart-grid">
                                    {charts[2] && (
                                        <ChartCard
                                            chartData={charts[2]}
                                            title={charts[2].title}
                                            colSpan={charts[3] ? 7 : 12}
                                        />
                                    )}
                                    {charts[3] && (
                                        <ChartCard
                                            chartData={charts[3]}
                                            title={charts[3].title}
                                            colSpan={5}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Row 3 */}
                            {charts.length > 4 && (
                                <div className="chart-grid">
                                    {charts[4] && (
                                        <ChartCard
                                            chartData={charts[4]}
                                            title={charts[4].title}
                                            colSpan={charts[5] ? 8 : 12}
                                        />
                                    )}
                                    {charts[5] && (
                                        <ChartCard
                                            chartData={charts[5]}
                                            title={charts[5].title}
                                            colSpan={4}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Extra charts */}
                            {charts.length > 6 && (
                                <div className="chart-grid">
                                    {charts.slice(6).map((c, i) => (
                                        <ChartCard key={i} chartData={c} title={c.title} colSpan={6} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="empty-state" style={{ padding: '80px 0' }}>
                            <div className="e-icon">
                                <MessageSquare size={56} strokeWidth={1} style={{ opacity: 0.6, marginBottom: 12, color: 'var(--text-3)' }} />
                            </div>
                            <h3>Ask Your Data</h3>
                            <p>Type a question in the chat panel to generate a specific visualization, or wait for the auto-overview to load.</p>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
