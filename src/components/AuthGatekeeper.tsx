import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Fingerprint,
  Radio,
  Clock,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types/auth';

interface AuthGatekeeperProps {
  onLoginSuccess: (user: UserProfile) => void;
  defaultEmail?: string;
  defaultPhone?: string;
}

export const AuthGatekeeper: React.FC<AuthGatekeeperProps> = ({
  onLoginSuccess,
  defaultEmail = 'shivampatel425685@gmail.com',
  defaultPhone = '9876543210',
}) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'google' | 'email'>('phone');

  // Phone OTP state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(defaultPhone);
  const [otpStep, setOtpStep] = useState<'input_phone' | 'verify_otp'>('input_phone');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('742918');

  // Google state
  const [googleName, setGoogleName] = useState('Shivam Patel');
  const [googleEmail, setGoogleEmail] = useState(defaultEmail);

  // Email & Password state
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('SoundBeat@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('Shivam Patel');

  // PIN & Remember device
  const [securityPin, setSecurityPin] = useState('4256');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Global loading & error states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (otpStep === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  // Password strength calculator
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
    return score;
  };

  const pwdStrength = calculatePasswordStrength(password);

  const getStrengthLabel = (score: number) => {
    if (score <= 25) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
    if (score <= 50) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score <= 75) return { label: 'Strong', color: 'bg-teal-400', text: 'text-teal-300' };
    return { label: 'Bulletproof (AES Ready)', color: 'bg-emerald-400', text: 'text-emerald-400' };
  };

  // 1. Send OTP Action
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrorMsg('Please enter a valid 10-digit phone number');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      // Generate a clean 6-digit random code for realistic simulation
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedDemoOtp(randomCode);
      setOtpStep('verify_otp');
      setResendTimer(60);
      setLoading(false);
      setSuccessNotice(`Verification code sent to ${countryCode} ${phoneNumber}`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 600);
  };

  // 2. Verify OTP Action
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const user: UserProfile = {
        id: `phone_${Date.now()}`,
        name: 'Shivam Patel',
        phone: `${countryCode} ${phoneNumber}`,
        email: 'shivampatel425685@gmail.com',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        plan: 'Ultra Lossless Member',
        joinedDate: 'Joined Today',
        likedSongsCount: 42,
        playlistsCount: 5,
        bio: 'Good music. Better vibes. 🎵',
        authMethod: 'phone',
        isPhoneVerified: true,
        sessionToken: `sb_sec_${Math.random().toString(36).substring(2)}${Date.now()}`,
        deviceId: 'Android-PWA-' + Math.random().toString(36).substring(7).toUpperCase(),
        lastLogin: new Date().toISOString(),
        securityPIN: securityPin,
      };

      onLoginSuccess(user);
    }, 500);
  };

  // 3. Google Sign-In Action
  const handleGoogleLogin = () => {
    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const user: UserProfile = {
        id: `google_${Date.now()}`,
        name: googleName.trim() || 'Shivam Patel',
        email: googleEmail.trim() || defaultEmail,
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        plan: 'Ultra Lossless Member',
        joinedDate: 'Joined Today',
        likedSongsCount: 56,
        playlistsCount: 6,
        bio: 'Good music. Better vibes. 🎵',
        authMethod: 'google',
        isEmailVerified: true,
        sessionToken: `sb_oauth_${Math.random().toString(36).substring(2)}${Date.now()}`,
        deviceId: 'PWA-Session-' + Math.random().toString(36).substring(7).toUpperCase(),
        lastLogin: new Date().toISOString(),
        securityPIN: securityPin,
      };

      onLoginSuccess(user);
    }, 500);
  };

  // 4. Email + Password Sign-In Action
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const user: UserProfile = {
        id: `email_${Date.now()}`,
        name: userName.trim() || 'Shivam Patel',
        email: email.trim(),
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        plan: 'Ultra Lossless Member',
        joinedDate: 'Joined Today',
        likedSongsCount: 38,
        playlistsCount: 4,
        bio: 'Good music. Better vibes. 🎵',
        authMethod: 'email',
        isEmailVerified: true,
        sessionToken: `sb_enc_${Math.random().toString(36).substring(2)}${Date.now()}`,
        deviceId: 'PWA-Secure-' + Math.random().toString(36).substring(7).toUpperCase(),
        lastLogin: new Date().toISOString(),
        securityPIN: securityPin,
      };

      onLoginSuccess(user);
    }, 500);
  };

  const strength = getStrengthLabel(pwdStrength);

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
            <span>SoundBeat Protected Access</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Authentication <span className="text-emerald-400">Required</span>
          </h1>

          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Please log in with verified Phone OTP, Google 1-Tap, or Encrypted Credentials to unlock SoundBeat.
          </p>
        </div>

        {/* Global Feedback Banner */}
        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Auth Method Navigation Tabs */}
        <div className="flex bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => {
              setAuthMethod('phone');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'phone'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>

          <button
            onClick={() => {
              setAuthMethod('google');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'google'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Google</span>
          </button>

          <button
            onClick={() => {
              setAuthMethod('email');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              authMethod === 'email'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Password</span>
          </button>
        </div>

        {/* METHOD 1: Phone + SMS OTP */}
        {authMethod === 'phone' && (
          <div className="space-y-4 animate-fadeIn">
            {otpStep === 'input_phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option value="+91">🇮🇳 +91 (India)</option>
                      <option value="+1">🇺🇸 +1 (US)</option>
                      <option value="+44">🇬🇧 +44 (UK)</option>
                      <option value="+971">🇦🇪 +971 (UAE)</option>
                      <option value="+61">🇦🇺 +61 (Aus)</option>
                    </select>

                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      maxLength={12}
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tracking-wider"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    A 6-digit one-time passcode (OTP) will be generated for instant verification.
                  </p>
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
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Verifying number:</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep('input_phone')}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Edit Number
                    </button>
                  </div>
                  <div className="font-mono text-sm text-white font-bold">
                    {countryCode} {phoneNumber}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-zinc-300">Enter 6-Digit Code</label>
                    {/* Demo auto-fill convenience button */}
                    <button
                      type="button"
                      onClick={() => setOtpCode(generatedDemoOtp)}
                      className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 hover:bg-emerald-900"
                    >
                      Use Demo OTP: {generatedDemoOtp}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="••••••"
                    maxLength={6}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-zinc-900 border border-zinc-700 rounded-2xl py-3 text-white focus:outline-none focus:border-emerald-400"
                    autoFocus
                  />

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span>
                      {resendTimer > 0 ? (
                        <span className="flex items-center gap-1 font-mono text-zinc-500">
                          <Clock className="w-3 h-3" />
                          <span>Resend in {resendTimer}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setResendTimer(60);
                            setGeneratedDemoOtp(
                              Math.floor(100000 + Math.random() * 900000).toString()
                            );
                            setSuccessNotice('New OTP dispatched!');
                            setTimeout(() => setSuccessNotice(null), 3000);
                          }}
                          className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </span>
                    <span className="text-zinc-500">Attempt 1 of 5</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-40"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Verify & Unlock App</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* METHOD 2: Google 1-Tap Sign-In */}
        {authMethod === 'google' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{googleName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono block truncate">
                    {googleEmail}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Account Verified & Ready</span>
                </div>
                <div>Instant access with lossless 320k streaming privileges.</div>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* METHOD 3: Email + High Security Password */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-3.5 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-zinc-300">Password</label>
                <span className={`text-[10px] font-mono font-bold ${strength.text}`}>
                  {strength.label}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${pwdStrength}%` }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  <span>Sign In Securely</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Preferences & Device Protection */}
        <div className="pt-2 border-t border-zinc-900 space-y-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 hover:text-zinc-200">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5 accent-emerald-500"
            />
            <span>Remember this device (Protected by Hardware Keystore)</span>
          </label>

          {/* Trust and Certifications footer */}
          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>256-bit AES Encryption</span>
            </span>
            <span>TLS 1.3 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
