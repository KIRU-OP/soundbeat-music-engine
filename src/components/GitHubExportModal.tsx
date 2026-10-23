import React, { useState, useEffect } from 'react';
import {
  X,
  Github,
  Upload,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
  Terminal,
  ShieldAlert,
  Sparkles,
  GitBranch,
  Lock,
  Globe,
  AlertCircle,
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState('soundbeat-music-engine');
  const [isPrivate, setIsPrivate] = useState(false);
  const [commitMessage, setCommitMessage] = useState('feat: SoundBeat Music App with PWA & Strong Auth');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; repoUrl?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'cli' | 'download'>('upload');
  const [gitStatus, setGitStatus] = useState<any>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/github/git-status')
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setGitStatus(d.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setResult({ success: false, message: 'Please provide a GitHub Personal Access Token.' });
      return;
    }
    if (!repoName.trim()) {
      setResult({ success: false, message: 'Please provide a repository name.' });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repoName: repoName.trim(),
          isPrivate,
          commitMessage: commitMessage.trim(),
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setResult({ success: false, message: err.message || 'Push failed' });
    } finally {
      setUploading(false);
    }
  };

  const cliCommands = `# Initialize and push SoundBeat to your GitHub
git add .
git commit -m "${commitMessage}"
git branch -M main
git remote add origin https://github.com/<your-username>/${repoName}.git
git push -u origin main`;

  const copyCli = () => {
    navigator.clipboard?.writeText(cliCommands);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
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

        {/* Brand & GitHub Header */}
        <div className="text-center pt-2 space-y-2">
          <div className="w-13 h-13 mx-auto rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-xl">
            <Github className="w-7 h-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GitHub Repository Exporter</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Upload to <span className="text-emerald-400">GitHub</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            1-Click direct upload, terminal push commands, or download complete project archive to host on GitHub.
          </p>
        </div>

        {/* Nav Tabs */}
        <div className="flex bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            1-Click Push
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'cli'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Terminal / CLI
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'download'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Download ZIP
          </button>
        </div>

        {/* Tab 1: 1-Click Push with GitHub Token */}
        {activeTab === 'upload' && (
          <form onSubmit={handlePush} className="space-y-4 animate-fadeIn">
            {/* Token Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-300">
                  GitHub Personal Access Token (classic or fine-grained)
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Generate Token</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Requires 'repo' scope)"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[10px] text-zinc-500">
                Your token is used only for this single push operation and never saved.
              </p>
            </div>

            {/* Repo Name & Visibility */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Visibility</label>
                <div className="flex gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsPrivate(false)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                      !isPrivate
                        ? 'bg-zinc-800 border-emerald-500/50 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(true)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isPrivate
                        ? 'bg-zinc-800 border-emerald-500/50 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Private</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Commit Message */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Commit Message</label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 text-zinc-300"
              />
            </div>

            {/* Push Status / Result Message */}
            {result && (
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  result.success
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{result.message}</span>
                </div>
                {result.repoUrl && (
                  <div className="pt-1">
                    <a
                      href={result.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs shadow-md hover:bg-emerald-400"
                    >
                      <span>Open on GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Pushing repository to GitHub...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>Push Repository to GitHub</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Terminal / CLI */}
        {activeTab === 'cli' && (
          <div className="space-y-3 text-xs animate-fadeIn">
            <p className="text-zinc-300">
              Run these commands in your local terminal to upload the project to GitHub:
            </p>
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-3 font-mono text-[11px] text-zinc-300">
              <pre className="overflow-x-auto whitespace-pre-wrap">{cliCommands}</pre>
              <button
                onClick={copyCli}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Copy commands"
              >
                {copiedCli ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {gitStatus && (
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1 text-zinc-400">
                <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Branch: {gitStatus.branch}</span>
                </div>
                <div>Last Commit: {gitStatus.lastCommit}</div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Download Complete Archive */}
        {activeTab === 'download' && (
          <div className="space-y-4 text-center animate-fadeIn py-2">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-emerald-400 flex items-center justify-center mx-auto">
              <Download className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">Download Full Project Package</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Download the complete codebase (.tar.gz), extract it anywhere, and publish it to any git provider.
              </p>
            </div>

            <a
              href="/api/github/download-archive"
              download="soundbeat-music-app.tar.gz"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download soundbeat-music-app.tar.gz</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
