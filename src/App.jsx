import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import ChatPanel from './components/ChatPanel'
import Dashboard from './components/Dashboard'
import UploadModal from './components/UploadModal'
import './index.css'

const API = 'http://localhost:8000'

export default function App() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // No data until user uploads
  const [kpis, setKpis] = useState([])
  const [charts, setCharts] = useState([])
  const [datasetId, setDatasetId] = useState(null)
  const [datasetInfo, setDatasetInfo] = useState(null)  // { filename, rows, columns }
  const [subtitle, setSubtitle] = useState(null)
  const [queryPrompt, setQueryPrompt] = useState(null)

  const handleQueryResult = (data, prompt) => {
    if (data.kpis?.length) setKpis(data.kpis)
    if (data.charts?.length) setCharts(data.charts)
    if (prompt) setQueryPrompt(prompt)
    if (data.rows_analyzed)
      setSubtitle(`${data.rows_analyzed.toLocaleString()} records analyzed`)
  }

  // Called after file is uploaded successfully
  const handleUploaded = async ({ id, filename, rows, columns }) => {
    setDatasetId(id)
    setDatasetInfo({ filename, rows, columns })
    setSubtitle(`📄 ${filename} · ${rows.toLocaleString()} rows · ${columns.length} columns`)
    setQueryPrompt(null)

    // Auto-generate overview charts from the uploaded data
    setLoading(true)
    try {
      const res = await axios.get(`${API}/dataset/${id}/overview`)
      if (res.data.success) {
        setKpis(res.data.kpis || [])
        setCharts(res.data.charts || [])
      }
    } catch {
      setKpis([])
      setCharts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="main-content">
        <Header onUploadClick={() => setUploadModalOpen(true)} />

        <div className="page-body">
          <ChatPanel
            datasetId={datasetId}
            datasetInfo={datasetInfo}
            onQueryResult={handleQueryResult}
            onUploadClick={() => setUploadModalOpen(true)}
            onFileUploaded={handleUploaded}
          />

          <Dashboard
            kpis={kpis}
            charts={charts}
            loading={loading}
            subtitle={subtitle}
            queryPrompt={queryPrompt}
            datasetInfo={datasetInfo}
            onUploadClick={() => setUploadModalOpen(true)}
          />
        </div>
      </div>

      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploaded={handleUploaded}
      />
    </div>
  )
}
