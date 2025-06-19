import React, { useState } from 'react';

const MemeForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ title: '', image_url: '', tags: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.image_url) return;
    const tags = form.tags.split(',').map((tag) => tag.trim());
    const memeData = { ...form, tags };
    console.log('🚀 Submitting meme:', memeData);
    onSubmit(memeData);
    setForm({ title: '', image_url: '', tags: '' });
  };

  return (
    <div className="w-full max-w-[350px] border border-cyan-400 rounded-xl p-4 shadow-lg backdrop-blur-sm bg-[#0b0b1f]/70">
      <h2 className="text-neon-pink font-glitch text-xl mb-3">🧠 Create Meme</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter meme title"
          className="w-full bg-black text-white border border-pink-500 p-2 rounded"
        />

        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          placeholder="https://example.com/meme.jpg"
          className="w-full bg-black text-white border border-cyan-400 p-2 rounded"
        />

        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="funny, cyberpunk, ai"
          className="w-full bg-black text-white border border-gray-500 p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded mt-2 transition-all shadow-md hover:shadow-pink-500"
        >
          ⚡ Submit Meme
        </button>
      </form>
    </div>
  );
};

export default MemeForm;