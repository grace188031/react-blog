import { useState } from 'react' ;
import { Link,useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccountPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function createAccount() {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await createUserWithEmailAndPassword(getAuth(), email, password);
            navigate('/articleslist'); // Redirect to home page after successful login
        } catch (e) {
            setError(e.message);
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
        onChange={e => setEmail(e.target.value)}/>
        <input 
        type="password"
        value={password}
        placeholder="Your password" 
        onChange={e => setPassword(e.target.value)}/>
        <input 
        type="password"
        value={confirmPassword}
        placeholder="Confirm your password" 
        onChange={e => setConfirmPassword(e.target.value)}/>
        <button onClick={createAccount}>Create Account</button>
        <Link to="/login">Already have an Account? Log In</Link>
        </>
        
    );
}