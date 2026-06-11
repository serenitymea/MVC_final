import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --paper:   #F2EDE4;
    --ink:     #18181A;
    --accent:  #2D2B8F;
    --muted:   #7A7670;
    --border:  #D4CEC5;
    --surface: #EBE5DA;
    --error:   #B5291C;
    --sans:    'Inter', system-ui, sans-serif;
    --mono:    'JetBrains Mono', 'Courier New', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
  }

  input, button, select, textarea {
    font-family: inherit;
  }

  input[type="range"] {
    accent-color: var(--accent);
  }

  input[type="checkbox"] {
    accent-color: var(--accent);
  }

  ::selection {
    background: var(--accent);
    color: var(--paper);
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
