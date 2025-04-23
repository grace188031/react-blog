import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { JSX } from 'react'; // Importing JSX type for better type inference

// ✅ Added return type for functional component
export default function LoginPage(): JSX.Element {
  // ✅ Added generic types to useState to explicitly define the state variable types
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  // ✅ Added return type for async function
  async function logIn(): Promise<void> {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate('/articleslist');
    } catch (e) {
      // ✅ Type assertion to ensure 'e' is treated as an Error object for accessing `.message`
      const errorMessage = (e as Error).message;
      setError(errorMessage);
    }
  }

  return (
    <>
      <h1>Log In</h1>
      {error && <p>{error}</p>}
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Your password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={logIn}>Log In</button>
      <Link to="/create-account">Don't have an account? Create one here</Link>
    </>
  );
}