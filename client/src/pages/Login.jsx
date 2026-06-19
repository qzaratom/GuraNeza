import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useGoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.png";
import videoGif from "../assets/video.gif";

const translations = {
  en: { signIn: "Sign In", signUp: "Sign Up", email: "Email", password: "Password", confirmPassword: "Confirm", createAccount: "Create Account", or: "or", continueGoogle: "Continue with Google", signingIn: "Signing in...", creatingAccount: "Creating account...", backHome: "← Back to Home", haveAccount: "Have an account?", noAccount: "No account?", fillFields: "Fill all fields", passwordsMatch: "Passwords don't match", passwordLength: "Min 6 characters", authFailed: "Authentication failed", googleFailed: "Google sign in failed", loginSuccess: "Login successful! Redirecting...", registerSuccess: "Account created! Redirecting...", subtitle: "Sign in to your account", signupSub: "Create your free account" },
  fr: { signIn: "Connexion", signUp: "Inscription", email: "Email", password: "Mot de passe", confirmPassword: "Confirmer", createAccount: "Créer un compte", or: "ou", continueGoogle: "Continuer avec Google", signingIn: "Connexion...", creatingAccount: "Création du compte...", backHome: "← Retour", haveAccount: "Déjà un compte?", noAccount: "Pas de compte?", fillFields: "Remplissez tout", passwordsMatch: "Mots de passe différents", passwordLength: "6 caractères min", authFailed: "Échec", googleFailed: "Échec Google", loginSuccess: "Connecté ! Redirection...", registerSuccess: "Compte créé ! Redirection...", subtitle: "Connectez-vous", signupSub: "Créez votre compte" },
  rw: { signIn: "Injira", signUp: "Iyandikishe", email: "Email", password: "Ijambo banga", confirmPassword: "Emeza", createAccount: "Fungura Konti", or: "cyangwa", continueGoogle: "Komeza na Google", signingIn: "Kwinjira...", creatingAccount: "Gufungura konti...", backHome: "← Subira inyuma", haveAccount: "Ufite konti?", noAccount: "Nta konti?", fillFields: "Uzuza byose", passwordsMatch: "Ntabwo bihuye", passwordLength: "Byibura 6", authFailed: "Ntibyashobotse", googleFailed: "Google ntiyashobotse", loginSuccess: "Winjiyemo! Turakwerekeza...", registerSuccess: "Konti yafunguwe! Turakwerekeza...", subtitle: "Injira muri konti", signupSub: "Fungura konti" },
};

function Login() {
  const { handleGoogleLogin, handleLogin, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const langRef = useRef(null);

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("guraneza_language") || "en");
  const [langOpen, setLangOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  const langLabels = { en: "EN", fr: "FR", rw: "RW" };

  useEffect(() => { if (user) navigate("/home"); }, [user, navigate]);
  useEffect(() => {
    const handleClick = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const changeLanguage = (l) => { setLang(l); localStorage.setItem("guraneza_language", l); setLangOpen(false); };
  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); setError(""); setSuccess(""); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!formData.email || !formData.password) { setError(t("fillFields")); return; }
    if (isSignUp && formData.password !== formData.confirmPassword) { setError(t("passwordsMatch")); return; }
    if (formData.password.length < 6) { setError(t("passwordLength")); return; }
    setLoading(true);
    const result = await handleLogin(formData.email, formData.password, isSignUp);
    if (result.success) {
      setSuccess(isSignUp ? t("registerSuccess") : t("loginSuccess"));
      setTimeout(() => navigate("/home"), 1500);
    } else {
      setError(result.message || t("authFailed"));
    }
    setLoading(false);
  };

  const onGoogleSuccess = async (r) => {
    setLoading(true); setError(""); setSuccess("");
    const result = await handleGoogleLogin(r);
    if (result.success) {
      setSuccess(t("loginSuccess"));
      setTimeout(() => navigate("/home"), 1500);
    } else {
      setError(result.message || t("googleFailed"));
    }
    setLoading(false);
  };

  const onGoogleError = () => { setError(t("googleFailed")); };
  const login = useGoogleLogin({ onSuccess: onGoogleSuccess, onError: onGoogleError, flow: 'implicit' });

  const bgColor = darkMode ? '#000124' : '#f0f0f0';
  const cardBg = darkMode ? 'rgba(20,20,40,0.5)' : 'rgba(255,255,255,0.85)';
  const textColor = darkMode ? 'white' : '#1a1a2e';
  const mutedColor = darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
  const inputBg = 'rgba(255,255,255,0.05)';
  const inputBorder = 'rgba(255,255,255,0.08)';
  const placeholderColor = 'rgba(255,255,255,0.25)';
  const tabBg = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
  const tabActiveBg = darkMode ? 'rgba(0,227,9,0.12)' : 'rgba(0,227,9,0.1)';
  const dividerColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const topBtnBg = darkMode ? 'rgba(20,20,40,0.5)' : 'rgba(255,255,255,0.7)';
  const topBtnBorder = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
  const accentColor = '#00E309';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: bgColor }}>
      
      <style>{`
        @keyframes bagRise { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 5% { opacity: 0.05; } 95% { opacity: 0.05; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .login-input { width: 100%; padding: 0.45rem 2.2rem 0.45rem 0.7rem; border-radius: 6px; border: 1px solid ${inputBorder}; background: ${inputBg}; color: white; font-size: 0.7rem; outline: none; text-align: left; transition: all 0.2s; }
        .login-input::placeholder { color: ${placeholderColor}; }
        .login-input:focus { border-color: ${accentColor} !important; box-shadow: 0 0 0 2px rgba(0,227,9,0.1); }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.2); border-top-color: #000124; border-radius: 50%; animation: spin 0.6s linear infinite; display: inline-block; }
      `}</style>

      {/* Success Notification */}
      {success && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: 'rgba(0,227,9,0.15)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,227,9,0.3)', borderRadius: 10, padding: '0.7rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideDown 0.3s ease', boxShadow: '0 4px 16px rgba(0,227,9,0.15)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E309" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          <span style={{ color: '#00E309', fontSize: '0.8rem', fontWeight: 500 }}>{success}</span>
        </div>
      )}

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <img src={videoGif} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: darkMode ? 0.3 : 0.08 }} />
        <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(0,1,36,0.9)' : 'rgba(240,240,240,0.88)' }} />
      </div>

      {/* Floating Bags */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ position: 'absolute', left: `${Math.random() * 95}%`, bottom: '-40px', animation: `bagRise ${3 + Math.random() * 5}s linear infinite`, animationDelay: `${Math.random() * 4}s`, opacity: 0.04 }}>
            <svg width={12 + Math.random() * 12} height={12 + Math.random() * 12} viewBox="0 0 24 24" fill={darkMode ? "white" : "#0a0a14"}><path d="M16 6l-2-3h-4L8 6H3v15h18V6h-5zM8.5 7l2-3h3l2 3H8.5zM5 19V8h2v11H5zm4 0V8h2v11H9zm4 0V8h2v11h-2zm4 0V8h2v11h-2z"/></svg>
          </div>
        ))}
      </div>

      {/* Top Right */}
      <div style={{ position: 'absolute', top: '0.8rem', right: '1rem', zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <div ref={langRef} style={{ position: 'relative' }}>
          <button onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: 6, border: `1px solid ${topBtnBorder}`, background: topBtnBg, backdropFilter: 'blur(8px)', cursor: 'pointer', fontSize: '0.6rem', fontWeight: 600, color: textColor }}>{langLabels[lang]} <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></button>
          {langOpen && (
            <div style={{ position: 'absolute', top: 'calc(100% + 0.25rem)', right: 0, minWidth: 80, background: cardBg, backdropFilter: 'blur(16px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', borderRadius: 10, padding: '0.2rem 0', zIndex: 20, border: `1px solid ${inputBorder}` }}>
              {Object.entries(langLabels).map(([code, label]) => (
                <div key={code} onClick={() => changeLanguage(code)} style={{ padding: '0.35rem 0.8rem', cursor: 'pointer', fontSize: '0.6rem', color: lang === code ? accentColor : textColor, fontWeight: lang === code ? 600 : 400 }}>{label} {lang === code && '✓'}</div>
              ))}
            </div>
          )}
        </div>
        <button onClick={toggleDarkMode} style={{ width: 30, height: 30, borderRadius: '50%', border: `1px solid ${topBtnBorder}`, background: topBtnBg, backdropFilter: 'blur(8px)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {darkMode ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>}
        </button>
      </div>

      {/* Login Card */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 340, padding: '0 1rem' }}>
        <div style={{ background: cardBg, backdropFilter: 'blur(20px) saturate(160%)', borderRadius: 14, padding: '1.5rem 1.3rem', border: `1px solid ${darkMode ? 'rgba(0,227,9,0.06)' : 'rgba(0,0,0,0.06)'}`, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          
          <div style={{ marginBottom: '0.8rem' }}>
            <img src={logo} alt="GuraNeza" style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 3px 8px rgba(0,227,9,0.3))', display: 'block', margin: '0 auto' }} />
          </div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, letterSpacing: '0.03em', marginBottom: '0.15rem' }}>GURANEZA</h1>
          <p style={{ fontSize: '0.6rem', color: accentColor, fontWeight: 400, marginBottom: '0.8rem' }}>BuySmart</p>

          <p style={{ fontSize: '0.65rem', color: mutedColor, marginBottom: '0.8rem' }}>{isSignUp ? t("signupSub") : t("subtitle")}</p>

          <div style={{ display: 'flex', gap: '0.15rem', background: tabBg, borderRadius: 6, padding: '0.15rem', marginBottom: '0.8rem' }}>
            <button onClick={() => { setIsSignUp(false); setError(""); setSuccess(""); }} style={{ flex: 1, padding: '0.35rem', borderRadius: 5, border: 'none', background: !isSignUp ? tabActiveBg : 'transparent', color: !isSignUp ? accentColor : mutedColor, fontWeight: !isSignUp ? 600 : 400, fontSize: '0.65rem', cursor: 'pointer' }}>{t("signIn")}</button>
            <button onClick={() => { setIsSignUp(true); setError(""); setSuccess(""); }} style={{ flex: 1, padding: '0.35rem', borderRadius: 5, border: 'none', background: isSignUp ? tabActiveBg : 'transparent', color: isSignUp ? accentColor : mutedColor, fontWeight: isSignUp ? 600 : 400, fontSize: '0.65rem', cursor: 'pointer' }}>{t("signUp")}</button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '0.6rem', padding: '0.4rem 0.7rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 6, color: '#ef4444', fontSize: '0.58rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.4rem', animation: 'fadeIn 0.2s ease' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t("email")} className="login-input" style={{ paddingRight: '0.7rem' }} autoComplete="email" disabled={loading} />
            </div>

            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={t("password")} className="login-input" autoComplete={isSignUp ? "new-password" : "current-password"} disabled={loading} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                {showPassword ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            {isSignUp && (
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder={t("confirmPassword")} className="login-input" autoComplete="new-password" disabled={loading} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                  {showConfirmPassword ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: 'none', background: loading ? 'rgba(0,227,9,0.3)' : accentColor, color: '#000124', fontWeight: 600, fontSize: '0.7rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
              {loading ? (
                <>
                  <span className="spinner" />
                  {isSignUp ? t("creatingAccount") : t("signingIn")}
                </>
              ) : (
                isSignUp ? t("createAccount") : t("signIn")
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.7rem 0' }}><div style={{ flex: 1, height: 1, background: dividerColor }} /><span style={{ fontSize: '0.58rem', color: mutedColor }}>{t("or")}</span><div style={{ flex: 1, height: 1, background: dividerColor }} /></div>

          <button onClick={() => login()} disabled={loading} style={{ width: '100%', padding: '0.45rem', borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: 'white', fontSize: '0.65rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            {t("continueGoogle")}
          </button>

          <p style={{ fontSize: '0.62rem', color: mutedColor, marginTop: '0.6rem' }}>
            {isSignUp ? t("haveAccount") : t("noAccount")}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }} style={{ background: 'none', border: 'none', color: accentColor, cursor: 'pointer', fontWeight: 500, fontSize: '0.62rem' }}>{isSignUp ? t("signIn") : t("signUp")}</button>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
          <Link to="/" style={{ fontSize: '0.62rem', color: mutedColor, textDecoration: 'none' }}>{t("backHome")}</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;