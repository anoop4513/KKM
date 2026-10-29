import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './global.css';
const root = document.getElementById('root')!;
const content = <React.StrictMode><App /></React.StrictMode>;
if (root.firstElementChild) hydrateRoot(root, content);
else createRoot(root).render(content);
