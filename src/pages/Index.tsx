import { useState, useRef, useEffect, useCallback } from "react";

type Role = "user" | "zoro";

type Message = {
  role: Role;
  text: string;
  image?: string;
  timestamp: Date;
  id: string;
  pinned?: boolean;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

type Settings = {
  ttsEnabled: boolean;
  soundEnabled: boolean;
  storeHistory: boolean;
  darkMode: boolean;
};

// ── Icons ──────────────────────────────────────────────────────────────────

function SwordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M2 2l20 20" />
      <path d="M20 16.5L17.5 19" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
    </svg>
  );
}

function CopyIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TrashIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MenuIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function ChatIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ImageIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function XIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MicIcon({ size = 16, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function PinIcon({ size = 13, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BrainIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.96-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.96-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.96-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.96-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function SettingsIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SpeakerIcon({ size = 13, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {active
        ? <><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>
        : <line x1="23" y1="9" x2="17" y2="15" />}
    </svg>
  );
}

// ── Completion sound ───────────────────────────────────────────────────────

function playCompletionSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playNote = (freq: number, delay: number, dur: number, vol: number, type: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + delay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.015);
      gain.gain.setValueAtTime(vol, t + dur * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    };
    playNote(587.33, 0,    0.55, 0.09, "sine");
    playNote(587.33, 0,    0.55, 0.03, "triangle");
    playNote(739.99, 0.14, 0.5,  0.08, "sine");
    playNote(739.99, 0.14, 0.5,  0.02, "triangle");
  } catch {}
}

// ── ElevenLabs TTS ────────────────────────────────────────────────────────

const ELEVEN_KEY  = import.meta.env.VITE_ELEVENLABS_KEY  as string;
const ELEVEN_VOICE = import.meta.env.VITE_ELEVENLABS_VOICE as string; // EOVAuWqgSZN2Oel78Psj

let activeAudio: HTMLAudioElement | null = null;

function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "code block")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\[System:[^\]]*\]/g, "")
    .replace(/\bngl\b/gi, "not gonna lie")
    .replace(/\btbh\b/gi, "to be honest")
    .replace(/\bidk\b/gi, "I don't know")
    .replace(/\bimo\b/gi, "in my opinion")
    .replace(/\bbtw\b/gi, "by the way")
    .replace(/\brn\b/gi, "right now")
    .replace(/[*_~`>#]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\.{2,}/g, ".")
    .trim();
}

async function speakWithElevenLabs(text: string, onEnd?: () => void) {
  stopSpeaking();
  const clean = stripForSpeech(text);
  if (!clean || clean.length < 2) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean }),
    });

    if (!res.ok) throw new Error(`TTS error: ${res.status}`);

    const blob  = await res.blob();
    const url   = URL.createObjectURL(blob);
    const audio = new Audio(url);
    activeAudio = audio;
    audio.onended = () => { activeAudio = null; URL.revokeObjectURL(url); onEnd?.(); };
    audio.onerror = () => { activeAudio = null; URL.revokeObjectURL(url); onEnd?.(); };
    await audio.play();
  } catch (err) {
    console.error("TTS error:", err);
    onEnd?.();
  }
}

function stopSpeaking() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
}

// ── Markdown renderer ──────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  const cleaned = text.replace(/\[System:[^\]]*\]/g, "").trim();
  return cleaned
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block"><code>${escHtml(code.trim())}</code></pre>`)
    .replace(/`([^`]+)`/g, (_, c) => `<code class="inline-code">${escHtml(c)}</code>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
    .replace(/^[\-\*] (.+)$/gm, '<li class="md-li">$1</li>')
    .replace(/(<li[\s\S]+?<\/li>)/g, '<ul class="md-ul">$1</ul>')
    .replace(/\n\n/g, '</p><p class="md-p">')
    .replace(/\n/g, "<br/>");
}

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── Helpers ────────────────────────────────────────────────────────────────

function generateTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const t = first.text.trim() || "📷 image";
  return t.length > 36 ? t.slice(0, 36) + "…" : t;
}

function groupChatsByDate(chats: Chat[]): { label: string; items: Chat[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const week = new Date(today.getTime() - 6 * 86400000);
  const groups: Record<string, Chat[]> = { Today: [], Yesterday: [], "This week": [], Older: [] };
  for (const chat of chats) {
    const d = new Date(chat.createdAt.getFullYear(), chat.createdAt.getMonth(), chat.createdAt.getDate());
    if (d >= today) groups["Today"].push(chat);
    else if (d >= yesterday) groups["Yesterday"].push(chat);
    else if (d >= week) groups["This week"].push(chat);
    else groups["Older"].push(chat);
  }
  return Object.entries(groups).filter(([, i]) => i.length > 0).map(([label, items]) => ({ label, items }));
}

const STORAGE_KEY  = "zoro_chats_v2";
const MEMORY_KEY   = "zoro_memory_v1";
const SETTINGS_KEY = "zoro_settings_v2";

const DEFAULT_SETTINGS: Settings = {
  ttsEnabled: false,
  soundEnabled: true,
  storeHistory: true,
  darkMode: false,
};

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch { return []; }
}

function saveChats(chats: Chat[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(chats)); } catch {}
}

function loadMemory(): string[] {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || "[]"); } catch { return []; }
}

function saveMemory(m: string[]) {
  try { localStorage.setItem(MEMORY_KEY, JSON.stringify(m)); } catch {}
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

function saveSettings(s: Settings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

function isMobile(): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || "ontouchstart" in window;
}

// ── Message bubble ─────────────────────────────────────────────────────────

function MessageBubble({
  msg, onPin, onSpeak, isSpeaking, ttsEnabled,
}: {
  msg: Message;
  onPin: (id: string) => void;
  onSpeak: (text: string, id: string) => void;
  isSpeaking: boolean;
  ttsEnabled: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(msg.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [msg.text]);

  const isZoro = msg.role === "zoro";
  const timeStr = msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`msg-row ${msg.role} ${msg.pinned ? "pinned" : ""}`}>
      <div className="avatar">{isZoro ? <SwordIcon size={12} /> : "U"}</div>
      <div className="bubble-wrap">
        {msg.pinned && <div className="pin-badge">📌 pinned</div>}
        <div className="bubble">
          {msg.image && <img src={msg.image} alt="attached" className="msg-image" />}
          {isZoro
            ? <div className="md-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
            : msg.text && <span>{msg.text}</span>}
        </div>
        <div className="bubble-meta">
          <span className="timestamp">{timeStr}</span>
          <button className="meta-btn" onClick={copy} title="Copy">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
          <button className="meta-btn" onClick={() => onPin(msg.id)} title={msg.pinned ? "Unpin" : "Pin"}>
            <PinIcon size={12} filled={!!msg.pinned} />
          </button>
          {isZoro && ttsEnabled && (
            <button
              className={`meta-btn ${isSpeaking ? "speaking" : ""}`}
              onClick={() => onSpeak(msg.text, msg.id)}
              title={isSpeaking ? "Stop" : "Read aloud"}
            >
              <SpeakerIcon size={12} active={isSpeaking} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Memory panel ───────────────────────────────────────────────────────────

function MemoryPanel({ memory, onAdd, onDelete, onClose }: {
  memory: string[];
  onAdd: (s: string) => void;
  onDelete: (i: number) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState("");
  const submit = () => {
    const t = val.trim();
    if (t) { onAdd(t); setVal(""); }
  };

  return (
    <div className="panel memory-panel">
      <div className="panel-header">
        <span className="panel-title"><BrainIcon size={13} /> Memory</span>
        <button className="icon-btn" onClick={onClose}><XIcon size={11} /></button>
      </div>
      <p className="panel-hint">Facts ZORO always remembers about you.</p>
      <div className="memory-list">
        {memory.length === 0 && <div className="empty-note">Nothing saved yet.</div>}
        {memory.map((item, i) => (
          <div key={i} className="memory-item">
            <span className="memory-text">{item}</span>
            <button className="del-btn" onClick={() => onDelete(i)}><XIcon size={10} /></button>
          </div>
        ))}
      </div>
      <div className="panel-input-row">
        <input
          className="panel-input"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="e.g. my name is Arjun"
          autoCapitalize="sentences"
        />
        <button className="panel-add-btn" onClick={submit}>Add</button>
      </div>
    </div>
  );
}

// ── Settings panel ─────────────────────────────────────────────────────────

function SettingsPanel({ settings, onChange, onClose }: {
  settings: Settings;
  onChange: (s: Settings) => void;
  onClose: () => void;
}) {
  const toggle = (key: keyof Settings) =>
    onChange({ ...settings, [key]: !settings[key] });

  const rows: { key: keyof Settings; label: string; desc: string }[] = [
    { key: "soundEnabled",  label: "Completion sound",  desc: "Soft chime when ZORO finishes replying" },
    { key: "ttsEnabled",    label: "Voice replies (Joshua)", desc: "ZORO reads responses in Joshua's voice via ElevenLabs" },
    { key: "storeHistory",  label: "Store chat history", desc: "Save conversations in this browser" },
    { key: "darkMode",      label: "Dark mode",          desc: "Switch to dark theme" },
  ];

  return (
    <div className="panel settings-panel">
      <div className="panel-header">
        <span className="panel-title"><SettingsIcon size={13} /> Settings</span>
        <button className="icon-btn" onClick={onClose}><XIcon size={11} /></button>
      </div>
      <div className="settings-list">
        {rows.map(({ key, label, desc }) => (
          <label key={key} className="setting-row">
            <div className="setting-info">
              <span className="setting-label">{label}</span>
              <span className="setting-desc">{desc}</span>
            </div>
            <div
              className={`toggle ${settings[key] ? "on" : ""}`}
              onClick={() => toggle(key)}
              role="switch"
              aria-checked={!!settings[key]}
            >
              <div className="toggle-thumb" />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Pinned bar ─────────────────────────────────────────────────────────────

function PinnedBar({ messages, onClose }: { messages: Message[]; onClose: () => void }) {
  const pinned = messages.filter((m) => m.pinned);
  if (!pinned.length) return null;
  return (
    <div className="pinned-bar">
      <div className="pinned-bar-head">
        <span><PinIcon size={11} filled /> {pinned.length} pinned</span>
        <button className="icon-btn" onClick={onClose}><XIcon size={11} /></button>
      </div>
      {pinned.map((m) => (
        <div key={m.id} className="pinned-item">
          <span className="pinned-who">{m.role === "zoro" ? "ZORO" : "You"}:</span>
          {" "}{m.text.slice(0, 100)}{m.text.length > 100 ? "…" : ""}
        </div>
      ))}
    </div>
  );
}

// ── Suggestions ────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { label: "What can you do?", icon: "✦" },
  { label: "Tell me something interesting", icon: "◈" },
  { label: "Give me a book rec", icon: "📖" },
  { label: "Roast me a little", icon: "🔥" },
  { label: "What's a good productivity tip?", icon: "⚡" },
  { label: "Make me laugh", icon: "😄" },
];

// ── Main ───────────────────────────────────────────────────────────────────

export default function Index() {
  const [settings, setSettings]       = useState<Settings>(loadSettings);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats]             = useState<Chat[]>(() => loadChats());
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [mobile]                      = useState(isMobile);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId]   = useState<string | null>(null);
  const [memory, setMemory]           = useState<string[]>(loadMemory);
  const [showMemory, setShowMemory]   = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPinned, setShowPinned]   = useState(false);

  const bottomRef     = useRef<HTMLDivElement>(null);
  const textareaRef   = useRef<HTMLTextAreaElement>(null);
  const sidebarRef    = useRef<HTMLDivElement>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const dark = settings.darkMode;

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node))
        setSidebarOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [sidebarOpen]);

  useEffect(() => {
    if (messages.length === 0) return;
    if (!settings.storeHistory) return;
    setChats((prev) => {
      if (activeChatId) {
        const updated = prev.map((c) =>
          c.id === activeChatId ? { ...c, messages, title: generateTitle(messages) } : c
        );
        saveChats(updated);
        return updated;
      } else {
        const newChat: Chat = {
          id: crypto.randomUUID(),
          title: generateTitle(messages),
          messages,
          createdAt: new Date(),
        };
        setActiveChatId(newChat.id);
        const updated = [newChat, ...prev];
        saveChats(updated);
        return updated;
      }
    });
  }, [messages, settings.storeHistory]);

  useEffect(() => { saveMemory(memory); }, [memory]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  useEffect(() => {
    const handle = (e: ClipboardEvent) => {
      for (const item of e.clipboardData?.items || []) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (!file) continue;
          const reader = new FileReader();
          reader.onload = () => setPendingImage(reader.result as string);
          reader.readAsDataURL(file);
          break;
        }
      }
    };
    window.addEventListener("paste", handle);
    return () => window.removeEventListener("paste", handle);
  }, []);

  // ── Voice input ───────────────────────────────────────────────────────────

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice input isn't supported in this browser. Try Chrome."); return; }

    const recog = new SR();
    recog.continuous      = false;
    recog.interimResults  = true;
    recog.lang            = "en-IN";

    recog.onstart  = () => setIsListening(true);
    recog.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setInput(t);
    };
    recog.onend = () => {
      setIsListening(false);
      setTimeout(() => {
        setInput((cur) => {
          if (cur.trim()) { sendMessage(cur.trim()); return ""; }
          return cur;
        });
      }, 200);
    };
    recog.onerror = () => setIsListening(false);

    recognitionRef.current = recog;
    recog.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSpeak = useCallback((text: string, id: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);
    speakWithElevenLabs(text, () => setSpeakingId(null));
  }, [speakingId]);

  const togglePin = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, pinned: !m.pinned } : m));
  }, []);

  const updateSettings = useCallback((s: Settings) => {
    setSettings(s);
    if (!s.ttsEnabled) { stopSpeaking(); setSpeakingId(null); }
  }, []);

  const startNewChat = () => {
    setMessages([]); setInput(""); setActiveChatId(null);
    setPendingImage(null); setSidebarOpen(false);
    setShowPinned(false); stopSpeaking(); setSpeakingId(null);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const loadChat = (chat: Chat) => {
    setMessages(chat.messages); setActiveChatId(chat.id);
    setSidebarOpen(false); setShowPinned(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats((prev) => { const u = prev.filter((c) => c.id !== id); saveChats(u); return u; });
    if (activeChatId === id) { setMessages([]); setActiveChatId(null); }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPendingImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Send with streaming ───────────────────────────────────────────────────

  const sendMessage = async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if ((!trimmed && !pendingImage) || loading) return;

    stopSpeaking(); setSpeakingId(null);

    const userMsg: Message = {
      role: "user", text: trimmed, image: pendingImage ?? undefined,
      timestamp: new Date(), id: crypto.randomUUID(),
    };

    const next = [...messages, userMsg];
    setMessages(next); setInput(""); setLoading(true);
    setPendingImage(null);

    const history = next.slice(-20).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      text: m.text,
    }));

    try {
      if (userMsg.image) {
        const base64     = userMsg.image.split(",")[1];
        const mimeMatch  = userMsg.image.match(/^data:([^;]+);base64,/);
        const mimeType   = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed || "what's in this image?", image_base64: base64, image_mime: mimeType, history, memory }),
        });
        const data  = await res.json();
        const clean = data.response.replace(/\[System:[^\]]*\]/g, "").trim();
        const msg: Message = { role: "zoro", text: clean, timestamp: new Date(), id: crypto.randomUUID() };
        setMessages((p) => [...p, msg]);
        if (settings.soundEnabled) playCompletionSound();
        if (settings.ttsEnabled) { setSpeakingId(msg.id); speakWithElevenLabs(clean, () => setSpeakingId(null)); }
      } else {
        const streamId = crypto.randomUUID();
        // ✅ FIX: Add the streaming bubble immediately — no separate typing indicator needed
        setMessages((p) => [...p, { role: "zoro", text: "", timestamp: new Date(), id: streamId }]);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, history, memory }),
        });

        const reader = res.body!.getReader();
        const dec    = new TextDecoder();
        let buf = "", full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          const lines = buf.split("\n\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.token) {
                full += parsed.token;
                const clean = full.replace(/\[System:[^\]]*\]/g, "").trim();
                setMessages((p) => p.map((m) => m.id === streamId ? { ...m, text: clean } : m));
              }
              if (parsed.done) {
                if (settings.soundEnabled) playCompletionSound();
                if (settings.ttsEnabled) {
                  setSpeakingId(streamId);
                  speakWithElevenLabs(full, () => setSpeakingId(null));
                }
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((p) => [...p, {
        role: "zoro", text: "can't reach the backend — make sure it's running.",
        timestamp: new Date(), id: crypto.randomUUID(),
      }]);
    }

    setLoading(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mobile) return;
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleSendDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault(); sendMessage();
  };

  const isEmpty      = messages.length === 0 && !loading;
  const grouped      = groupChatsByDate(chats);
  const canSend      = (input.trim().length > 0 || !!pendingImage) && !loading;
  const pinnedCount  = messages.filter((m) => m.pinned).length;

  // ── Check if last message is a zoro bubble with no text yet (streaming) ──
  const lastMsg = messages[messages.length - 1];
  const isStreaming = lastMsg?.role === "zoro" && lastMsg.text === "" && loading;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`zoro-root${dark ? " dark" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .zoro-root{
          --bg:#f5f4f1;
          --surface:#ffffff;
          --surface2:#edecea;
          --border:#e0ded9;
          --text:#181715;
          --text-muted:#8a8880;
          --accent:#181715;
          --accent-fg:#f5f4f1;
          --user-bg:#181715;
          --user-fg:#f5f4f1;
          --zoro-bg:#edecea;
          --zoro-fg:#181715;
          --pin:#d97706;
          --shadow:0 1px 3px rgba(0,0,0,0.06);
          --shadow-md:0 4px 24px rgba(0,0,0,0.09);
          --font:'Geist',system-ui,sans-serif;
          --mono:'Geist Mono',monospace;
          --sidebar-w:260px;
          font-family:var(--font);
          height:100dvh;
          background:var(--bg);
          color:var(--text);
          display:flex;flex-direction:column;
          overflow:hidden;position:relative;
          transition:background .2s,color .2s;
        }
        .zoro-root.dark{
          --bg:#0b0b0a;
          --surface:#161614;
          --surface2:#1d1d1b;
          --border:#272725;
          --text:#efefea;
          --text-muted:#565652;
          --accent:#efefea;
          --accent-fg:#0b0b0a;
          --user-bg:#efefea;
          --user-fg:#0b0b0a;
          --zoro-bg:#1d1d1b;
          --zoro-fg:#efefea;
          --pin:#fbbf24;
          --shadow:0 1px 3px rgba(0,0,0,0.5);
          --shadow-md:0 4px 24px rgba(0,0,0,0.6);
        }

        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:40;opacity:0;pointer-events:none;transition:opacity .2s}
        .overlay.open{opacity:1;pointer-events:all}
        .sidebar{position:fixed;top:0;left:0;height:100dvh;width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);z-index:50;display:flex;flex-direction:column;transform:translateX(-100%);transition:transform .22s cubic-bezier(.4,0,.2,1);overflow:hidden}
        .sidebar.open{transform:translateX(0)}
        .sb-head{padding:14px 14px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
        .sb-brand{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px;letter-spacing:-.02em;color:var(--text);flex:1}
        .sb-brand-icon{width:26px;height:26px;border-radius:7px;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center}
        .new-chat-btn{width:100%;display:flex;align-items:center;gap:8px;padding:9px 12px;margin:10px 0 4px;border-radius:9px;border:1px solid var(--border);background:transparent;color:var(--text);font-family:var(--font);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .12s}
        .new-chat-btn:hover{background:var(--surface2)}
        .sb-scroll{flex:1;overflow-y:auto;padding:0 8px 16px}
        .sb-scroll::-webkit-scrollbar{width:3px}
        .sb-scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
        .group-label{font-size:10.5px;font-weight:600;color:var(--text-muted);letter-spacing:.06em;text-transform:uppercase;padding:12px 6px 4px}
        .chat-item{display:flex;align-items:center;gap:7px;padding:8px 8px 8px 10px;border-radius:8px;cursor:pointer;transition:background .1s;font-size:12.5px;color:var(--text);border:1px solid transparent;margin-bottom:1px}
        .chat-item:hover{background:var(--surface2)}
        .chat-item.active{background:var(--surface2);border-color:var(--border)}
        .chat-item-icon{color:var(--text-muted);flex-shrink:0}
        .chat-item-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.3}
        .chat-item-del{width:20px;height:20px;border-radius:5px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;display:none;align-items:center;justify-content:center;flex-shrink:0;padding:0;transition:all .1s}
        .chat-item:hover .chat-item-del{display:flex}
        .chat-item-del:hover{background:var(--surface);color:var(--text)}
        .sb-empty{font-size:12px;color:var(--text-muted);text-align:center;padding:32px 16px;line-height:1.7}

        .header{flex-shrink:0;height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 12px 0 10px;border-bottom:1px solid var(--border);background:var(--bg);transition:background .2s,border-color .2s;position:relative;z-index:10}
        .header-left{display:flex;align-items:center;gap:6px}
        .brand{display:flex;align-items:center;gap:7px;font-weight:600;font-size:13px;letter-spacing:-.02em;color:var(--text)}
        .brand-icon{width:28px;height:28px;border-radius:8px;background:var(--accent);color:var(--accent-fg);display:flex;align-items:center;justify-content:center}
        .header-right{display:flex;align-items:center;gap:4px}
        .icon-btn{width:30px;height:30px;border-radius:7px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .1s,color .1s;-webkit-tap-highlight-color:transparent;flex-shrink:0}
        .icon-btn:hover{background:var(--surface2);color:var(--text)}
        .icon-btn.active{color:var(--accent);background:var(--surface2)}
        .new-chat-h-btn{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:7px;border:1px solid var(--border);background:transparent;color:var(--text-muted);font-family:var(--font);font-size:12px;font-weight:500;cursor:pointer;transition:all .1s;-webkit-tap-highlight-color:transparent}
        .new-chat-h-btn:hover{background:var(--surface2);color:var(--text)}

        .pinned-bar{background:var(--surface);border-bottom:1px solid var(--border);padding:8px 16px;flex-shrink:0}
        .pinned-bar-head{font-size:11px;font-weight:600;color:var(--pin);display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;gap:5px;letter-spacing:.04em;text-transform:uppercase}
        .pinned-item{font-size:12px;color:var(--text-muted);padding:5px 8px;background:var(--surface2);border-radius:6px;border-left:2px solid var(--pin);margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .pinned-who{color:var(--text);font-weight:500}

        .empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;gap:12px;overflow-y:auto}
        .empty-icon{width:52px;height:52px;border-radius:14px;background:var(--surface2);display:flex;align-items:center;justify-content:center;color:var(--text-muted)}
        .empty-title{font-size:20px;font-weight:600;color:var(--text);letter-spacing:-.03em}
        .empty-sub{font-size:13px;color:var(--text-muted);text-align:center;max-width:320px;line-height:1.6}
        .chips{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;max-width:460px;margin-top:4px}
        .chip{display:flex;align-items:center;gap:6px;padding:7px 13px;border-radius:20px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:var(--font);font-size:12.5px;cursor:pointer;transition:all .12s;-webkit-tap-highlight-color:transparent}
        .chip:hover{background:var(--surface2);border-color:var(--text-muted)}

        .chat-area{flex:1;overflow-y:auto;overscroll-behavior:contain}
        .chat-area::-webkit-scrollbar{width:4px}
        .chat-area::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
        .chat-inner{max-width:700px;margin:0 auto;padding:20px 16px 8px;display:flex;flex-direction:column;gap:2px}

        .msg-row{display:flex;gap:10px;padding:6px 0;align-items:flex-start}
        .msg-row.user{flex-direction:row-reverse}
        .msg-row.pinned .bubble{border:1px solid var(--pin)!important}
        .avatar{width:26px;height:26px;border-radius:7px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--text-muted);flex-shrink:0;margin-top:2px}
        .msg-row.user .avatar{background:var(--user-bg);color:var(--user-fg)}
        .bubble-wrap{display:flex;flex-direction:column;gap:3px;max-width:min(72%,520px)}
        .msg-row.user .bubble-wrap{align-items:flex-end}
        .pin-badge{font-size:10px;color:var(--pin);font-weight:600;padding:0 2px}
        .bubble{padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.6;word-break:break-word}
        .msg-row.zoro .bubble{background:var(--zoro-bg);color:var(--zoro-fg);border-bottom-left-radius:4px}
        .msg-row.user .bubble{background:var(--user-bg);color:var(--user-fg);border-bottom-right-radius:4px}
        .msg-image{display:block;max-width:100%;max-height:260px;border-radius:8px;margin-bottom:6px;object-fit:contain}
        .md-h1{font-size:16px;font-weight:700;margin:8px 0 4px}
        .md-h2{font-size:15px;font-weight:600;margin:8px 0 4px}
        .md-h3{font-size:14px;font-weight:600;margin:6px 0 3px}
        .md-p{margin:6px 0}
        .md-ul{padding-left:16px;margin:4px 0}
        .md-li{margin:2px 0}
        .code-block{background:rgba(0,0,0,.12);border-radius:8px;padding:10px 12px;font-family:var(--mono);font-size:12px;overflow-x:auto;margin:6px 0}
        .dark .code-block{background:rgba(255,255,255,.06)}
        .inline-code{font-family:var(--mono);font-size:12px;background:rgba(0,0,0,.08);border-radius:4px;padding:1px 5px}
        .dark .inline-code{background:rgba(255,255,255,.08)}
        .bubble-meta{display:flex;align-items:center;gap:4px;opacity:0;transition:opacity .15s}
        .msg-row:hover .bubble-meta{opacity:1}
        .timestamp{font-size:10.5px;color:var(--text-muted)}
        .meta-btn{width:20px;height:20px;border-radius:5px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;transition:background .1s}
        .meta-btn:hover{background:var(--surface2)}
        .meta-btn.speaking{color:var(--accent)}

        /* ✅ Single typing indicator — only dots, no duplicate bubble */
        .typing-bubble{display:flex;gap:4px;align-items:center;padding:2px 0}
        .dot{width:6px;height:6px;border-radius:50%;background:var(--text-muted);animation:blink 1.2s infinite ease-in-out}
        .dot:nth-child(2){animation-delay:.2s}
        .dot:nth-child(3){animation-delay:.4s}
        @keyframes blink{0%,80%,100%{opacity:.25;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}

        .input-area{flex-shrink:0;padding:10px 16px 14px;background:var(--bg);border-top:1px solid var(--border);transition:background .2s,border-color .2s}
        .img-preview-wrap{max-width:680px;margin:0 auto 8px;display:flex;align-items:flex-start}
        .img-preview{position:relative;display:inline-block}
        .img-preview img{height:72px;max-width:120px;border-radius:8px;object-fit:cover;border:1px solid var(--border)}
        .img-remove{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:var(--text);color:var(--bg);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
        .input-box{max-width:680px;margin:0 auto;display:flex;align-items:flex-end;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:8px 8px 8px 10px;box-shadow:var(--shadow);transition:border-color .15s,box-shadow .15s}
        .input-box:focus-within{border-color:var(--text-muted);box-shadow:var(--shadow-md)}
        .chat-textarea{flex:1;border:none;outline:none;background:transparent;font-family:var(--font);font-size:13.5px;color:var(--text);line-height:1.55;resize:none;min-height:22px;max-height:160px;overflow-y:auto;padding:1px 0}
        .chat-textarea::placeholder{color:var(--text-muted)}
        .chat-textarea::-webkit-scrollbar{width:0}
        .attach-btn,.mic-btn{width:32px;height:32px;border-radius:9px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;align-self:flex-end;-webkit-tap-highlight-color:transparent}
        .attach-btn:hover,.mic-btn:hover{background:var(--surface2);color:var(--text)}
        .mic-btn.listening{color:#ef4444;background:rgba(239,68,68,.1);animation:mic-pulse 1s ease-in-out infinite}
        @keyframes mic-pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.3)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
        .send-btn{width:32px;height:32px;border-radius:9px;border:none;background:var(--accent);color:var(--accent-fg);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s,transform .1s;align-self:flex-end;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none}
        .send-btn:hover:not(:disabled){opacity:.82;transform:scale(1.03)}
        .send-btn:active:not(:disabled){transform:scale(.95)}
        .send-btn:disabled{opacity:.25;cursor:not-allowed}
        .hint{text-align:center;font-size:11px;color:var(--text-muted);margin-top:6px;max-width:680px;margin-left:auto;margin-right:auto}

        .panel{position:fixed;bottom:80px;right:16px;width:290px;background:var(--surface);border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow-md);z-index:100;display:flex;flex-direction:column;overflow:hidden}
        .memory-panel{width:290px}
        .settings-panel{width:300px}
        .panel-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--border)}
        .panel-title{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--text)}
        .panel-hint{font-size:11.5px;color:var(--text-muted);padding:8px 14px 4px;line-height:1.5}
        .memory-list{max-height:160px;overflow-y:auto;padding:6px 10px;display:flex;flex-direction:column;gap:4px}
        .empty-note{font-size:12px;color:var(--text-muted);text-align:center;padding:12px 0}
        .memory-item{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--surface2);border-radius:7px;font-size:12px;color:var(--text)}
        .memory-text{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .del-btn{width:16px;height:16px;border:none;background:transparent;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0;border-radius:4px}
        .del-btn:hover{background:var(--border)}
        .panel-input-row{display:flex;gap:6px;padding:10px 10px 12px;border-top:1px solid var(--border)}
        .panel-input{flex:1;border:1px solid var(--border);border-radius:8px;background:var(--surface2);color:var(--text);font-family:var(--font);font-size:12px;padding:6px 10px;outline:none}
        .panel-input:focus{border-color:var(--text-muted)}
        .panel-add-btn{padding:6px 12px;border-radius:8px;border:none;background:var(--accent);color:var(--accent-fg);font-family:var(--font);font-size:12px;font-weight:500;cursor:pointer;transition:opacity .1s}
        .panel-add-btn:hover{opacity:.85}

        .settings-list{padding:4px 0 8px}
        .setting-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 14px;cursor:pointer;border-bottom:1px solid var(--border)}
        .setting-row:last-child{border-bottom:none}
        .setting-info{display:flex;flex-direction:column;gap:2px;flex:1}
        .setting-label{font-size:13px;font-weight:500;color:var(--text)}
        .setting-desc{font-size:11px;color:var(--text-muted);line-height:1.4}
        .toggle{width:38px;height:22px;border-radius:11px;background:var(--border);position:relative;cursor:pointer;transition:background .2s;flex-shrink:0}
        .toggle.on{background:var(--accent)}
        .toggle-thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--bg);transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
        .dark .toggle-thumb{background:var(--surface)}
        .toggle.on .toggle-thumb{transform:translateX(16px)}
        .dark .toggle.on .toggle-thumb{background:var(--accent-fg)}

        @media(max-width:480px){
          .chat-inner{padding:12px 10px 4px}
          .bubble{font-size:14px}
          .empty-title{font-size:17px}
          .hint{display:none}
          .panel{right:8px;left:8px;width:auto;bottom:72px}
        }
      `}</style>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />

      <div className={`overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <div ref={sidebarRef} className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sb-head">
          <div className="sb-brand">
            <div className="sb-brand-icon"><SwordIcon size={13} /></div>
            ZORO AI
          </div>
        </div>
        <div style={{ padding: "0 8px" }}>
          <button className="new-chat-btn" onClick={startNewChat}><PlusIcon size={13} /> New chat</button>
        </div>
        <div className="sb-scroll">
          {chats.length === 0
            ? <div className="sb-empty">no conversations yet.<br />start chatting!</div>
            : grouped.map(({ label, items }) => (
              <div key={label}>
                <div className="group-label">{label}</div>
                {items.map((chat) => (
                  <div key={chat.id} className={`chat-item${chat.id === activeChatId ? " active" : ""}`} onClick={() => loadChat(chat)}>
                    <span className="chat-item-icon"><ChatIcon size={12} /></span>
                    <span className="chat-item-title">{chat.title}</span>
                    <button className="chat-item-del" onClick={(e) => deleteChat(e, chat.id)}><TrashIcon size={11} /></button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      <header className="header">
        <div className="header-left">
          <button className="icon-btn" onClick={() => setSidebarOpen((s) => !s)}><MenuIcon size={15} /></button>
          <div className="brand">
            <div className="brand-icon"><SwordIcon size={15} /></div>
            ZORO AI
          </div>
        </div>
        <div className="header-right">
          {pinnedCount > 0 && (
            <button
              className={`icon-btn${showPinned ? " active" : ""}`}
              onClick={() => { setShowPinned((s) => !s); setShowMemory(false); setShowSettings(false); }}
              title="Pinned"
              style={{ color: showPinned ? "var(--pin)" : undefined }}
            >
              <PinIcon size={13} filled={showPinned} />
            </button>
          )}
          <button
            className={`icon-btn${showMemory ? " active" : ""}`}
            onClick={() => { setShowMemory((s) => !s); setShowPinned(false); setShowSettings(false); }}
            title="Memory"
          >
            <BrainIcon size={14} />
          </button>
          <button
            className={`icon-btn${showSettings ? " active" : ""}`}
            onClick={() => { setShowSettings((s) => !s); setShowMemory(false); setShowPinned(false); }}
            title="Settings"
          >
            <SettingsIcon size={14} />
          </button>
          <button className="new-chat-h-btn" onClick={startNewChat}><PlusIcon size={12} /> New chat</button>
        </div>
      </header>

      {showPinned && pinnedCount > 0 && (
        <PinnedBar messages={messages} onClose={() => setShowPinned(false)} />
      )}

      {isEmpty ? (
        <div className="empty">
          <div className="empty-icon"><SwordIcon size={22} /></div>
          <p className="empty-title">What can I help with?</p>
          <p className="empty-sub">Ask me anything — I'm just a chat away.</p>
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s.label} className="chip" onClick={() => sendMessage(s.label)}>
                <span>{s.icon}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-area">
          <div className="chat-inner">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id} msg={msg}
                onPin={togglePin}
                onSpeak={handleSpeak}
                isSpeaking={speakingId === msg.id}
                ttsEnabled={settings.ttsEnabled}
              />
            ))}

            {/* ✅ FIXED: Only show typing dots if there's NO streaming bubble yet */}
            {isStreaming && (
              <div className="msg-row zoro">
                <div className="avatar"><SwordIcon size={12} /></div>
                <div className="bubble-wrap">
                  <div className="bubble">
                    <div className="typing-bubble">
                      <div className="dot" /><div className="dot" /><div className="dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {showMemory && (
        <MemoryPanel
          memory={memory}
          onAdd={(s) => setMemory((p) => [...p, s])}
          onDelete={(i) => setMemory((p) => p.filter((_, j) => j !== i))}
          onClose={() => setShowMemory(false)}
        />
      )}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="input-area">
        {pendingImage && (
          <div className="img-preview-wrap">
            <div className="img-preview">
              <img src={pendingImage} alt="preview" />
              <button className="img-remove" onPointerDown={(e) => { e.preventDefault(); setPendingImage(null); }}>
                <XIcon size={9} />
              </button>
            </div>
          </div>
        )}
        <div className="input-box">
          <button
            className="attach-btn"
            onPointerDown={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
            disabled={loading}
            title="Attach image"
          >
            <ImageIcon size={16} />
          </button>
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isListening ? "Listening…" : "Ask ZORO…"}
            disabled={loading}
            rows={1}
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck
          />
          <button
            className={`mic-btn${isListening ? " listening" : ""}`}
            onPointerDown={(e) => { e.preventDefault(); isListening ? stopListening() : startListening(); }}
            disabled={loading}
            title={isListening ? "Stop" : "Voice input"}
          >
            <MicIcon size={16} active={isListening} />
          </button>
          <button className="send-btn" onPointerDown={handleSendDown} disabled={!canSend} aria-label="Send">
            <SendIcon />
          </button>
        </div>
        <p className="hint">
          {mobile ? "Tap send · mic for voice" : "Enter to send · Shift+Enter for new line · mic for voice"}
        </p>
      </div>
    </div>
  );
}
