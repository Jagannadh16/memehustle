import React from 'react';

const Leaderboard = ({ memes }) => {
  const topMemes = [...memes].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  return (
    <div className="bg-black/50 border border-neon-blue p-4 rounded-xl shadow-md backdrop-blur">
      <h3 className="text-xl font-bold text-neon-blue glitch mb-3" data-text="🏆 Top Memes">🏆 Top Memes</h3>
      <ul className="space-y-2">
        {topMemes.map((meme, idx) => (
          <li key={meme.id} className="flex justify-between text-sm">
            <span className="text-white">#{idx + 1} {meme.title}</span>
            <span className="text-neon-pink font-semibold">{meme.upvotes} 🔥</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
