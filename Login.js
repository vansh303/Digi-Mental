import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
  auth, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail 
} from "../firebase";

function passwordStrength(pw) {
  let score = 0;
  if (!pw) return { score, label: "Too short" };
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[Math.max(0, Math.min(labels.length-1, score-1))] || "Weak" };
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pw) return toast.error("Fill all fields");

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pw);
      const user = userCredential.user;

      if (!user.emailVerified) {
        // If email is not verified, show a message and do not redirect
        toast.error("Please verify your email to continue.");
        // We will keep the user logged in and let App.js redirect them
      } else {
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        toast.error("Please verify your email to continue.");
      } else {
        toast.success("Signed in with Google successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast("Please enter your email to reset the password.", { icon: "📧" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Please check your inbox!");
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  const strength = passwordStrength(pw);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <motion.div initial={{ scale:0.98, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.4 }} className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Sign in to DigiMental</h2>

        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 py-2 rounded-lg mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <FcGoogle /> Continue with Google
        </button>

        <div className="flex items-center gap-2 mb-4">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" />
          <div className="relative">
            <input value={pw} onChange={e => setPw(e.target.value)} type={show ? "text" : "password"} placeholder="Password" className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent" />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-3 text-sm text-gray-500">{show ? "Hide" : "Show"}</button>
          </div>

          <div className="text-sm text-gray-500 flex items-center justify-between">
            <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
            <button type="button" onClick={handleForgotPassword} className="text-blue-600">Forgot?</button>
          </div>

          <div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${(strength.score/4)*100}%` }} className={`h-full ${strength.score >= 3 ? "bg-green-500" : "bg-yellow-400"}`} />
            </div>
            <div className="mt-1 text-sm text-gray-500">Password: {strength.label}</div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-2 py-3 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-50">Sign in</button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">Don't have an account? <a href="/signup" className="text-green-500">Create an account</a></p>
      </motion.div>
    </div>
  );
}