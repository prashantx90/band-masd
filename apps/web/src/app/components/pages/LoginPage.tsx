import { useState } from "react";
import { useDirectusAuth } from "../../../context/DirectusAuthContext";
import { Zap, Loader2, AlertCircle } from "lucide-react";

export function LoginPage() {
  const { login } = useDirectusAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#07070b] relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.60 0.22 264 / 0.12) 0%, transparent 70%)",
          top: "10%",
          left: "20%",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, oklch(0.62 0.22 290 / 0.08) 0%, transparent 70%)",
          bottom: "10%",
          right: "20%",
        }}
      />

      <div className="w-full max-w-sm px-6 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-foreground tracking-tight text-center" style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" }}>
            CodeBand AI
          </h1>
          <p className="text-muted-foreground text-center mt-1" style={{ fontSize: "13px" }}>
            Multi-Agent software orchestration console
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/60 backdrop-blur-md p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[12px] leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                style={{ fontSize: "13px" }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-foreground" style={{ fontSize: "12px", fontWeight: 500 }}>
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-md bg-input-background border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                style={{ fontSize: "13px" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium mt-6"
              style={{ fontSize: "13px" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
