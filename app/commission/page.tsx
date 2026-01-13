"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Upload, LogIn, ArrowRight, Check, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';

// REPLACE THIS WITH YOUR ACTUAL DISCORD INVITE LINK
const DISCORD_INVITE_LINK = "https://discord.gg/k6wqXzQDrc"; 

export default function CommissionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  // Step Management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // 1: Palette, 2: Description, 3: Images, 4: Review

  // Form States
  const [coolors, setCoolors] = useState('');
  const [desc, setDesc] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: window.location.origin + '/commission' }
    });
  };

  const nextStep = () => {
    setError('');
    // Validation
    if (currentStep === 1 && !coolors.trim()) return setError('Please provide a link.');
    if (currentStep === 2 && !desc.trim()) return setError('Please describe your request.');
    
    if (currentStep < totalSteps) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const prevStep = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        alert("Max 5 images allowed");
        return;
      }
      setFiles([...files, ...selectedFiles]);
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Upload Images
      const imageUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('commissions').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('commissions').getPublicUrl(fileName);
        imageUrls.push(data.publicUrl);
      }

      // 2. Send to API
      const res = await fetch('/api/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.user_metadata.full_name || user.email,
          discordId: user.user_metadata.provider_id,
          description: desc,
          coolors: coolors,
          images: imageUrls
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Error sending request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- PROGRESS BAR ---
  const progress = (currentStep / totalSteps) * 100;

  // --- SCREEN: SUCCESS ---
  if (sent) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md bg-[#141414] p-10 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/20">
             <Check className="text-green-500 w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Request Received!</h1>
            <p className="text-gray-400 text-sm">
              Your details are safe with me.<br/>
              <span className="text-white font-semibold">One final step required:</span>
            </p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/5">
            <p className="text-sm text-gray-300 mb-4">
              Join the Discord server to open a ticket and discuss the project.
            </p>
            <a href={DISCORD_INVITE_LINK} target="_blank" rel="noopener noreferrer" className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center gap-2 hover:scale-105">
               Join Discord Server
            </a>
          </div>
          <Link href="/" className="inline-block text-gray-500 hover:text-white text-sm font-medium transition-colors">Return to Portfolio</Link>
        </motion.div>
      </div>
    );
  }

  // --- SCREEN: MAIN ---
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-2xl">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ChevronLeft size={20} /> Back to Portfolio
        </Link>

        <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden">
          
          {/* Header & Progress */}
          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-[#5865F2]/10 rounded-full flex items-center justify-center mb-6">
                <LogIn className="text-[#5865F2] w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
              <p className="mb-8 text-gray-400 max-w-xs">Please login with Discord to verify your identity and start your commission.</p>
              <button onClick={handleLogin} className="bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105">
                Login with Discord
              </button>
            </div>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/5 rounded-full mb-8 relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="absolute left-0 top-0 h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>

              {/* Step Counter */}
              <div className="flex justify-between items-end mb-6">
                 <div>
                    <h1 className="text-3xl font-bold">
                        {currentStep === 1 && "Color Palette"}
                        {currentStep === 2 && "The Vision"}
                        {currentStep === 3 && "Visuals"}
                        {currentStep === 4 && "Review"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {currentStep === 1 && "Let's set the tone for your project."}
                        {currentStep === 2 && "Describe what you need in detail."}
                        {currentStep === 3 && "Upload inspiration or references."}
                        {currentStep === 4 && "Double check everything before sending."}
                    </p>
                 </div>
                 <div className="text-xs font-mono text-gray-600 border border-white/10 px-2 py-1 rounded-md">
                    Step {currentStep} / {totalSteps}
                 </div>
              </div>

              {/* Form Content Area */}
              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: COOLORS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                       <label className="block text-sm font-semibold text-gray-300">Link to Coolors.co or Palette</label>
                       <input 
                        autoFocus
                        type="url" 
                        placeholder="https://coolors.co/..." 
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-5 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors"
                        value={coolors}
                        onChange={(e) => setCoolors(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && nextStep()}
                      />
                      <p className="text-xs text-gray-500">Press Enter to continue</p>
                    </motion.div>
                  )}

                  {/* STEP 2: DESCRIPTION */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                       <label className="block text-sm font-semibold text-gray-300">Detailed Explanation</label>
                       <textarea 
                        autoFocus
                        rows={6}
                        placeholder="I need a main menu with a settings frame, shop frame, and..." 
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-5 text-white text-base focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      ></textarea>
                    </motion.div>
                  )}

                  {/* STEP 3: IMAGES */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                       <label className="block text-sm font-semibold text-gray-300">Inspiration Images (Optional)</label>
                       <div className="relative border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:border-white/20 transition-colors cursor-pointer bg-[#0a0a0a] group">
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center pointer-events-none group-hover:scale-110 transition-transform duration-300">
                          <Upload className="text-gray-500 mb-4" size={40} />
                          <p className="text-gray-300 font-medium">Click to upload images</p>
                          <p className="text-xs text-gray-600 mt-2">Max 5 files (PNG, JPG)</p>
                        </div>
                      </div>
                      
                      {/* Previews */}
                      {previews.length > 0 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                          {previews.map((src, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={idx} 
                                className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg"
                            >
                              <Image src={src} alt="preview" fill className="object-cover" />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 4: REVIEW */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                       <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                          <Image src={user.user_metadata.avatar_url} alt="User" width={40} height={40} className="rounded-full" />
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase">Requester</p>
                            <p className="font-semibold">{user.user_metadata.full_name}</p>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Palette</p>
                              <p className="truncate text-blue-400 underline">{coolors}</p>
                          </div>
                          <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Description</p>
                              <p className="text-gray-300 text-sm line-clamp-3">{desc}</p>
                          </div>
                          <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
                              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Attachments</p>
                              <p className="text-gray-300 text-sm">{files.length} images attached</p>
                          </div>
                       </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Navigation Actions */}
              <div className="mt-8 flex items-center justify-between">
                 {/* Error Msg */}
                 <div className="absolute bottom-4 left-0 right-0 text-center">
                    {error && <span className="text-red-500 text-sm font-medium animate-pulse">{error}</span>}
                 </div>

                 <button 
                    onClick={prevStep}
                    className={`flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                 >
                    <ChevronLeft size={16} /> Back
                 </button>

                 {currentStep < totalSteps ? (
                    <button 
                        onClick={nextStep}
                        className="bg-white text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                 ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`bg-blue-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:scale-105 transition-transform ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Check size={18} />}
                        {loading ? 'Sending...' : 'Submit Commission'}
                    </button>
                 )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}