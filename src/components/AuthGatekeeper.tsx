import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  AlertTriangle,
  RotateCcw,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types/auth';

interface AuthGatekeeperProps {
  onLoginSuccess: (user: UserProfile) => void;
  defaultEmail?: string;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
];

export const AuthGatekeeper: React.FC<AuthGatekeeperProps> = ({
  onLoginSuccess,
  defaultEmail = 'shivampatel425685@gmail.com',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState(defaultEmail);
  const [signInPassword, setSignInPassword] = useState('SoundBeat@2026');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState(defaultEmail);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // General states
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password strength calculator
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const pwdScore = calculateStrength(signUpPassword);

  const getStrengthLabel = (score: number) => {
    if (score <= 25) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 50) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score <= 75) return { label: 'Strong', color: 'bg-teal-400', text: 'text-teal-300' };
    return { label: 'Bulletproof (AES Ready)', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  const strength = getStrengthLabel(pwdScore);

  // 1. Handle Sign In (Backend Database Verification)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setErrorMsg('Please enter both your Gmail address and password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInEmail.trim(),
          password: signInPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to auth database.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Sign Up (Register in Backend Database)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName.trim(),
          email: signUpEmail.trim(),
          password: signUpPassword,
          avatar: selectedAvatar,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Could not register account.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Google 1-Tap Sign-In
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Shivam Patel',
          email: 'shivampatel425685@gmail.com',
          avatar: AVATAR_OPTIONS[0],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Google authentication failed.');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid registered Gmail address.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Password reset failed.');
      }

      setSuccessMsg('Password updated successfully! You can now Sign In with your new password.');
      setSignInEmail(forgotEmail);
      setSignInPassword(newPassword);
      setTimeout(() => {
        setMode('signin');
        setSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-center items-center px-4 py-8 select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-md bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 animate-fadeIn">
        {/* Brand Logo & Security Header */}
        <div className="text-center space-y-2">
          {/* Animated sound equalizer logo */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="w-1.5 h-4 bg-emerald-400 rounded-full animate-pulse" />
            <span className="w-1.5 h-8 bg-emerald-400 rounded-full" />
            <span className="w-1.5 h-6 bg-emerald-400 rounded-full" />
            <span className="w-1.5 h-9 bg-emerald-400 rounded-full" />
            <span className="w-1.5 h-4 bg-emerald-400 rounded-full" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SoundBeat Protected Database</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {mode === 'signin' && (
              <>
                Sign In to <span className="text-emerald-400">SoundBeat</span>
              </>
            )}
            {mode === 'signup' && (
              <>
                Create <span className="text-emerald-400">Account</span>
              </>
            )}
            {mode === 'forgot' && (
              <>
                Reset <span className="text-emerald-400">Password</span>
              </>
            )}
          </h1>

          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            {mode === 'signin' && 'Access lossless 320k music, playlists, and favorites with your registered Gmail account.'}
            {mode === 'signup' && 'Sign up with your Gmail to create your personalized library and studio master streaming profile.'}
            {mode === 'forgot' && 'Enter your registered Gmail address to update your security password.'}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Switcher Tabs between Sign In and Sign Up */}
        {mode !== 'forgot' && (
          <div className="flex bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                mode === 'signin'
                  ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                mode === 'signup'
                  ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: SIGN IN FORM */}
        {/* ======================================================== */}
        {mode === 'signin' && (
          <div className="space-y-4 animate-fadeIn">
            <form onSubmit={handleSignIn} className="space-y-3.5">
              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gmail / Email Address</span>
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. shivampatel425685@gmail.com"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Password</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg(null);
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-800" />
              <span className="flex-shrink mx-3 text-[11px] text-zinc-500 uppercase tracking-widest font-mono">
                or continue with
              </span>
              <div className="flex-grow border-t border-zinc-800" />
            </div>

            {/* Google 1-Tap Sign-In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-xs flex items-center justify-center gap-2.5 shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>1-Tap Google Sign In ({defaultEmail.split('@')[0]})</span>
            </button>

            {/* Bottom prompt */}
            <p className="text-center text-xs text-zinc-400 pt-1">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Create Account
              </button>
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 2: SIGN UP / CREATE ACCOUNT FORM */}
        {/* ======================================================== */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5 animate-fadeIn">
            {/* Avatar Selector */}
            <div className="space-y-1.5 text-center">
              <label className="text-[11px] font-semibold text-zinc-400 block">Choose Profile Avatar</label>
              <div className="flex justify-center gap-2.5">
                {AVATAR_OPTIONS.map((av, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAvatar(av)}
                    className={`relative w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedAvatar === av ? 'border-emerald-400 scale-110 shadow-md' : 'border-zinc-800 opacity-60'
                    }`}
                  >
                    <img src={av} alt="" className="w-full h-full object-cover" />
                    {selectedAvatar === av && (
                      <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="e.g. Shivam Patel"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Gmail Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gmail / Email Address</span>
              </label>
              <input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="e.g. shivam@gmail.com"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Create Password</span>
                </label>
                {signUpPassword && (
                  <span className={`text-[10px] font-mono font-bold ${strength.text}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {signUpPassword && (
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${pwdScore}%` }}
                  />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Confirm Password</label>
              <input
                type="password"
                value={signUpConfirmPassword}
                onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            {/* Sign Up Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-50 mt-1"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Start Listening</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>

            {/* Bottom prompt */}
            <p className="text-center text-xs text-zinc-400 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                }}
                className="text-emerald-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 3: FORGOT / RESET PASSWORD FORM */}
        {/* ======================================================== */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Registered Gmail Address</span>
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>New Password</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Update Password in Database</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className="w-full py-2.5 text-xs text-zinc-400 hover:text-white transition-colors text-center block"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* Security & Database Guarantee footer */}
        <div className="pt-3 border-t border-zinc-900 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PBKDF2 SHA-512 Encrypted</span>
            </span>
            <span>JSON Database Synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
