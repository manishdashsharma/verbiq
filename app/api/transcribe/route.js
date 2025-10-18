import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🎤 Starting audio transcription for user:', session.user.email);

    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const language = formData.get('language');

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    const allowedTypes = [
      'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4',
      'audio/m4a', 'audio/flac', 'audio/ogg', 'audio/webm'
    ];

    if (!allowedTypes.includes(audioFile.type)) {
      console.error('❌ Invalid file type:', audioFile.type);
      return NextResponse.json({
        error: 'Invalid file type. Supported formats: WAV, MP3, MP4, M4A, FLAC, OGG, WebM'
      }, { status: 400 });
    }

    const maxSize = 100 * 1024 * 1024;
    if (audioFile.size > maxSize) {
      console.error('❌ File too large:', audioFile.size);
      return NextResponse.json({
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      }, { status: 400 });
    }

    console.log(`📁 Processing audio file: ${audioFile.name} (${(audioFile.size / 1024 / 1024).toFixed(2)}MB)`);

    const whisperFormData = new FormData();
    whisperFormData.append('audio', audioFile);
    if (language) {
      whisperFormData.append('language', language);
    }

    const whisperApiUrl = process.env.WHISPER_API_URL;
    if (!whisperApiUrl) {
      console.error('❌ WHISPER_API_URL not configured');
      return NextResponse.json({
        error: 'Transcription service not configured'
      }, { status: 500 });
    }

    console.log('🚀 Sending request to Whisper API:', whisperApiUrl);

    const whisperResponse = await fetch(`${whisperApiUrl}/transcribe`, {
      method: 'POST',
      body: whisperFormData,
      headers: {},
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('❌ Whisper API error:', whisperResponse.status, errorText);

      return NextResponse.json({
        error: 'Transcription failed',
        details: whisperResponse.status === 413 ? 'File too large' : 'Service temporarily unavailable'
      }, { status: whisperResponse.status });
    }

    const result = await whisperResponse.json();

    console.log('✅ Transcription completed successfully');
    console.log(`📊 Processing time: ${result.processing_time}s, Language: ${result.language}, Confidence: ${result.confidence}`);

    return NextResponse.json({
      success: true,
      transcript: result.text,
      language: result.language,
      segments: result.segments,
      metadata: {
        duration: result.duration,
        processing_time: result.processing_time,
        confidence: result.confidence,
        filename: audioFile.name,
        filesize: audioFile.size
      }
    });

  } catch (error) {
    console.error('❌ Transcription error:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return NextResponse.json({
        error: 'Unable to connect to transcription service'
      }, { status: 503 });
    }

    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}