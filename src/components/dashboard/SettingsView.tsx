'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Shield,
  Key,
  Webhook,
  Sliders,
  Users,
  CheckCircle2,
  Copy,
  ExternalLink,
} from 'lucide-react';

export function SettingsView() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [modelStrictness, setModelStrictness] = useState('BALANCED');
  const [webhookUrl, setWebhookUrl] = useState('https://api.enterprise.corp/markwise/webhook');

  const copyApiKey = () => {
    navigator.clipboard.writeText('mw_live_9f81a7b8e234c01d4a');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5" />
          System Preferences
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Workspace Settings & Integrations
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Configure enterprise compliance policies, API credentials, and webhooks.
        </p>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold tracking-tight">Workspace Identity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Workspace Name
            </label>
            <input
              type="text"
              defaultValue="Markwise Enterprise Global"
              className="w-full p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Subscription Tier
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] font-semibold">
              <span>Enterprise Dedicated</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* API Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
          <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold tracking-tight">API Keys & CI/CD Tokens</h2>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Production API Token (Read/Write)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="password"
              value="mw_live_9f81a7b8e234c01d4a"
              readOnly
              className="flex-1 p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-mono text-[var(--text)] focus:outline-none"
            />
            <button
              onClick={copyApiKey}
              className="px-4 py-3 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--background)] transition-colors inline-flex items-center gap-2 text-[var(--text)]"
            >
              {copiedKey ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Webhook & Notification Integration */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
          <Webhook className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-lg font-bold tracking-tight">Outbound Webhooks</h2>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Approval Dispatch Endpoint URL
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none"
          />
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Receives real-time JSON payloads when marketing copy is approved or flagged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
