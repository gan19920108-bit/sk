import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createPinia } from 'pinia';
import App from './App';
import './global.css';

const mountApp = () => {
  const appElement = document.getElementById('app');
  if (appElement) {
    const root = createRoot(appElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
};

$(() => {
  mountApp();
});
