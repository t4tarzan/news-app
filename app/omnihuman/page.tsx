'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface GenerationResult {
  videoUrl?: string;
  error?: string;
}

export default function OmniHumanPage() {
  const [image, setImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !audioFile) return;

    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('audio', audioFile);

      const response = await fetch('/api/sadtalker', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Video generation failed');
      }

      // Get the video blob
      const videoBlob = await response.blob();
      const videoUrl = URL.createObjectURL(videoBlob);
      
      setResult({
        videoUrl,
      });
    } catch (error) {
      console.error('Generation error:', error);
      setResult({
        error: error instanceof Error ? error.message : 'An error occurred during generation'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setAudioFile(null);
    setResult(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              OmniHuman-1 Video Generator
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reference Image
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    required
                  />
                </div>
                {image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Selected: {image.name}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Audio File (for lip-sync and gestures)
                </label>
                <div className="mt-1">
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    required
                  />
                </div>
                {audioFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Selected: {audioFile.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !image || !audioFile}
                  className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${loading || !image || !audioFile 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? 'Generating...' : 'Generate Video'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-6 p-4 border rounded-md">
                {result.error ? (
                  <p className="text-red-600">{result.error}</p>
                ) : result.videoUrl ? (
                  <video
                    controls
                    className="w-full rounded-lg shadow-lg"
                    src={result.videoUrl}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
