// Home.jsx — includes Meme Duel and updates with win/loss stats
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import MemeForm from '../components/MemeForm';
import MemeCard from '../components/MemeCard';
import BidModal from '../components/BidModal';
import Leaderboard from '../components/Leaderboard';
import MemeDuel from '../components/MemeDuel';
import { motion } from 'framer-motion';

const socket = io('http://localhost:5000');

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedMemeId, setSelectedMemeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    socket.emit('get-memes');

    socket.on('all-memes', (data) => {
      console.log('📦 All memes:', data);
      setMemes(data);
    });

    socket.on('new-meme', (meme) => {
      console.log('🆕 New meme received:', meme);
      setMemes((prev) => [meme, ...prev]);
      setLoading(false);
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    socket.on('vote-update', (updated) => {
      setMemes((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    });

    socket.on('bid-success', (res) => toast.success(res.message));
    socket.on('bid-error', (res) => toast.error(res.message));

    return () => {
      socket.off('get-memes');
      socket.off('new-meme');
      socket.off('all-memes');
      socket.off('vote-update');
      socket.off('bid-success');
      socket.off('bid-error');
    };
  }, []);

  const handleCreateMeme = (meme) => {
    setLoading(true);
    toast.loading('🧠 Generating caption...');
    socket.emit('create-meme', meme);
  };

  const handleUpvote = (id) => socket.emit('upvote', { id });
  const handleDownvote = (id) => socket.emit('downvote', { id });
  const handleBid = (memeId, credits) => {
    socket.emit('place-bid', { memeId, credits });
    setShowBidModal(false);
  };

  return (
    <div className="flex flex-col items-center gap-12 px-6 py-6 max-w-7xl mx-auto">
      <Toaster position="top-right" />

      {/* Top Row: Form + Leaderboard + Feed */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 w-full">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 w-full md:w-[400px] bg-[#12001a] border border-pink-500 rounded-xl shadow-xl p-4"
        >
          <MemeForm onSubmit={handleCreateMeme} />
          {loading && (
            <div className="text-white text-center animate-pulse">
              🧠 AI is crafting your meme...
            </div>
          )}
          <Leaderboard memes={memes} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 w-full md:w-[400px]"
        >
          <div ref={scrollRef} />
          {memes.map((meme, index) => (
            <motion.div
              key={meme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <MemeCard
                meme={meme}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onBid={() => {
                  setSelectedMemeId(meme.id);
                  setShowBidModal(true);
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Row: Meme Duel */}
      <div className="mt-8 w-full flex flex-col items-center">
        <h2 className="text-2xl font-glitch text-neon-pink mb-4">🥊 Meme Duel Arena</h2>
        <MemeDuel memes={memes} />
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <BidModal
          memeId={selectedMemeId}
          onBid={handleBid}
          onClose={() => setShowBidModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
