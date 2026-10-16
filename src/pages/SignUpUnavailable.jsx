import { useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { BrandMark, BrandName } from "../components/BrandLogo";
import { SitePageHeader, AboutFooter } from "./About";
import "./Home.css";
import "./SignIn.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.mobile && !/^[0-9+()\-\s]{8,15}$/.test(form.mobile)) {
      nextErrors.mobile = "Enter a valid mobile number.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters long.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!form.acceptTerms) {
      nextErrors.acceptTerms =
        "You must agree to the Terms & Conditions and Privacy Policy.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstErrorKey = Object.keys(nextErrors)[0];
      document.getElementById(`signup-${firstErrorKey}`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          confirmPassword: form.confirmPassword,
          acceptTerms: form.acceptTerms,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create your account right now.",
        );
      }

      localStorage.setItem("stayease_token", data.token);
      localStorage.setItem("stayease_user", JSON.stringify(data.user));
      navigate("/sign-in");
    } catch (error) {
      setErrors({
        form: error.message || "Unable to create your account right now.",
      });
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
          aria-labelledby="signup-title"
        >
          <div className="signin-form-panel">
            <div className="signin-topline">
              <div className="signin-brand-mark">
                <BrandMark size={36} />
                <BrandName className="signin-brand-name" />
              </div>
              <span className="section-tag">MAKE ROOM FOR WHAT’S NEXT</span>
            </div>
            <h1 id="signup-title">
              Your next chapter <span className="hl">starts here.</span>
            </h1>
            <p className="signin-intro">
              Create a VibezRoutes account to get started.
            </p>

            <form
              className="signin-form signup-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="signin-field">
                <label htmlFor="signup-fullName">
                  Full Name <span aria-hidden="true">*</span>
                </label>
                <div className="signin-password-wrap">
                  <UserRound size={17} aria-hidden="true" />
                  <input
                    id="signup-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "signup-fullName-error" : undefined
                    }
                  />
                </div>
                {errors.fullName && (
                  <span className="signin-error" id="signup-fullName-error">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="signin-field">
                <label htmlFor="signup-email">
                  Email Address <span aria-hidden="true">*</span>
                </label>
                <div className="signin-password-wrap">
                  <Mail size={17} aria-hidden="true" />
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "signup-email-error" : undefined
                    }
                  />
                </div>
                {errors.email && (
                  <span className="signin-error" id="signup-email-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="signin-field">
                <label htmlFor="signup-mobile">Mobile Number</label>
                <div className="signin-password-wrap">
                  <Phone size={17} aria-hidden="true" />
                  <input
                    id="signup-mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Optional"
                    value={form.mobile}
                    onChange={(event) =>
                      updateField("mobile", event.target.value)
                    }
                    aria-invalid={Boolean(errors.mobile)}
                    aria-describedby={
                      errors.mobile ? "signup-mobile-error" : undefined
                    }
                  />
                </div>
                {errors.mobile && (
                  <span className="signin-error" id="signup-mobile-error">
                    {errors.mobile}
                  </span>
                )}
              </div>

              <div className="signin-field">
                <label htmlFor="signup-password">
                  Password <span aria-hidden="true">*</span>
                </label>
                <div className="signin-password-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "signup-password-error" : undefined
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
                  <span className="signin-error" id="signup-password-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="signin-field">
                <label htmlFor="signup-confirmPassword">
                  Confirm Password <span aria-hidden="true">*</span>
                </label>
                <div className="signin-password-wrap">
                  <LockKeyhole size={17} aria-hidden="true" />
                  <input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "signup-confirmPassword-error"
                        : undefined
                    }
                  />
                  <button
                    className="signin-password-toggle"
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span
                    className="signin-error"
                    id="signup-confirmPassword-error"
                  >
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <label className="signin-checkbox">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(event) =>
                    updateField("acceptTerms", event.target.checked)
                  }
                  aria-invalid={Boolean(errors.acceptTerms)}
                />
                <span>
                  I agree to the{" "}
                  <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>{" "}
                  and <Link to="/privacy-policy">Privacy Policy</Link>.
                </span>
              </label>
              {errors.acceptTerms && (
                <span className="signin-error signin-checkbox-error">
                  {errors.acceptTerms}
                </span>
              )}

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
                {isSubmitting ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <p className="signin-signup">
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </p>
          </div>

          <aside
            className="signin-visual"
            aria-label="A welcoming VibezRoutes destination"
          >
            <div className="signin-visual-overlay" />
            <div className="signin-visual-copy">
              <span>Find your place</span>
              <h2>Begin your next story with VibezRoutes.</h2>
            </div>
          </aside>
        </section>
      </main>
      <AboutFooter />
    </div>
  );
}
