import React, { useState } from 'react';
import { GlobalAudioManager } from '@/lib/audio/GlobalAudioManager';
import { PROFILE_DATA } from '@/data/profile';
import {
  Send,
  CheckCircle2,
  Copy,
  Check,
  Github,
  Linkedin,
  Twitter,
  Mail,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface MailFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function MailApp() {
  const [formData, setFormData] = useState<MailFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [copied, setCopied] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please enter your name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Please enter a subject (at least 3 characters).';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide a message of at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      GlobalAudioManager.getInstance().playFx('click');
      return;
    }

    GlobalAudioManager.getInstance().playFx('window-open');
    setStatus('sending');

    setTimeout(() => {
      setStatus('sent');
      GlobalAudioManager.getInstance().playFx('dock-bounce');
    }, 700);
  };

  const handleReset = () => {
    GlobalAudioManager.getInstance().playFx('click');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setStatus('idle');
  };

  const handleCopyEmail = () => {
    GlobalAudioManager.getInstance().playFx('click');
    navigator.clipboard?.writeText(PROFILE_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-testid="mail-app"
      className="flex-1 w-full h-full bg-stone-950/90 text-white flex flex-col overflow-hidden select-none"
    >
      {/* Mail Window Header Bar */}
      <div className="h-11 px-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-white/90">New Message</span>
        </div>

        <button
          data-testid="mail-copy-email-btn"
          onClick={handleCopyEmail}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : PROFILE_DATA.email}</span>
        </button>
      </div>

      {/* Main Form or Success View */}
      <div className="flex-1 overflow-y-auto p-5 select-text">
        {status === 'sent' ? (
          /* SUCCESS CONFIRMATION SCREEN */
          <div
            data-testid="mail-sent-success"
            className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
              <p className="text-xs text-white/70 max-w-sm">
                Thank you for reaching out! Your message has been received. I typically respond within 24 hours.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all mt-2"
            >
              <RotateCcw size={14} />
              <span>Send Another Message</span>
            </button>
          </div>
        ) : (
          /* INTERACTIVE CONTACT FORM */
          <form onSubmit={handleSend} className="space-y-3 max-w-xl mx-auto">
            {/* Recipient Field */}
            <div className="flex items-center py-1.5 border-b border-white/10 text-xs">
              <span className="w-16 text-white/40 font-medium">To:</span>
              <span className="font-semibold text-blue-400">{PROFILE_DATA.name} &lt;{PROFILE_DATA.email}&gt;</span>
            </div>

            {/* Name Field */}
            <div className="space-y-1">
              <div className="flex items-center py-1 border-b border-white/10 text-xs">
                <label htmlFor="name-input" className="w-16 text-white/40 font-medium">From:</label>
                <input
                  id="name-input"
                  data-testid="mail-input-name"
                  type="text"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
                />
              </div>
              {errors.name && (
                <div className="text-[11px] text-rose-400 flex items-center space-x-1 pl-16">
                  <AlertCircle size={10} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <div className="flex items-center py-1 border-b border-white/10 text-xs">
                <label htmlFor="email-input" className="w-16 text-white/40 font-medium">Email:</label>
                <input
                  id="email-input"
                  data-testid="mail-input-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
                />
              </div>
              {errors.email && (
                <div className="text-[11px] text-rose-400 flex items-center space-x-1 pl-16">
                  <AlertCircle size={10} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-1">
              <div className="flex items-center py-1 border-b border-white/10 text-xs">
                <label htmlFor="subject-input" className="w-16 text-white/40 font-medium">Subject:</label>
                <input
                  id="subject-input"
                  data-testid="mail-input-subject"
                  type="text"
                  placeholder="Project Collaboration / Opportunity"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none"
                />
              </div>
              {errors.subject && (
                <div className="text-[11px] text-rose-400 flex items-center space-x-1 pl-16">
                  <AlertCircle size={10} />
                  <span>{errors.subject}</span>
                </div>
              )}
            </div>

            {/* Message Area */}
            <div className="space-y-1 pt-1">
              <textarea
                data-testid="mail-input-message"
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all resize-none"
              />
              {errors.message && (
                <div className="text-[11px] text-rose-400 flex items-center space-x-1">
                  <AlertCircle size={10} />
                  <span>{errors.message}</span>
                </div>
              )}
            </div>

            {/* Submit & Secondary Social Links */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-white/50">
                <a
                  href={PROFILE_DATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github size={15} />
                </a>
                <a
                  href={PROFILE_DATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={PROFILE_DATA.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                  title="Twitter / X"
                >
                  <Twitter size={15} />
                </a>
              </div>

              <button
                type="submit"
                data-testid="mail-send-button"
                disabled={status === 'sending'}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Send size={14} className={status === 'sending' ? 'animate-bounce' : ''} />
                <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
