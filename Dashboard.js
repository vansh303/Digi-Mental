import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db, doc, getDoc, sendPasswordResetEmail, signOut } from "../firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          setUserData({ name: user.displayName || "User", email: user.email });
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handlePasswordReset = async () => {
    if (user && user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast.success("Password reset email sent! Please check your inbox.");
      } catch (error) {
        toast.error("Failed to send password reset email. Please try again.");
        console.error("Error sending password reset email:", error);
      }
    } else {
      toast.error("User not found or email is missing.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400"
        >
          User Dashboard
        </motion.h1>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center space-x-6 mb-8">
            <img
              src={user?.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h2 className="text-2xl font-bold">{userData?.name || "User Name"}</h2>
              <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Account Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePasswordReset}
              className="flex-1 py-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Change Password
            </button>
            <button
              className="flex-1 py-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 py-3 rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow hover:opacity-95 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}