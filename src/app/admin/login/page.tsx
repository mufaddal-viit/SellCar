import { Logo } from '@/components/shared/logo';
import { LoginForm } from '@/components/admin/login-form';

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-8">
          <h1 className="display-heading text-2xl text-white">Admin Login</h1>
          <p className="mt-1 mb-6 text-sm text-white/50">
            Sign in to manage inventory and leads.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
