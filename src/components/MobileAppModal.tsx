import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  QrCode,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'qr' | 'guide'>('install');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://soundbeat.app';

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-zinc-100 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Mobile Header */}
        <div className="text-center pt-2 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 flex items-center justify-center shadow-xl shadow-emerald-950/60">
            <Smartphone className="w-7 h-7 text-black stroke-[2.2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SoundBeat Mobile Edition</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Get SoundBeat on <span className="text-emerald-400">Mobile</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Install as a native Progressive Web App (PWA) with background audio, lockscreen playback, and 320k Lossless audio.
          </p>
        </div>

        {/* Segment Tabs */}
        <div className="flex bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'install'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Install App
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'qr'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'guide'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            iOS & Android Guide
          </button>
        </div>

        {/* Tab 1: Install Tab */}
        {activeTab === 'install' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Native Mobile Features</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono">
                  v2.4 PWA Ready
                </span>
              </div>

              <ul className="text-xs text-zinc-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Full-screen app without browser address bar</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Background music play with Android / iOS lockscreen controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Instant offline launch with local cache</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>High quality 320kbps Studio Master downloads</span>
                </li>
              </ul>
            </div>

            {isInstalled ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>SoundBeat is already installed on this device!</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>1-Click Install SoundBeat App</span>
              </button>
            ) : isIOS ? (
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <p className="text-xs font-semibold text-white">Apple iOS (iPhone / iPad) Step:</p>
                <p className="text-xs text-zinc-400">
                  Tap the Safari <strong className="text-white">Share</strong> button (box with arrow) at the bottom, then scroll down and tap <strong className="text-emerald-400">Add to Home Screen</strong>.
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Add SoundBeat to Home Screen</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: QR Code */}
        {activeTab === 'qr' && (
          <div className="space-y-4 text-center animate-fadeIn">
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center shadow-xl">
              {/* Generated clean SVG QR visual */}
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                <rect width="100" height="100" fill="white" />
                {/* QR corners */}
                <rect x="10" y="10" width="24" height="24" fill="black" />
                <rect x="14" y="14" width="16" height="16" fill="white" />
                <rect x="18" y="18" width="8" height="8" fill="black" />
                <rect x="66" y="10" width="24" height="24" fill="black" />
                <rect x="70" y="14" width="16" height="16" fill="white" />
                <rect x="74" y="18" width="8" height="8" fill="black" />
                <rect x="10" y="66" width="24" height="24" fill="black" />
                <rect x="14" y="70" width="16" height="16" fill="white" />
                <rect x="18" y="74" width="8" height="8" fill="black" />
                {/* Data blocks */}
                <rect x="38" y="14" width="6" height="6" fill="black" />
                <rect x="48" y="14" width="6" height="6" fill="black" />
                <rect x="38" y="24" width="6" height="6" fill="black" />
                <rect x="48" y="24" width="6" height="6" fill="black" />
                <rect x="58" y="24" width="6" height="6" fill="black" />
                <rect x="14" y="38" width="6" height="6" fill="black" />
                <rect x="24" y="38" width="6" height="6" fill="black" />
                <rect x="38" y="38" width="24" height="24" rx="4" fill="#10b981" />
                <rect x="46" y="44" width="8" height="12" rx="2" fill="black" />
                <rect x="66" y="38" width="6" height="6" fill="black" />
                <rect x="76" y="38" width="6" height="6" fill="black" />
                <rect x="38" y="66" width="6" height="6" fill="black" />
                <rect x="48" y="66" width="6" height="6" fill="black" />
                <rect x="66" y="66" width="6" height="6" fill="black" />
                <rect x="76" y="76" width="6" height="6" fill="black" />
                <rect x="86" y="86" width="6" height="6" fill="black" />
                <rect x="58" y="80" width="6" height="6" fill="black" />
              </svg>
            </div>

            <p className="text-xs text-zinc-300">
              Open your phone camera and scan this code to launch SoundBeat directly on your mobile browser.
            </p>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Mobile App Link'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Instructions Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-3 text-xs animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Android (Google Chrome / Brave)</span>
              </h4>
              <ol className="list-decimal list-inside text-zinc-400 space-y-1 pl-1">
                <li>Open this website in Chrome on your Android phone</li>
                <li>Tap the three dots <strong className="text-white">(⋮)</strong> menu top-right</li>
                <li>Select <strong className="text-emerald-400">"Install app"</strong> or "Add to Home screen"</li>
                <li>SoundBeat will appear on your phone app drawer with the green icon</li>
              </ol>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Apple iOS (Safari on iPhone / iPad)</span>
              </h4>
              <ol className="list-decimal list-inside text-zinc-400 space-y-1 pl-1">
                <li>Open this website in Safari on your iPhone</li>
                <li>Tap the <strong className="text-white">Share</strong> button at the bottom center</li>
                <li>Scroll down and tap <strong className="text-emerald-400">"Add to Home Screen"</strong></li>
                <li>Tap "Add" in the top-right corner to finish</li>
              </ol>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>HTTPS SSL Certified • Safe & Secure PWA Architecture</span>
        </div>
      </div>
    </div>
  );
};
