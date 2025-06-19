import React from 'react';
import Home from './pages/Home';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <header className="text-center py-10 border-b border-neon-pink shadow-md">
        {/* Main Glitch Heading */}
        <h2 className="glitch text-5xl text-neon-pink mb-2" data-text="⚡ MemeHustle">
          ⚡ MemeHustle
        </h2>

        {/* Subheading with Orbitron font */}
        <h1 className="font-glitch text-3xl text-neon-blue">
          MemeHustle
        </h1>

        <p className="text-sm text-gray-400 mt-2">
          The AI-Powered Meme Marketplace of Tomorrow
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Home />
      </main>
    </div>
  );
}

export default App;
