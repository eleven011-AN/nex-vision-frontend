import { Bell, RefreshCw } from 'lucide-react'

export default function Header({ onUploadClick }) {
    return (
        <header className="top-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginRight: 24 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: `0 0 20px rgba(0,201,167,0.4), 0 0 40px rgba(51,154,240,0.2)`,
                    flexShrink: 0, border: "1px solid rgba(0,201,167,0.25)"
                }}>
                    <img
                        src="/nexvision-logo.png"
                        alt="NexVision Logo"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                </div>
                <div style={{ lineHeight: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em", fontFamily: "'Outfit', sans-serif" }}>
                        <span style={{
                            background: `linear-gradient(90deg, #00c9a7, #339af0)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>Nex</span>
                        <span style={{ color: "var(--text-1)" }}>Vision</span>
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 2, fontWeight: 500 }}>
                        AI Analytics
                    </div>
                </div>
            </div>
            <div className="header-greeting">
                <h1>Business Intelligence Dashboard</h1>
                <p>AI-powered insights · Powered by Gemini · Live data</p>
            </div>
            <div className="header-actions">
                <button className="btn btn-ghost btn-icon" title="Notifications"><Bell size={18} /></button>
                <button className="btn btn-ghost btn-icon" title="Refresh" onClick={() => window.location.reload()}><RefreshCw size={18} /></button>
                <div className="avatar" title="User">JD</div>
            </div>
        </header>
    )
}
