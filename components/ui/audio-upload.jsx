'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconMicrophone, IconLoader2, IconUpload, IconFile, IconTrash } from '@tabler/icons-react';

export default function AudioUpload({ onTranscriptReceived, disabled = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/flac', 'audio/ogg', 'audio/webm'];
  const maxSize = 100 * 1024 * 1024;

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Supported: WAV, MP3, MP4, M4A, FLAC, OGG, WebM';
    }
    if (file.size > maxSize) {
      return `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`;
    }
    return null;
  };

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transcription failed');
      }

      const result = await response.json();

      onTranscriptReceived(result.transcript, {
        language: result.language,
        duration: result.metadata?.duration,
        confidence: result.metadata?.confidence,
        source: 'audio',
        filename: selectedFile.name
      });

      setSelectedFile(null);

    } catch (error) {
      console.error('Audio upload error:', error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    if (disabled) return;
    handleFiles(e.target.files);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <IconMicrophone className="h-5 w-5 text-green-600" />
          Audio Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-green-500 bg-green-50/5'
                : 'border-zinc-700 hover:border-zinc-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragEnter={(e) => {
              e.preventDefault();
              if (!disabled) setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="space-y-3">
              <div className="text-4xl">🎤</div>
              <div>
                <h3 className="text-lg font-semibold text-white">Upload Audio File</h3>
                <p className="text-zinc-400 mt-2">
                  Drag and drop your audio file here, or click to browse
                </p>
                <p className="text-sm text-zinc-500 mt-1">
                  Supports WAV, MP3, MP4, M4A, FLAC, OGG, WebM (max 100MB)
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleChange}
                className="hidden"
                disabled={disabled || isUploading}
              />

              <Button
                disabled={disabled || isUploading}
                className="bg-green-600 hover:bg-green-700 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <IconUpload className="mr-2 h-4 w-4" />
                Choose Audio File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-3">
                <IconFile className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-zinc-400 text-sm">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFile}
                disabled={isUploading}
                className="text-zinc-400 hover:text-red-400"
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={uploadFile}
                disabled={isUploading || disabled}
                className="flex-1 bg-green-600 hover:bg-green-700 text-black"
              >
                {isUploading ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transcribing Audio...
                  </>
                ) : (
                  <>
                    <IconMicrophone className="mr-2 h-4 w-4" />
                    Transcribe Audio
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearFile}
                disabled={isUploading}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}