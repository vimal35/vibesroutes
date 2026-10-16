import { useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { BrandMark, BrandName } from "../components/BrandLogo";
import { SitePageHeader, AboutFooter } from "./About";
import "./Home.css";
import "./SignIn.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorKey = Object.keys(nextErrors)[0];
      document.getElementById(`signin-${firstErrorKey}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to sign in right now.");
      }

      localStorage.setItem("stayease_token", data.token);
      localStorage.setItem("stayease_user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      setErrors({ form: error.message || "Unable to sign in right now." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-page">
      <SitePageHeader activePage="sign-in" />
      <main className="signin-main">
        <section
          className="signin-layout container"
          aria-labelledby="signin-title"
        >
          <div className="signin-form-panel">
            <div className="signin-topline">
              <div className="signin-brand-mark">
                <BrandMark size={36} />
                <BrandName className="signin-brand-name" />
              </div>
              <span className="section-tag">WELCOME BACK</span>
            </div>
            <h1 id="signin-title">
              Good to have <span className="hl">you back.</span>
            </h1>
            <p className="signin-intro">
              Sign in to continue with your VibezRoutes account.
            </p>

            <form className="signin-form" onSubmit={handleSubmit} noValidate>
              <div className="signin-field">
                <label htmlFor="signin-email">
                  Email Address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  maxLength="254"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      email: undefined,
                      form: undefined,
                    }));
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "signin-email-error" : undefined
                  }
                />
                {errors.email && (
                  <span className="signin-error" id="signin-email-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="signin-field">
                <label htmlFor="signin-password">
                  Password <span aria-hidden="true">*</span>
                </label>
                <div className="signin-password-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        password: undefined,
                        form: undefined,
                      }));
                    }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "signin-password-error" : undefined
                    }
                  />
                  <button
                    className="signin-password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="signin-error" id="signin-password-error">
                    {errors.password}
                  </span>
                )}
              </div>

              {errors.form && (
                <div className="signin-server-error" role="alert">
                  {errors.form}
                </div>
              )}

              <button
                className="btn-signup signin-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In…" : "Sign In"}
              </button>
            </form>

            <p className="signin-help">
              Need help accessing your account?{" "}
              <Link to="/contact">Contact us</Link>
            </p>
            <p className="signin-signup">
              Don't have an account? <Link to="/sign-up">Create one</Link>
            </p>
          </div>

          <aside
            className="signin-visual"
            aria-label="A welcoming VibezRoutes destination"
          >
            <div className="signin-visual-overlay" />
            <div className="signin-visual-copy">
              <span>Make room for a getaway</span>
              <h2>Find a place to feel at ease.</h2>
            </div>
          </aside>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
