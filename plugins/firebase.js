import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

export default (_ctx, inject) => {
  const firebaseConfig = {
    apiKey: 'AIzaSyCkGB_HRY59EWwQezpDH8SI7fNjIwafZ_s',
    authDomain: 'blockbase-sandbox-team.firebaseapp.com',
    databaseURL: 'https://blockbase-sandbox-team.firebaseio.com',
    projectId: 'blockbase-sandbox-team',
    storageBucket: 'blockbase-sandbox-team.appspot.com',
    messagingSenderId: '837371952785',
    appId: '1:837371952785:web:439973a258ffd19ac5c930',
    measurementId: 'G-HE0GZS4EC5',
  }

  initializeApp(firebaseConfig)
  const auth = getAuth()
  const functions = getFunctions()

  // こちらはローカル用のコードなので組み込み時には不要の可能性があります。
  if (process.env.NODE_ENV !== 'production') {
    connectAuthEmulator(auth, `http://localhost:9099`)
    connectFunctionsEmulator(functions, 'localhost', 5001)
  }

  inject('firebase', { auth, functions })
}
