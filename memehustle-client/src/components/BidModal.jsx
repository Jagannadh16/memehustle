import React, { useState } from 'react';

const BidModal = ({ memeId, onBid, onClose }) => {
  const [credits, setCredits] = useState('');

  const handleConfirm = () => {
    if (credits && !isNaN(credits)) {
      onBid(memeId, parseInt(credits));
      setCredits('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-card-glass p-6 rounded-lg border border-neon-blue w-80">
        <h2 className="text-xl font-glitch text-neon-blue mb-4">💸 Enter Bid Credits</h2>
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="Enter amount"
          className="w-full p-2 mb-4 rounded bg-black border border-neon-pink text-white"
        />
        <div className="flex justify-between">
          <button onClick={handleConfirm} className="bg-neon-blue text-black px-4 py-2 rounded hover:opacity-80">Confirm</button>
          <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
