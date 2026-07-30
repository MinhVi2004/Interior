import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import './styles/fonts.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <GoogleOAuthProvider clientId="339327881184-5b9re7d768f7mt2jtluno7c4rbpcfljp.apps.googleusercontent.com">
                    <App />
            </GoogleOAuthProvider>
        </BrowserRouter>
    </StrictMode>
);
