import { useState, useRef } from 'react'
import axios from 'axios'
import { FolderOpen, X, CloudUpload, FileSpreadsheet, Loader2, Rocket } from 'lucide-react'

const API = 'https://nex-vision-backend.onrender.com/'

export default function UploadModal({ open, onClose, onUploaded }) {
    const [dragover, setDragover] = useState(false)
    const [filename, setFilename] = useState(null)
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFile = (f) => {
        if (!f) return
        setFile(f)
        setFilename(f.name)
    }

    const handleConfirm = async () => {
        if (!file) return
        setLoading(true)
        const form = new FormData()
        form.append('file', file)
        try {
            const res = await axios.post(`${API}/upload`, form)
            onUploaded({ id: res.data.dataset_id, filename: file.name, rows: res.data.rows, columns: res.data.columns })
            setFilename(null)
            setFile(null)
            onClose()
        } catch (e) {
            const errorMsg = e.response?.data?.detail || e.message || 'Unknown error'
            alert(`Upload failed: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`modal-backdrop ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <div className="modal-header">
                    <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FolderOpen size={20} color="var(--teal)" /> Upload Data File
                    </div>
                    <button className="modal-close" onClick={onClose}><X size={16} /></button>
                </div>

                <div
                    className={`modal-upload-area ${dragover ? 'dragover' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragover(true) }}
                    onDragLeave={() => setDragover(false)}
                    onDrop={e => { e.preventDefault(); setDragover(false); handleFile(e.dataTransfer.files[0]) }}
                >
                    <input type="file" accept=".csv,.xlsx,.json" onChange={e => handleFile(e.target.files[0])} />
                    <div className="upload-icon-big" style={{ marginBottom: 12, color: 'var(--text-3)' }}>
                        <CloudUpload size={48} strokeWidth={1.5} />
                    </div>
                    <div className="upload-desc"><strong>Click to browse</strong> or drag & drop</div>
                    <div className="upload-formats">Supports CSV, Excel (.xlsx), JSON</div>
                </div>

                {filename && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#00c9a7', marginBottom: 12, fontWeight: 600 }}>
                        <FileSpreadsheet size={16} /> Selected: {filename}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button
                        className="btn btn-primary"
                        disabled={!file || loading}
                        onClick={handleConfirm}
                        style={{ opacity: (!file || loading) ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        {loading ? <><Loader2 size={16} className="spin" /> Uploading...</> : <><Rocket size={16} /> Load & Analyze</>}
                    </button>
                </div>
            </div>
        </div>
    )
}
