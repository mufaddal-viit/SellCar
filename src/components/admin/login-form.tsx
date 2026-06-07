'use client';

import { useEffect, useState } from 'react';
import { Lock, Mail, Loader2, Check } from 'lucide-react';
import { requestAdminOtp, verifyAdminOtp } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const res = await requestAdminOtp(email);
      if (res.error) setError(res.error);
      else {
        setSent(true);
        setCooldown(30);
      }
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    setError(null);
    setVerifying(true);
    try {
      const res = await verifyAdminOtp(email, otp);
      if (res.error) setError(res.error);
      else if (res.ok) window.location.assign('/admin');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Admin email</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={sent}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@buyanddrive.ae"
          />
          {!sent && (
            <Button type="button" variant="outline" onClick={sendCode} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Send code
            </Button>
          )}
        </div>
      </div>

      {sent && (
        <div className="space-y-2">
          <Label htmlFor="otp">Verification code</Label>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit code"
            className="tracking-[0.4em]"
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={cooldown > 0 || sending}
            className="text-xs text-white/45 hover:text-white disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {sent ? (
        <Button
          type="button"
          size="lg"
          className="w-full"
          onClick={verify}
          disabled={verifying || otp.length !== 6}
        >
          {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Verify & sign in
        </Button>
      ) : (
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/40">
          <Lock className="h-3 w-3" />
          Secure email-OTP login
        </p>
      )}
    </div>
  );
}
