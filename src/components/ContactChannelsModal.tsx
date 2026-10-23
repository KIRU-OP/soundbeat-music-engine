import React, { useState } from 'react';
import {
  X,
  Send,
  Mail,
  MessageCircle,
  Youtube,
  Instagram,
  GitBranch,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Users,
  Radio,
  Share2,
} from 'lucide-react';

interface ContactChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

const CHANNELS = [
  {
    id: 'telegram',
    name: 'Telegram Music Channel',
    handle: '@SoundBeatMusic',
    description: 'Get daily trending songs, 320kbps lossless files, and bot updates.',
    members: '48.2K Subscribers',
    color: 'from-sky-500 to-blue-600',
    icon: MessageCircle,
    link: 'https://t.me/SoundBeatMusic',
    actionText: 'Join Channel',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Official Channel',
    handle: 'SoundBeat Music Feed',
    description: 'Instant song alerts, daily regional mixes, and new launch news.',
    members: '29.5K Followers',
    color: 'from-emerald-500 to-green-600',
    icon: MessageSquare,
    link: 'https://whatsapp.com/channel/soundbeat',
    actionText: 'Follow Channel',
  },
  {
    id: 'youtube',
    name: 'YouTube Music Channel',
    handle: 'SoundBeat Ultra Music',
    description: 'High-res audio visualizers, lyrical tracks, and DJ mixes.',
    members: '115K Subscribers',
    color: 'from-red-500 to-rose-600',
    icon: Youtube,
    link: 'https://youtube.com',
    actionText: 'Subscribe',
  },
  {
    id: 'instagram',
    name: 'Instagram Community',
    handle: '@soundbeat.music',
    description: 'Artist reels, behind-the-scenes music production, and polls.',
    members: '36.8K Followers',
    color: 'from-fuchsia-500 to-pink-600',
    icon: Instagram,
    link: 'https://instagram.com',
    actionText: 'Follow Page',
  },
  {
    id: 'github',
    name: 'GitHub API Repository',
    handle: 'KIRU-OP/jiosaavn-api',
    description: 'Unofficial JioSaavn API source code, open-source issues & docs.',
    members: 'Open Source',
    color: 'from-zinc-700 to-zinc-900',
    icon: GitBranch,
    link: 'https://github.com/KIRU-OP/jiosaavn-api',
    actionText: 'Star on GitHub',
  },
];

export const ContactChannelsModal: React.FC<ContactChannelsModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'shivampatel425685@gmail.com',
}) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'contact'>('channels');

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState(userEmail);
  const [subject, setSubject] = useState('Song Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage('');
        onClose();
      }, 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black shadow-md">
              <Radio className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Channels & Contact
              </h2>
              <p className="text-[11px] text-zinc-400">
                Official SoundBeat communities & 24/7 direct support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3">
          <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'channels'
                  ? 'bg-emerald-500 text-black shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Official Channels</span>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'contact'
                  ? 'bg-emerald-500 text-black shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
          {/* TAB 1: OFFICIAL CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Join our official social & music channels to get new songs, Telegram audio bot updates, and connect with other listeners:
              </p>

              <div className="space-y-2.5">
                {CHANNELS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <div
                      key={ch.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-3 group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center text-white shadow-md shrink-0`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white truncate">
                              {ch.name}
                            </h4>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {ch.members}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                            {ch.description}
                          </p>
                        </div>
                      </div>

                      <a
                        href={ch.link}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-emerald-500 hover:text-black text-zinc-200 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all border border-zinc-700"
                      >
                        <span>{ch.actionText}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT US FORM & EMAIL */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              {/* Direct Email Card */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold block">
                      Direct Support Email
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      {userEmail}
                    </span>
                  </div>
                </div>

                <a
                  href={`mailto:${userEmail}?subject=SoundBeat Support Inquiry`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-colors"
                >
                  Email Us
                </a>
              </div>

              {/* Message Submission Form */}
              {submitted ? (
                <div className="p-6 bg-zinc-900 rounded-2xl border border-emerald-500/40 text-center space-y-2 animate-fadeIn">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-zinc-400">
                    Thank you for reaching out. We will respond to your email at{' '}
                    <strong className="text-white">{email}</strong> within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Shivam"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">Topic</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Song Request">🎵 Song / Album Request</option>
                      <option value="Audio Quality Issue">🔊 Audio Quality / Playback Issue</option>
                      <option value="Bug Report">🐛 Report a Bug</option>
                      <option value="Partnership & Collaboration">🤝 Partnership / Collaboration</option>
                      <option value="General Feedback">💬 General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message, song request, or feedback here..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
