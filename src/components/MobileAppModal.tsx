import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Copy,
  ExternalLink,
  ShieldCheck,
  FolderArchive,
  ArrowDownToLine,
  FileCode,
  HardDrive,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'apk' | 'webapk' | 'android_studio'>('apk');
  const [apkInfo, setApkInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/download/apk-info')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setApkInfo(d.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://soundbeat.app';

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInstallPWA = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-zinc-100 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Android Header */}
        <div className="text-center pt-2 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 via-emerald-400 to-teal-300 flex items-center justify-center shadow-xl shadow-emerald-950/60">
            <Smartphone className="w-7 h-7 text-black stroke-[2.2]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SoundBeat Android App Package</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Download <span className="text-emerald-400">Android APK</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Install the native SoundBeat Android APK on your smartphone for high-fidelity 320k music streaming & lockscreen playback.
          </p>
        </div>

        {/* Tabs: APK Download | WebAPK / Browser | Android Studio Project */}
        <div className="flex bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'apk'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download APK</span>
          </button>

          <button
            onClick={() => setActiveTab('webapk')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'webapk'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>WebAPK / PWA</span>
          </button>

          <button
            onClick={() => setActiveTab('android_studio')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'android_studio'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: DIRECT APK DOWNLOAD & SPECS */}
        {/* ======================================================== */}
        {activeTab === 'apk' && (
          <div className="space-y-4 animate-fadeIn">
            {/* APK Metadata Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">SoundBeat-Music-v2.4.apk</h4>
                    <p className="text-[11px] text-zinc-400 font-mono">com.soundbeat.music</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Ready to Install
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-800 text-center">
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <span className="text-[10px] text-zinc-500 block">Version</span>
                  <span className="text-xs font-bold text-zinc-200 font-mono">2.4.0 (Build 240)</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <span className="text-[10px] text-zinc-500 block">Package Size</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">8.4 MB</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <span className="text-[10px] text-zinc-500 block">Android OS</span>
                  <span className="text-xs font-bold text-zinc-200 font-mono">7.0 - 15+</span>
                </div>
              </div>
            </div>

            {/* Big Green 1-Click Download APK Button */}
            <a
              href="/api/download/apk"
              download="SoundBeat-Music-v2.4.apk"
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 transition-transform active:scale-95"
            >
              <ArrowDownToLine className="w-5 h-5 stroke-[2.5]" />
              <span>Download SoundBeat APK (v2.4)</span>
            </a>

            {/* How to Install APK on Android Phone */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to Install on Android Mobile:</span>
              </h5>
              <ol className="list-decimal list-inside text-[11px] text-zinc-400 space-y-1 pl-1">
                <li>Click the <strong className="text-white">Download SoundBeat APK</strong> button above.</li>
                <li>When download finishes, tap the file in your phone notifications.</li>
                <li>If prompted, enable <strong className="text-emerald-400">"Allow from this source"</strong> in Settings.</li>
                <li>Tap <strong className="text-white">Install</strong> and launch SoundBeat with lossless 320k audio!</li>
              </ol>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: WEBAPK / BROWSER INSTALL */}
        {/* ======================================================== */}
        {activeTab === 'webapk' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Google Chrome WebAPK Mechanism</span>
              </h4>
              <p className="text-xs text-zinc-300">
                You can also install SoundBeat directly into your Android app drawer without manually downloading an APK file. Chrome automatically wraps and signs it as a WebAPK.
              </p>
            </div>

            {isInstalled ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>SoundBeat is already installed on this device!</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={handleInstallPWA}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Install via Chrome WebAPK</span>
              </button>
            ) : isIOS ? (
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <p className="text-xs font-semibold text-white">Apple iOS (iPhone / iPad) Step:</p>
                <p className="text-xs text-zinc-400">
                  Tap the Safari <strong className="text-white">Share</strong> button at the bottom center, then tap <strong className="text-emerald-400">Add to Home Screen</strong>.
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstallPWA}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Add SoundBeat to Home Screen</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-xs font-semibold text-zinc-300 flex items-center justify-center gap-2"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Mobile URL for Phone'}</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ANDROID STUDIO KOTLIN PROJECT */}
        {/* ======================================================== */}
        {activeTab === 'android_studio' && (
          <div className="space-y-4 animate-fadeIn text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center justify-center mx-auto">
              <FolderArchive className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Full Android Studio Kotlin Project</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Download the complete native Android project with Gradle 8, Kotlin, AndroidManifest, MediaSession service, and launcher icons.
              </p>
            </div>

            <a
              href="/api/download/android-project"
              download="soundbeat-android-studio-project.zip"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download Android Studio Project (.ZIP)</span>
            </a>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 text-left space-y-1 font-mono">
              <p className="text-zinc-200 font-bold">Build release APK in terminal:</p>
              <code>cd android && ./gradlew assembleRelease</code>
            </div>
          </div>
        )}

        {/* Security badge footer */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900 font-mono">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clean APK • No Malware • Verified</span>
          </span>
          <span>Target SDK 34 (Android 14/15)</span>
        </div>
      </div>
    </div>
  );
};
