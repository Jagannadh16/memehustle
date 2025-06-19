// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 5000;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error('❌ Missing SUPABASE_URL, SUPABASE_KEY or GEMINI_API_KEY in .env');
  process.exit(1);
}

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateCaption(title, tags) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Create a short, funny meme caption and a cyberpunk-style "vibe" for a meme titled: "${title}" with tags: ${tags.join(', ')}`;
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const [captionLine, vibeLine] = text.split('\n').map((line) => line.replace(/^[^:]*:/, '').trim());
    return { caption: captionLine || '', vibe: vibeLine || '' };
  } catch (error) {
    console.error('❌ Gemini caption error:', error.message);
    return { caption: '', vibe: '' };
  }
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let memes = [];

// Load existing memes from Supabase
const loadMemes = async () => {
  const { data, error } = await supabase.rpc('get_memes_with_duel_stats');

  if (error) {
    console.error('❌ Failed to fetch duel-enhanced memes:', error.message);
  } else {
    memes = data || [];
  }
};

loadMemes();

// WebSocket logic
io.on('connection', (socket) => {
  console.log('✅ Connected:', socket.id);

  // Send all memes on request
  socket.on('get-memes', () => {
    socket.emit('all-memes', memes);
  });

  // Create meme and save to Supabase with AI caption and vibe
  socket.on('create-meme', async (meme) => {
    console.log('📥 Received meme:', meme);
    const { caption, vibe } = await generateCaption(meme.title, meme.tags || []);
    const fullMeme = { ...meme, caption, vibe, upvotes: 0 };
    console.log('🧠 With AI:', fullMeme);

    const { data, error } = await supabase.from('memes').insert([fullMeme]).select();

    if (!error && data.length) {
      const newMeme = data[0];
      memes.unshift(newMeme);
      console.log('📡 Emitting new-meme:', newMeme);
      io.emit('new-meme', newMeme);
    } else {
      console.error('❌ Failed to save meme:', error?.message);
    }
  });

  // Upvote logic
  socket.on('upvote', async ({ id }) => {
    const meme = memes.find((m) => m.id === id);
    if (!meme) return;

    const { data, error } = await supabase
      .from('memes')
      .update({ upvotes: (meme.upvotes || 0) + 1 })
      .eq('id', id)
      .select();

    if (!error && data.length) {
      const updated = data[0];
      memes = memes.map((m) => (m.id === id ? updated : m));
      io.emit('vote-update', updated);
    }
  });

  // Downvote logic
  socket.on('downvote', async ({ id }) => {
    const meme = memes.find((m) => m.id === id);
    if (!meme) return;

    const { data, error } = await supabase
      .from('memes')
      .update({ upvotes: Math.max((meme.upvotes || 0) - 1, 0) })
      .eq('id', id)
      .select();

    if (!error && data.length) {
      const updated = data[0];
      memes = memes.map((m) => (m.id === id ? updated : m));
      io.emit('vote-update', updated);
    }
  });

  // Bid logic
  socket.on('place-bid', async ({ memeId, credits }) => {
    console.log(`💸 Bid placed on meme ${memeId} for ${credits} credits.`);

    const { data, error } = await supabase
      .from('bids')
      .insert([{ meme_id: memeId, credits }])
      .select();

    if (error) {
      console.error('❌ Failed to store bid:', error.message);
      socket.emit('bid-error', { message: 'Bid failed' });
    } else {
      console.log('✅ Bid stored:', data[0]);
      socket.emit('bid-success', { message: 'Bid placed successfully!' });
    }
  });

  // Duel vote logic
  socket.on('duel-vote', async ({ winnerId }) => {
    console.log(`🥇 Duel vote for meme ID: ${winnerId}`);

    const meme = memes.find((m) => m.id === winnerId);
    if (!meme) return;

    const { data, error } = await supabase
      .from('memes')
      .update({ upvotes: (meme.upvotes || 0) + 1 })
      .eq('id', winnerId)
      .select();

    if (!error && data.length) {
      const updated = data[0];
      memes = memes.map((m) => (m.id === winnerId ? updated : m));
      io.emit('vote-update', updated);
    } else {
      console.error('❌ Duel vote error:', error?.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 MemeHustle backend running at http://localhost:${PORT}`);
});
