import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api.js";
import { ShieldCheck, Lock } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await AuthAPI.login({ email, password });
      localStorage.setItem("nexus_token", res.token);
      localStorage.setItem("nexus_user", JSON.stringify(res.user));
      onLogin(res.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blueprint-bg flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-signal-cyan/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-signal-amber/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-xl border border-blueprint-line p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck size={48} strokeWidth={1.5} className="text-signal-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.6)] mb-4" />
          <h1 className="font-display text-3xl font-700 text-ink-primary tracking-tight">NEXUS SECURE</h1>
          <p className="text-xs font-mono text-ink-muted uppercase tracking-widest mt-2">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-signal-rose/10 border border-signal-rose/50 text-signal-rose px-4 py-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">Secure Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#171717] border border-blueprint-line text-ink-primary px-4 py-3 rounded outline-none focus:border-signal-cyan transition-colors"
              placeholder="engineer@nexus.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-muted uppercase tracking-widest mb-2">Access Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-3.5 text-ink-faint" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#171717] border border-blueprint-line text-ink-primary pl-11 pr-4 py-3 rounded outline-none focus:border-signal-cyan transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-signal-cyan/10 border border-signal-cyan text-signal-cyan hover:bg-signal-cyan/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] font-mono uppercase tracking-widest text-sm py-3 rounded transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Establish Link"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-blueprint-line text-center">
          <p className="text-[10px] text-ink-faint font-mono">Demo Accounts:</p>
          <p className="text-[10px] text-ink-muted font-mono mt-1">Admin: admin@nexus.com | pwd: password123</p>
          <p className="text-[10px] text-ink-muted font-mono mt-1">Vendor: vendor@nexus.com | pwd: password123</p>
        </div>
      </div>
    </div>
  );
}
