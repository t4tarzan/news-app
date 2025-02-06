'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  headline: string;
  imageUrl: string;
  date: string;
}

export default function Archive() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts);
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">News Archive</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            Add New Headline
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
              <img
                src={post.imageUrl}
                alt={post.headline}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.headline}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No headlines yet. Start by adding your first headline!
          </p>
        )}
      </div>
    </main>
  );
}
