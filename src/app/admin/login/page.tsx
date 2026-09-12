'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-sm border border-border">
        <h1 className="text-2xl font-heading text-primary mb-6 text-center">Admin Access</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-secondary text-sm mb-2">Secret Password</label>
            <input 
              type="password" 
              name="password" 
              required
              className="w-full bg-background border border-border px-4 py-2 text-primary focus:border-accent outline-none"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-white py-3 mt-4 hover:bg-white hover:text-accent transition-colors font-heading tracking-widest uppercase text-sm"
          >
            {loading ? 'Entering...' : 'Enter Studio'}
          </button>
        </form>
      </div>
    </div>
  );
}
