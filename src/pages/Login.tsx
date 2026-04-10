import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = isSignUp ? await signUp(email, password) : await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else if (!isSignUp) {
      navigate("/");
    } else {
      setError("Check your email to confirm your account.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card rounded-lg shadow-lg p-8 space-y-4">
        <h1 className="text-xl font-bold text-center font-barlow-condensed text-foreground">
          {isSignUp ? "Create Account" : "Admin Login"}
        </h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 border border-border-custom rounded text-sm bg-light"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={6}
          className="w-full px-3 py-2 border border-border-custom rounded text-sm bg-light"
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button type="submit" className="w-full py-2 rounded bg-primary text-primary-foreground font-semibold text-sm">
          {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
          className="mt-4 text-xs text-action hover:underline w-full text-center"
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
