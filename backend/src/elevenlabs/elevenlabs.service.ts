import { Injectable } from '@nestjs/common';
import { ElevenLabsClient } from 'elevenlabs';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

@Injectable()
export class ElevenLabsService {
  private client: ElevenLabsClient | null = null;
  private voiceId = 'cgSgspJ2msm6clMCkdW9';

  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  ELEVENLABS_API_KEY not found. Voice disabled.');
      return;
    }
    this.client = new ElevenLabsClient({ apiKey });
    console.log('✅ ElevenLabs initialized');
  }

  async speak(text: string, emotion: string = 'neutral'): Promise<void> {
    if (!this.client) {
      console.log(`🔇 Would speak: "${text}" (ElevenLabs not configured)`);
      return;
    }

    let stability = 0.5;
    let similarityBoost = 0.5;

    if (emotion === 'happy' || emotion === 'excited') {
      stability = 0.3;
      similarityBoost = 0.8;
    } else if (emotion === 'sad') {
      stability = 0.7;
      similarityBoost = 0.5;
    }

    try {
      console.log(`🎤 Generating speech: "${text.substring(0, 50)}..."`);

      const audioStream = await this.client.textToSpeech.convert(this.voiceId, {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      });

      const audioPath = path.join(__dirname, '..', '..', 'tmp_speech.mp3');
      const chunks: Buffer[] = [];

      for await (const chunk of audioStream as AsyncIterable<Buffer>) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      fs.writeFileSync(audioPath, Buffer.concat(chunks));
      console.log('✅ Audio saved, playing...');

      // Play audio based on OS
      const platform = process.platform;
      if (platform === 'darwin') {
        execSync(`afplay ${audioPath}`);       // Mac
      } else if (platform === 'win32') {
        execSync(`start ${audioPath}`);        // Windows
      } else {
        execSync(`aplay ${audioPath}`);        // Linux
      }

      console.log('✅ Speech played');
    } catch (error) {
      console.error('❌ ElevenLabs error:', error.message);
    }
  }
}