// DuelLeaderboard.jsx — Cyberpunk Styled
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const DuelLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('duels')
        .select('meme_id, memes(title), result')
        .eq('result', 'win');

      if (error) {
        console.error('Leaderboard error:', error);
        return;
      }

      const winMap = {};
      data.forEach(({ meme_id, memes }) => {
        const title = memes?.title || 'Untitled';
        if (!winMap[meme_id]) winMap[meme_id] = { title, wins: 0 };
        winMap[meme_id].wins++;
      });

      const sorted = Object.entries(winMap)
        .map(([meme_id, obj]) => ({ meme_id, ...obj }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 10);

      setLeaders(sorted);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="w-full max-w-md bg-[#0f0b1d] border border-cyan-500 p-4 rounded-xl shadow-[0_0_25px_#00ffff50] mt-10">
      <h2 className="text-xl text-cyan-300 font-glitch mb-4 text-center">
        🏆 Meme Duel Leaderboard
      </h2>
      <ul className="text-white space-y-2">
        {leaders.length ? (
          leaders.map((m, i) => (
            <li
              key={m.meme_id}
              className="flex justify-between bg-[#0b0b1f]/70 border border-cyan-800 px-4 py-2 rounded shadow hover:shadow-cyan-400/40 transition-all"
            >
              <span className="text-cyan-200">
                {i + 1}. {m.title}
              </span>
              <span className="text-yellow-300 font-semibold">{m.wins} wins</span>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No wins yet</li>
        )}
      </ul>
    </div>
  );
};

export default DuelLeaderboard;
