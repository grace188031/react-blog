import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { JSX } from 'react'; // Importing JSX type for better type inference

// Explicitly declare the return type of the component
export default function CreateAccountPage(): JSX.Element {
  // Specify types for useState to enforce type safety
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  // Add return type for the async function
  async function createAccount(): Promise<void> {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate('/articleslist');
    } catch (e) {
      // Use type assertion to treat error as an Error object
      const errorMessage = (e as Error).message;
      setError(errorMessage);
    }
  }

  return (
    <>
      <h1>Create Account</h1>
      {error && <p>{error}</p>}
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)} // Optional: add (e: React.ChangeEvent<HTMLInputElement>)
      />
      <input
        type="password"
        value={password}
        placeholder="Your password"
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        value={confirmPassword}
        placeholder="Confirm your password"
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <button onClick={createAccount}>Create Account</button>
      <Link to="/login">Already have an Account? Log In</Link>
    </>
  );
}