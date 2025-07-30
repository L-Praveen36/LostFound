import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function SignUpModal({ onClose = () => {}, onSuccess = () => {} }) {
  const [step, setStep] = useState("form"); // 'form' → 'otp' → 'done'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
    profileFile: null,
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/auth/send-otp", { email: formData.email });
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email: formData.email,
        otp,
      });

      if (res.status === 200) {
        // 🔄 Upload profile picture if present
        let photoURL = "";

        if (formData.profileFile) {
          const storageRef = ref(
            storage,
            `profile_pictures/${Date.now()}_${formData.profileFile.name}`
          );
          const uploadResult = await uploadBytes(storageRef, formData.profileFile);
          photoURL = await getDownloadURL(uploadResult.ref);
        } else if (formData.profilePic) {
          photoURL = formData.profilePic;
        }

        // ✅ Create Firebase user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: formData.name,
          photoURL,
        });

        const token = await userCredential.user.getIdToken();
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          token,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setStep("done");
        onSuccess(userData);
        onClose();
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setError("OTP verification or account creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="backdrop-blur-md bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Sign Up</h2>

        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

        {step === "form" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mb-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mb-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mb-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, profileFile: e.target.files[0] })
              }
              className="w-full px-4 py-2 mb-4 bg-white bg-opacity-20 text-white rounded-lg"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 focus:outline-none"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </>
        )}

        {step === "done" && (
          <p className="text-green-400 text-center">
            ✅ Account created successfully!
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full text-white text-sm hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default SignUpModal;
