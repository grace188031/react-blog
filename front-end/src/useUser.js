import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const useUser = () => {
    const [isLoading, setIsLoading] = useState(true); //track loading state of Firebase
    const [user, setUser] = useState(null); // track user data that we are getting from Firebase auth

    // Firebase auth state change listener (changes in auth state)
    useEffect(() => {
        // callback function when auth state changes (user logs in or out) or firebase auth loads the current user authentication state
        // need const unsubscribe to avoid memory leaks
        const unsubscribe = onAuthStateChanged(getAuth(), function (user) {
            setUser(user); // set user data
            setIsLoading(false); // set loading state to false
        });

        return unsubscribe; // unsubscribe from the listener when the component unmounts
    }, []); //add arrow dependency to run only once when the component mounts

    return { user, isLoading }; // return user data and loading state
}

export default useUser; // export the hook  