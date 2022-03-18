import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { initializeApp } from 'firebase/app'
import { useState, useEffect, useContext, createContext } from 'react'
import { store } from '../app'
import { getUserInfo, getUserInfoAction } from '../scenes/Login/actions'

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyD2qJKSLoVaqwQwsO4PwR3elzxTUoHUrds",
  authDomain: "chat-app-29658.firebaseapp.com",
  projectId: "chat-app-29658",
  storageBucket: "chat-app-29658.appspot.com",
  messagingSenderId: "589610924668",
  appId: "1:589610924668:web:8cb8502e4354185d31e7f9"
})

export const AuthContext = createContext()

export const AuthContextProvider = props => {
  const [user, setUser] = useState()
  const [error, setError] = useState()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user);

      if(user){

        console.log('Auth available.');
        store.dispatch(getUserInfoAction());
      } else {
        console.log('Auth NOT available.');
      }

    }, setError)
    return () => unsubscribe()
  }, [])
  return <AuthContext.Provider value={{ user, error }} {...props} />
}

export const useAuthState = () => {
  const auth = useContext(AuthContext)
  return { ...auth, isAuthenticated: auth.user != null }
}
