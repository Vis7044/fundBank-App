import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "./utils/ThemeProvider";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <div className="bg-white dark:bg-gray-900 transition-colors min-h-screen flex flex-col">
          
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1">
            <AppRoutes />
          </main>

          {/* Footer */}
          <Footer />

        </div>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
