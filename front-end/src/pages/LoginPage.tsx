import { useState } from 'react' ;
import { Link,useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function logIn() {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            useNavigate('/'); // Redirect to home page after successful login
        } catch (e) {
            setError(e.message);
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
        onChange={e => setEmail(e.target.value)}/>
        <input 
        type="password"
        value={password}
        placeholder="Your password" 
        onChange={e => setPassword(e.target.value)}/>
        <button onClick={logIn}>Log In</button>
        <Link to="/create-account">Don't have an account? Create one here</Link>
        </>
        
    );
}