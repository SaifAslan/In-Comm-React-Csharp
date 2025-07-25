// Entry point for the React application
import React from "react"; 
import ReactDOM from "react-dom/client"; 
import { Provider } from "react-redux"; 
import App from "./App"; 
import { store } from "./Redux/store"; 
import "./index.css"; 

// Create root element for rendering
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Render the application
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>
);
