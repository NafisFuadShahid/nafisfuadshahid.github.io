import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Bot } from 'lucide-react';
import OwlCharacter from './OwlCharacter';

interface Message {
  role: 'user' | 'owl';
  text: string;
}

const OWL_SIZE = 100;
const WALK_MARGIN = OWL_SIZE / 2 + 16;
const WALK_SPEED = 0.35;
const PAUSE_MIN = 2200;
const PAUSE_MAX = 5500;
const STEP_AMPLITUDE = 2.8;
const STEP_FREQ = 0.016;

const OWL_REPLIES = [
  "Hoot! I'm Nafis's owl companion. Ask me anything about him!",
  "He's a software engineer who loves federated learning and medical AI.",
  "You can reach him at nafisfuad21@iut-dhaka.edu",
  "He won the Java stack category at Learnathon 3.0 — quite the coder!",
  "He's currently at Brain Station 23 building fintech systems.",
  "His research focuses on privacy-preserving ML for healthcare.",
  "Check out MetaHive — a 2D virtual workspace with proximity voice/video!",
  "Hoot! I track your cursor because I'm always watching... in a friendly way.",
  "He studies CSE at IUT, graduating in 2026.",
  "Want to see his Google Scholar? He has papers on federated learning!",
];

export default function ChatbotIcon() {
  const [posX, setPosX] = useState(window.innerWidth - WALK_MARGIN - 20);
  const [open, setOpen] = useState(false);
  const [flying, setFlying] = useState(false);
  const [flyY, setFlyY] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'owl', text: "Hoot! I'm Nafis's owl. Ask me anything about him!" },
  ]);
  const [input, setInput] = useState('');
  const [wingSpread, setWingSpread] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const walkRef = useRef({
    x: window.innerWidth - WALK_MARGIN - 20,
    dir: -1,
    target: 200,
    pausing: false,
    pauseUntil: 0,
    step: 0,
    bobY: 0,
  });

  const rafRef = useRef<number>(0);
  const openRef = useRef(false);

  useEffect(() => { openRef.current = open; }, [open]);

  const scheduleNextTarget = useCallback(() => {
    const w = walkRef.current;
    const maxX = window.innerWidth - WALK_MARGIN;
    const minX = WALK_MARGIN;
    const newTarget = minX + Math.random() * (maxX - minX);
    w.target = newTarget;
    w.dir = newTarget > w.x ? 1 : -1;
  }, []);

  useEffect(() => {
    const w = walkRef.current;
    scheduleNextTarget();

    const tick = () => {
      if (!openRef.current) {
        const now = Date.now();
        if (w.pausing) {
          if (now > w.pauseUntil) {
            w.pausing = false;
            scheduleNextTarget();
          }
        } else {
          const dist = w.target - w.x;
          if (Math.abs(dist) < 1.5) {
            w.x = w.target;
            w.pausing = true;
            w.pauseUntil = now + PAUSE_MIN + Math.random() * (PAUSE_MAX - PAUSE_MIN);
          } else {
            w.step += STEP_FREQ;
            w.x += WALK_SPEED * Math.sign(dist);
            w.bobY = Math.sin(w.step * 12) * STEP_AMPLITUDE;
          }
        }
        setPosX(w.x);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [scheduleNextTarget]);

  useEffect(() => {
    const onResize = () => {
      const maxX = window.innerWidth - WALK_MARGIN;
      if (walkRef.current.x > maxX) {
        walkRef.current.x = maxX;
        setPosX(maxX);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleOwlClick = () => {
    if (flying) return;
    setFlying(true);
    setWingSpread(1);

    setTimeout(() => {
      setFlyY(-180);
      setTimeout(() => {
        setOpen(true);
        setFlyY(0);
        setFlying(false);
        setWingSpread(0);
      }, 600);
    }, 80);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const reply = OWL_REPLIES[Math.floor(Math.random() * OWL_REPLIES.length)];
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed },
      { role: 'owl', text: reply },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const w = walkRef.current;
  const bobY = w.pausing ? 0 : w.bobY;

  return (
    <>
      <div
        className="fixed z-50"
        style={{
          bottom: 12,
          left: posX - OWL_SIZE / 2,
          width: OWL_SIZE,
          transform: `translateY(calc(${flyY}px + ${bobY}px))`,
          transition: flying ? 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' : 'transform 0.06s linear',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={handleOwlClick}
        title="Chat with Nafis's owl"
      >
        <OwlCharacter size={OWL_SIZE} wingSpread={wingSpread} />

        {!open && (
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-0.5 rounded-full pointer-events-none"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-tertiary)',
              opacity: w.pausing ? 0.85 : 0,
              transition: 'opacity 0.4s ease',
            }}
          >
            Click me!
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed z-[60]"
          style={{
            bottom: 130,
            left: Math.min(Math.max(posX - 160, 12), window.innerWidth - 336),
            width: 320,
            animation: 'chatSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              maxHeight: 420,
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background: 'var(--bg-tertiary)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2">
                <Bot size={16} style={{ color: 'var(--accent-blue)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Owl Assistant
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                aria-label="Close chat"
              >
                <X size={14} />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              style={{ minHeight: 200, maxHeight: 300 }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="text-sm leading-relaxed px-3 py-2 rounded-xl max-w-[82%]"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'var(--accent-blue)',
                            color: '#fff',
                            borderBottomRightRadius: 4,
                          }
                        : {
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            borderBottomLeftRadius: 4,
                          }
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border-color)' }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Nafis..."
                className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                autoFocus
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2 rounded-lg transition-all btn-press flex-shrink-0"
                style={{
                  background: input.trim() ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  color: input.trim() ? '#fff' : 'var(--text-tertiary)',
                  border: '1px solid var(--border-color)',
                }}
                aria-label="Send"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
