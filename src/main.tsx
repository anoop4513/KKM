import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import Website from './Website.tsx';
import './website.css';

const root = document.getElementById('root')!;
const application = <StrictMode><Website initialPath={window.location.pathname} /></StrictMode>;
if (root.firstElementChild) hydrateRoot(root, application);
else createRoot(root).render(application);
