import React, { useState } from 'react';
import { authService } from '../../services/authService';
import type { User } from '../../types';
import { CoinIcon } from '../icons/CoinIcon';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Login form state - pre-filled for demo
  const [loginEmail, setLoginEmail] = useState('alex.j@university.edu');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCollegeId, setRegCollegeId] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await authService.login(loginEmail, loginPassword);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
        const user = await authService.register(regName, regEmail, regPassword, regCollegeId);
        onLoginSuccess(user);
    } catch(err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };
  
  const inputBaseClass = "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const buttonBaseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full";


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
            <CoinIcon className="h-10 w-10 text-primary-foreground bg-primary p-2 rounded-full"/>
            <h1 className="text-2xl font-semibold tracking-tight">
                {isLogin ? 'Welcome Back!' : 'Create an Account'}
            </h1>
            <p className="text-sm text-muted-foreground">
                {isLogin ? "Enter your credentials to access your account" : "Enter your details to get started"}
            </p>
        </div>

        {isLogin ? (
          <form className="space-y-4" onSubmit={handleLogin}>
             <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only">Email</label>
                <input type="email" placeholder="Email address" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={inputBaseClass}/>
             </div>
             <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only">Password</label>
                <input type="password" placeholder="Password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={inputBaseClass}/>
             </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <button type="submit" disabled={loading} className={buttonBaseClass}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
             <input type="text" placeholder="Full Name" required value={regName} onChange={e => setRegName(e.target.value)} className={inputBaseClass}/>
             <input type="email" placeholder="Email address" required value={regEmail} onChange={e => setRegEmail(e.target.value)} className={inputBaseClass}/>
             <input type="text" placeholder="College ID" required value={regCollegeId} onChange={e => setRegCollegeId(e.target.value)} className={inputBaseClass}/>
             <input type="password" placeholder="Password" required value={regPassword} onChange={e => setRegPassword(e.target.value)} className={inputBaseClass}/>
             {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <button type="submit" disabled={loading} className={buttonBaseClass}>
                {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="px-8 text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => {setIsLogin(!isLogin); setError(null);}} className="underline underline-offset-4 hover:text-primary">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
        </p>

      </div>
    </div>
  );
};