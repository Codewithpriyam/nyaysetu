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
          colorBackground:   '#233D4D',
          colorInputBackground: '#000000',
          colorInputText:    '#EAECF0',
          colorText:         '#EAECF0',
          colorTextSecondary: '#98A2B3',
          colorPrimary:      '#FE7F2D',
          colorDanger:       '#ef4444',
          colorTextOnPrimaryBackground: '#000000',
          fontFamily:        "'Inter', sans-serif",
          borderRadius:      '12px',
        },
        elements: {
          card:              'bg-[#233D4D] border border-[#EAECF0]/20 shadow-2xl',
          headerTitle:       'font-cormorant text-2xl font-bold text-[#EAECF0]',
          headerSubtitle:    'text-[#98A2B3] text-xs',
          socialButtonsBlockButton: 'bg-[#233D4D] border border-[#EAECF0]/20 text-[#EAECF0] hover:bg-[#172832]',
          socialButtonsBlockButtonText: 'text-[#EAECF0] font-semibold',
          socialButtonsIconButton: 'border border-[#EAECF0]/20 bg-[#233D4D] text-[#EAECF0] hover:bg-[#FE7F2D]/10',
          formButtonPrimary: 'bg-gradient-to-r from-[#FE7F2D] to-[#E86B1A] hover:opacity-90 text-[#000000] font-bold',
          formFieldInput:    'bg-[#000000] border border-[#EAECF0]/25 text-[#EAECF0] focus:border-[#FE7F2D]',
          otpCodeFieldInput: 'bg-[#000000] border border-[#EAECF0]/30 text-[#EAECF0] font-bold focus:border-[#FE7F2D]',
          otpCodeFieldInputBox: 'bg-[#000000] border border-[#EAECF0]/30 text-[#EAECF0] font-bold focus:border-[#FE7F2D]',
          identityPreviewText: 'text-[#EAECF0]',
          identityPreviewEditButtonIcon: 'text-[#FE7F2D]',
          formResendCodeLink: 'text-[#FE7F2D] hover:text-[#FF9750]',
          formFieldLabel:    'text-[#EAECF0] font-medium',
          footerActionLink:  'text-[#FE7F2D] hover:text-[#FF9750]',
          dividerLine:       'bg-[#EAECF0]/20',
          dividerText:       'text-[#98A2B3]',
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
