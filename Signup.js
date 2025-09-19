import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  doc,
  setDoc,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "../firebase";

export default function Signup() {
  const [data, setData] = useState({ name: "", email: "", pw: "", confirm: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false); // FIXED: Loading state added
  const navigate = useNavigate();

  const handle = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!data.name || !data.email || !data.pw) return toast.error("Please fill all fields");
    if (data.pw !== data.confirm) return toast.error("Passwords don't match");

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.pw);
      const user = userCredential.user;

      // Send email verification link
      await sendEmailVerification(user);
      
      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        createdAt: new Date(),
        emailVerified: user.emailVerified
      });

      toast.success("Account created! Please check your email for verification.");
      setData({ name: "", email: "", pw: "", confirm: "" });
      navigate("/");
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

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date(),
        emailVerified: user.emailVerified
      }, { merge: true });

      toast.success("Signed up with Google successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const strength = (pw) => {
    let score = 0;
    if (!pw) return { score, label: "Too short" };
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return { score, label: labels[Math.max(0, Math.min(labels.length-1, score-1))] || "Weak" };
  }

  const strengthScore = strength(data.pw);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }} className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Create an account</h2>

        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700 py-2 rounded-lg mb-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <FcGoogle /> Sign up with Google
        </button>

        <div className="flex items-center gap-2 mb-4">
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          <span className="text-xs text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input name="name" value={data.name} onChange={handle} placeholder="Full name" required className="w-full px-4 py-3 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input name="email" value={data.email} onChange={handle} placeholder="Email address" required className="w-full px-4 py-3 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500" />
          <div className="relative">
            <input name="pw" value={data.pw} onChange={handle} type={show ? "text" : "password"} placeholder="Password" required className="w-full px-4 py-3 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="relative">
            <input name="confirm" value={data.confirm} onChange={handle} type={show ? "text" : "password"} placeholder="Confirm password" required className="w-full px-4 py-3 rounded-md border bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500" />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-3 text-sm text-gray-500">{show ? "Hide" : "Show"}</button>
          </div>
          <div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${(strengthScore.score/4)*100}%` }} className={`h-full ${strengthScore.score >= 3 ? "bg-green-500" : "bg-yellow-400"}`} />
            </div>
            <div className="mt-1 text-sm text-gray-500">Password: {strengthScore.label}</div>
          </div>
          <button type="submit" className="w-full py-3 rounded-md bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold disabled:opacity-50" disabled={loading}>
            Create account
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-4">Already registered? <a href="/login" className="text-blue-600">Sign in</a></p>
      </motion.div>
    </div>
  );
}