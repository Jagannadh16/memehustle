// MemeDuel.jsx with Refactored Shuffle & ESLint-Safe Hooks
import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000');

const shufflePair = (memes) => {
  const shuffled = [...memes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
};

const MemeDuel = ({ memes }) => {
  const [pair, setPair] = useState([]);
  const [voted, setVoted] = useState(false);
  const [timer, setTimer] = useState(15);
  const [rounds, setRounds] = useState(0);

  const refreshPair = useCallback(() => {
    const newPair = shufflePair(memes);
    setPair(newPair);
    setVoted(false);
  }, [memes]);

  useEffect(() => {
    if (memes.length >= 2) refreshPair();
  }, [memes, refreshPair]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          refreshPair();
          setRounds((r) => r + 1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [refreshPair]);

  const handleVote = (winnerId) => {
    if (!voted && pair.length === 2) {
      const loserId = pair.find((m) => m.id !== winnerId)?.id;
      const winner = pair.find((m) => m.id === winnerId);
      socket.emit('duel-vote', { winnerId, loserId });
      setVoted(true);
      toast.success(`🗳️ You voted: ${winner?.title || 'Meme'}`);
    }
  };

  if (pair.length < 2) return null;

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <div className="text-pink-400 font-glitch text-xl">
        Round {rounds + 1} — Next duel in: {timer}s
      </div>
      <div className="relative flex items-center justify-center gap-16 flex-wrap">
        {pair.map((meme) => (
          <div
            key={meme.id}
            onClick={() => handleVote(meme.id)}
            className={`w-[300px] h-[420px] p-3 rounded-xl cursor-pointer transition-transform transform hover:scale-105 border-2 flex flex-col justify-between shadow-[0_0_25px_#ff00ff30] hover:shadow-[0_0_45px_#ff00ff80] bg-[#12001a] text-white
              ${voted ? (meme.id === pair[0].id ? 'border-green-400' : 'border-red-400') : 'border-pink-500'}`}
          >
            <div className="w-full h-[180px] overflow-hidden rounded mb-2">
              <img
                src={meme.image_url}
                alt={meme.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <h2 className="text-pink-400 text-lg font-bold truncate font-glitch">
                {meme.title}
              </h2>
              <p className="text-sm text-cyan-300 line-clamp-2 mb-1">
                {meme.caption || 'No caption'}
              </p>
              <p className="text-xs text-yellow-300">
                🏆 Wins: {meme.win_count || 0} | ❌ Losses: {meme.loss_count || 0}
              </p>
            </div>
          </div>
        ))}

        {/* VS Symbol with Glow Effect */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neon-blue text-5xl font-glitch animate-pulse select-none pointer-events-none drop-shadow-[0_0_15px_#00ffff]">
          VS
        </div>
      </div>
    </div>
  );
};

export default MemeDuel;
