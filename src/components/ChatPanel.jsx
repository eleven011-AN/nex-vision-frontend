import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Bot, User, UploadCloud, FileSpreadsheet, Send, TrendingUp, Trophy, Globe, PieChart, BarChart2, Sparkles, X, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'

const API = 'https://nex-vision-backend.onrender.com'

const SUGGESTIONS = [
    { icon: <TrendingUp size={14} />, text: 'Show the trend over time' },
    { icon: <Trophy size={14} />, text: 'Which category has the highest value?' },
    { icon: <Globe size={14} />, text: 'Compare values across all groups' },
    { icon: <PieChart size={14} />, text: 'Show distribution as a pie chart' },
    { icon: <BarChart2 size={14} />, text: 'Rank items from highest to lowest' },
]

function TypingIndicator() {
    return (
        <div className="chat-msg ai">
            <div className="msg-avatar"><Bot size={16} /></div>
            <div className="msg-bubble">
                <div className="typing-indicator">
                    <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
            </div>
        </div>
    )
}

// ── Speech helpers (browser Web Speech API) ──────────────────────────────────
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
const speechSupported = !!SpeechRecognitionAPI

function speakText(text) {
    if (!window.speechSynthesis) return
    // Strip markdown symbols before speaking
    const clean = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/[#_`~>]/g, '')
        .replace(/⚠️|❌|✅/g, '')
        .trim()
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(clean)
    utt.rate = 1.05
    utt.pitch = 1
    // Prefer a natural English voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.lang.startsWith('en') && v.localService)
    if (preferred) utt.voice = preferred
    window.speechSynthesis.speak(utt)
}

export default function ChatPanel({ datasetId, datasetInfo, onQueryResult, onUploadClick, onFileUploaded }) {
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: 'Hello! I\'m your AI data analyst.\n\nStart by uploading a CSV or Excel file — then ask me anything about your data and I\'ll generate interactive charts instantly!',
        },
    ])
    const [input, setInput] = useState('')
    const [typing, setTyping] = useState(false)
    const [filename, setFilename] = useState(null)
    const [dragover, setDragover] = useState(false)

    // ── Voice state ───────────────────────────────────────────────────────────
    const [listening, setListening] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(true)   // auto-speak AI responses
    const recognitionRef = useRef(null)
    const transcriptRef = useRef('')   // stores live transcript — avoids React StrictMode double-call bug
    const voiceSentRef = useRef(false) // guard: ensures sendMessage fires only once per session

    const messagesRef = useRef(null)
    const textareaRef = useRef(null)

    useEffect(() => {
        if (datasetInfo) setFilename(datasetInfo.filename)
    }, [datasetInfo])

    useEffect(() => {
        messagesRef.current?.scrollTo({ top: 99999, behavior: 'smooth' })
    }, [messages, typing])

    // Load voices after they're available (Chrome async)
    useEffect(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
        }
    }, [])

    const autoResize = (e) => {
        e.target.style.height = 'auto'
        e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
    }

    // ── Voice input: toggle mic ───────────────────────────────────────────────
    const toggleMic = () => {
        if (!speechSupported) {
            alert('Your browser does not support voice recognition. Try Chrome or Edge.')
            return
        }

        if (listening) {
            recognitionRef.current?.stop()
            setListening(false)
            return
        }

        // Reset refs for a fresh session
        transcriptRef.current = ''
        voiceSentRef.current = false

        const recognition = new SpeechRecognitionAPI()
        recognition.lang = 'en-US'
        recognition.interimResults = true
        recognition.continuous = false

        recognition.onstart = () => setListening(true)

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join('')
            setInput(transcript)
            transcriptRef.current = transcript  // keep ref in sync
        }

        recognition.onend = () => {
            setListening(false)
            // Use ref (not state updater) to avoid React StrictMode double-invocation
            const finalText = transcriptRef.current.trim()
            if (finalText && !voiceSentRef.current) {
                voiceSentRef.current = true
                transcriptRef.current = ''
                setTimeout(() => sendMessage(finalText), 80)
            }
        }

        recognition.onerror = (e) => {
            console.error('Speech error:', e.error)
            setListening(false)
        }

        recognitionRef.current = recognition
        recognition.start()
    }

    const handleFileChange = async (file) => {
        if (!file) return
        setFilename(file.name)
        addAiMessage(`Uploading **${file.name}**...`)

        const form = new FormData()
        form.append('file', file)
        try {
            const res = await axios.post(`${API}/upload`, form)
            const d = res.data
            onFileUploaded({
                id: d.dataset_id,
                filename: file.name,
                rows: d.rows,
                columns: d.columns,
            })
            addAiMessage(
                `**${file.name}** loaded successfully!\n\n` +
                `**${d.rows.toLocaleString()} rows** · **${d.columns.length} columns**\n` +
                `Columns: ${d.columns.slice(0, 6).join(', ')}${d.columns.length > 6 ? '…' : ''}\n\n` +
                `The dashboard has been auto-generated from your data. Now ask me anything!`
            )
        } catch (e) {
            const errorMsg = e.response?.data?.detail || e.message || 'Unknown error'
            addAiMessage(`Upload failed: **${errorMsg}**`)
            setFilename(null)
        }
    }

    const addAiMessage = (text, speak = false) => {
        setMessages(prev => [...prev, { role: 'ai', text }])
        if (speak && voiceEnabled) speakText(text)
    }

    const sendMessage = async (text) => {
        const prompt = (text || input).trim()
        if (!prompt) return
        setInput('')
        if (textareaRef.current) textareaRef.current.style.height = 'auto'

        if (!datasetId) {
            setMessages(prev => [...prev, { role: 'user', text: prompt }])
            addAiMessage('Please upload a file first before asking questions. Click the "Upload Data" button or drop a file above.')
            return
        }

        setMessages(prev => [...prev, { role: 'user', text: prompt }])
        setTyping(true)

        try {
            const res = await axios.post(`${API}/query`, {
                prompt,
                dataset_id: datasetId,
            })
            setTyping(false)
            onQueryResult(res.data, prompt)
            const aiReply = res.data.ai_text || 'Here are your results!'
            addAiMessage(aiReply, true)  // ← speak=true: reads response aloud
        } catch {
            setTyping(false)
            addAiMessage('Could not connect to the backend. Make sure FastAPI is running on port 8000.')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const clearFile = () => setFilename(null)

    return (
        <aside className="chat-panel">
            <div className="chat-panel-header">
                <h2><span className="pulse-dot" /> Ask Your Data</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ margin: 0 }}>Upload a file, then type or speak your question</p>
                    {/* Voice output toggle */}
                    <button
                        onClick={() => { setVoiceEnabled(v => !v); window.speechSynthesis?.cancel() }}
                        title={voiceEnabled ? 'Mute AI voice' : 'Enable AI voice'}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                            color: voiceEnabled ? 'var(--teal)' : 'var(--text-3)',
                            display: 'flex', alignItems: 'center'
                        }}
                    >
                        {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                    </button>
                </div>
            </div>

            {/* Upload zone */}
            {!filename ? (
                <div
                    className={`upload-zone ${dragover ? 'dragover' : ''}`}
                    onDragOver={e => { e.preventDefault(); setDragover(true) }}
                    onDragLeave={() => setDragover(false)}
                    onDrop={e => { e.preventDefault(); setDragover(false); handleFileChange(e.dataTransfer.files[0]) }}
                >
                    <input
                        type="file"
                        accept=".csv,.xlsx,.json"
                        onChange={e => handleFileChange(e.target.files[0])}
                    />
                    <UploadCloud size={28} style={{ margin: '0 auto 8px', color: 'var(--text-2)' }} />
                    <div className="up-title">Drop your dataset here</div>
                    <div className="up-sub">CSV, Excel, JSON</div>
                </div>
            ) : (
                <div className="file-badge">
                    <FileSpreadsheet size={16} />
                    <span className="fname">{filename}</span>
                    <button onClick={clearFile} style={{ display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                </div>
            )}

            {/* Suggestions */}
            <div className="suggestions-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} /> Sample Queries
            </div>
            <div className="suggestions">
                {SUGGESTIONS.map((s, i) => (
                    <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => sendMessage(s.text)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        {s.icon} {s.text}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="chat-messages" ref={messagesRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-msg ${msg.role}`}>
                        <div className="msg-avatar">
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className="msg-bubble" style={{ whiteSpace: 'pre-line' }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {typing && <TypingIndicator />}
            </div>

            {/* Input area with mic button */}
            <div className="chat-input-area">
                <div className="chat-input-wrap">
                    <textarea
                        ref={textareaRef}
                        className="chat-input"
                        placeholder={
                            listening
                                ? '🎤 Listening… speak now'
                                : datasetId
                                    ? 'Ask anything about your data… or press 🎤'
                                    : 'Upload a file first to start asking questions…'
                        }
                        value={input}
                        rows={1}
                        onChange={e => setInput(e.target.value)}
                        onInput={autoResize}
                        onKeyDown={handleKeyDown}
                    />

                    {/* Mic button */}
                    {speechSupported && (
                        <button
                            className="send-btn"
                            onClick={toggleMic}
                            title={listening ? 'Stop listening' : 'Voice input'}
                            style={{
                                marginRight: 4,
                                background: listening
                                    ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
                                    : undefined,
                                animation: listening ? 'pulse 1s infinite' : 'none',
                            }}
                        >
                            {listening ? <MicOff size={15} /> : <Mic size={15} />}
                        </button>
                    )}

                    <button className="send-btn" onClick={() => sendMessage()}>
                        <Send size={15} />
                    </button>
                </div>

                {listening && (
                    <div style={{
                        fontSize: 11, color: 'var(--teal)', textAlign: 'center',
                        marginTop: 6, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: 6, animation: 'pulse 1s infinite'
                    }}>
                        <Mic size={11} /> Listening… speak your query then pause
                    </div>
                )}
            </div>
        </aside>
    )
}
