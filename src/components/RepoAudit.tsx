import React from 'react';
import {
  GitBranch,
  GitCommit,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Cpu,
  KeyRound,
  FileCode,
  Sparkles,
} from 'lucide-react';

export const RepoAudit: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-28">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" />
                Repository Inspection Report
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono">
                TypeScript / Hono / Express
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              KIRU-OP / jiosaavn-api
            </h1>
            <p className="text-zinc-300 text-sm max-w-2xl leading-relaxed">
              JioSaavn ka unofficial API wrapper jo internal endpoints (<code className="text-emerald-400 font-mono">api.php</code>) se high-quality DRM-free music, album art, aur direct AAC audio stream links fetch karta hai.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <a
              href="https://github.com/KIRU-OP/jiosaavn-api"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
            <div className="text-[11px] text-zinc-400 font-mono text-right">
              Upstream: <span className="text-emerald-400">sumitkolhe/jiosaavn-api</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Audio Bitrates</span>
            <p className="text-base font-bold text-white mt-0.5">12k - 320 kbps</p>
          </div>
          <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Cipher Used</span>
            <p className="text-base font-bold text-emerald-400 mt-0.5">DES-ECB (node-forge)</p>
          </div>
          <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Regional Languages</span>
            <p className="text-base font-bold text-white mt-0.5">12 Indian Langs</p>
          </div>
          <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/50">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">License</span>
            <p className="text-base font-bold text-zinc-300 mt-0.5">MIT Open Source</p>
          </div>
        </div>
      </div>

      {/* Commit History of KIRU-OP Modifications */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              KIRU-OP Commits & Key Innovations (Git Diff Analysis)
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Branch: main</span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          KIRU-OP ne upstream repository (<code className="text-emerald-400">sumitkolhe/jiosaavn-api</code>) ko fork karke multiple critical features aur bug fixes add kiye hain:
        </p>

        <div className="space-y-4">
          {/* Commit 1 */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                  d0d1709
                </span>
                <h3 className="font-semibold text-white text-sm">
                  feat(songs): add /songs/new-releases from JioSaavn launch data
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Launch Data Engine</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              JioSaavn ke <code className="text-zinc-200">webapi.getLaunchData</code> endpoint ko language cookie (<code className="text-emerald-400">Cookie: L=hindi</code>) ke saath query karta hai. Wahan se <code className="text-zinc-200">new_trending</code> aur <code className="text-zinc-200">new_albums</code> ke song PIDs extract karke unhe <code className="text-zinc-200">song.getDetails</code> se complete song objects me convert karta hai.
            </p>
          </div>

          {/* Commit 2 */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
                  b9775da
                </span>
                <h3 className="font-semibold text-white text-sm">
                  feat(home): add all Indian language chips using the new-releases feed
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Regional Diversity</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Home player me 12 Indian regional languages (Hindi, Punjabi, Bhojpuri, English, Tamil, Telugu, Marathi, Gujarati, Bengali, Kannada, Malayalam, Rajasthani) ke dynamic chips add kiye gaye hain. Har language chip select karne par real-time new releases load hote hain.
            </p>
          </div>

          {/* Commit 3 */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                  fbdcf11
                </span>
                <h3 className="font-semibold text-white text-sm">
                  fix(home): fall back to lower audio quality when 320kbps is unavailable
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Quality Ladder</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              JioSaavn par sabhi purane ya regional gaano me 320kbps stream available nahi hoti. KIRU-OP ne ek automatic quality ladder mechanism implement kiya: <strong className="text-white">320kbps &rarr; 160kbps &rarr; 96kbps &rarr; 48kbps &rarr; 12kbps</strong>. Agar high bitrate fail hoti hai toh player bina ruke agli quality par shift ho jata hai.
            </p>
          </div>

          {/* Commit 4 */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-mono text-xs font-bold border border-purple-500/30">
                  ffaeef8 & 18474e3
                </span>
                <h3 className="font-semibold text-white text-sm">
                  fix(search): handle spelling variants and rank songs by relevance and popularity
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Hindi Stem Matching</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hindi aur Urdu gaano me Romanised spellings me bohot variations hote hain (jaise: <em>galiyan / galliyan / galiyon</em>). KIRU-OP ne <code className="text-emerald-400">SPELLING_RULES</code> regex engine, word stem matching (<code className="text-zinc-200">stem(w)</code>), aur YouTube-style relevance + play count ranking add kiya.
            </p>
          </div>

          {/* Commit 5 */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-xs font-bold">
                  279468e
                </span>
                <h3 className="font-semibold text-white text-sm">
                  revert: remove YouTube video playback
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">Clean Architecture</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Author ne temporarily YouTube video integration test kiya tha, jise baad me cleanly revert kar diya taaki API pure audio & fast JioSaavn streaming par hi focused rahe.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive: How the Decryption Works */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DES Cipher Explanation */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <KeyRound className="w-4 h-4" />
            <span>DES-ECB Decryption Architecture</span>
          </div>
          <h3 className="text-base font-bold text-white">How Encrypted Media URLs are Decoded</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            JioSaavn CDN stream URLs ko protect karne ke liye <strong className="text-zinc-200">DES (Data Encryption Standard) in ECB mode</strong> use karta hai. Base64 encoded string ko JioSaavn secret key ke saath decrypt kiya jata hai:
          </p>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 font-mono text-[11px] text-zinc-300 space-y-1">
            <p><span className="text-zinc-500">// Secret Key & IV</span></p>
            <p><span className="text-purple-400">const</span> key = <span className="text-emerald-400">'38346591'</span>;</p>
            <p><span className="text-purple-400">const</span> iv = <span className="text-emerald-400">'00000000'</span>;</p>
            <p><span className="text-zinc-500">// node-forge Decipher</span></p>
            <p><span className="text-cyan-400">decipher</span>.createDecipher(<span className="text-emerald-400">'DES-ECB'</span>, keyBuffer);</p>
            <p><span className="text-zinc-500">// Output CDN preview</span></p>
            <p><span className="text-amber-400">https://aac.saavncdn.com/..._96.mp4</span></p>
          </div>
          <p className="text-[11px] text-zinc-500">
            Note: Node.js 18+ me native crypto legacy DES ko block karta hai (OpenSSL 3 error). Isliye <code className="text-emerald-400">node-forge</code> use kiya gaya hai jo pure JavaScript me bina kisi legacy flag ke smoothly execute hota hai.
          </p>
        </div>

        {/* Quality Ladder */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Zap className="w-4 h-4" />
            <span>Bitrate Replacement & CDN Delivery</span>
          </div>
          <h3 className="text-base font-bold text-white">Dynamic Bitrate Switching</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Decrypted URL hamesha <code className="text-emerald-400">_96.mp4</code> suffix ke saath decode hota hai. KIRU-OP ka code is URL ko 5 bitrates me replace karta hai:
          </p>
          <div className="space-y-1.5 pt-1">
            {[
              { bitrate: '320 kbps', code: '_320.mp4', desc: 'Ultra High Fidelity AAC' },
              { bitrate: '160 kbps', code: '_160.mp4', desc: 'High Quality AAC' },
              { bitrate: '96 kbps', code: '_96.mp4', desc: 'Standard Mobile Quality' },
              { bitrate: '48 kbps', code: '_48.mp4', desc: 'Low Data Saver' },
              { bitrate: '12 kbps', code: '_12.mp4', desc: 'Ultra Low Bandwidth' },
            ].map((q) => (
              <div
                key={q.bitrate}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">{q.bitrate}</span>
                  <span className="text-zinc-500 text-[11px] font-mono">{q.code}</span>
                </div>
                <span className="text-[11px] text-zinc-400">{q.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluation: Pros, Cons & Verdict */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Technical Audit & Engineering Evaluation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Pros */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Strengths & Advantages
            </span>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              <li>Direct AAC audio streaming without intermediate server transcoding.</li>
              <li>Smart Hindi/Urdu spelling variant handling prevents missing songs.</li>
              <li>Instant zero-delay response times (typically 80ms - 250ms).</li>
              <li>Decoupled OpenAPI/Zod schema validation makes it easy to integrate into apps.</li>
              <li>Automatic audio quality fallback prevents playback silence or errors.</li>
            </ul>
          </div>

          {/* Considerations */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Production Recommendations
            </span>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
              <li>Add a caching layer (in-memory or Redis) for search and launch data to avoid IP blocks.</li>
              <li>Proxy audio stream requests with Range headers (as built in our server) for seekability.</li>
              <li>Include rate limiting on public endpoints to prevent abuse.</li>
              <li>Be aware that JioSaavn official terms reserve their API for authorized clients.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
