/**
 * NyayaSetu — Application Entry Point
 * Imports GSAP config first, then mounts the React app.
 * Wrapped with ClerkProvider for authentication.
 */
import { StrictMode }       from 'react';
import { createRoot }       from 'react-dom/client';
import { BrowserRouter }    from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider }    from '@clerk/clerk-react';

// MUST be imported before any component that uses GSAP
import './animations/gsap-config.js';

import './index.css';
import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry:                1,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={{
        variables: {
          colorBackground:   '#0a0e1a',
          colorInputBackground: '#101628',
          colorText:         '#f0e9d8',
          colorTextSecondary: '#9a9178',
          colorPrimary:      '#C89B52',
          colorDanger:       '#ef4444',
          fontFamily:        "'Inter', sans-serif",
          borderRadius:      '12px',
        },
        elements: {
          card:              'bg-[#0e1527] border border-[#C89B52]/30 shadow-2xl',
          headerTitle:       'font-cormorant text-2xl font-bold text-[#f0e9d8]',
          headerSubtitle:    'text-[#9a9178] text-xs',
          socialButtonsIconButton: 'border border-[#C89B52]/30 bg-[#0a0e1a] hover:bg-[#C89B52]/10',
          formButtonPrimary: 'bg-gradient-to-r from-[#D9A758] to-[#C89B52] hover:opacity-90 text-white font-bold',
          formFieldInput:    'bg-[#0a0e1a] border border-[#C89B52]/30 text-[#f0e9d8] focus:border-[#C89B52]',
          footerActionLink:  'text-[#C89B52] hover:text-[#D9A758]',
          dividerLine:       'bg-[#C89B52]/20',
          dividerText:       'text-[#9a9178]',
        },
      }}
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
