// MemeCard.jsx (Final UI with consistent size, glowing hover, win/loss stats)
import React from 'react';

const MemeCard = ({ meme, onUpvote, onDownvote, onBid }) => {
  if (!meme) return null;

  return (
    <div className="w-[300px] h-[420px] bg-[#12001a] border border-pink-500 shadow-[0_0_25px_#ff00ff30] hover:shadow-[0_0_45px_#ff00ff80] transition-all p-4 text-white rounded-xl flex flex-col justify-between">
      <div className="w-full h-[180px] overflow-hidden rounded mb-3">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <h2 className="text-pink-400 text-lg font-bold truncate font-glitch mb-1">
          {meme.title}
        </h2>

        <p className="text-sm text-cyan-300 truncate">
          {meme.tags?.join(', ') || 'No tags'}
        </p>

        <p className="text-sm text-gray-300 line-clamp-2 mt-1">
          💬 {meme.caption || 'No caption'}
        </p>

        <p className="text-xs text-yellow-300 italic mt-1">
          ✨ {meme.vibe || 'No vibe'}
        </p>

        {(meme.win_count !== undefined || meme.loss_count !== undefined) && (
          <p className="text-xs text-cyan-400 mt-1">
            🏆 Wins: {meme.win_count || 0} | ❌ Losses: {meme.loss_count || 0}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 gap-3">
        <button
          onClick={() => onUpvote(meme.id)}
          className="text-neon-green text-2xl hover:scale-110 transition-transform"
          title="Upvote"
        >
          👍
        </button>

        <span className="text-white text-lg font-semibold">
          {meme.upvotes || 0}
        </span>

        <button
          onClick={() => onDownvote(meme.id)}
          className="text-neon-pink text-2xl hover:scale-110 transition-transform"
          title="Downvote"
        >
          👎
        </button>

        <button
          onClick={() => onBid(meme.id)}
          className="text-yellow-400 text-2xl hover:scale-110 transition-transform"
          title="Place Bid"
        >
          💸
        </button>
      </div>
    </div>
  );
};

export default MemeCard;
