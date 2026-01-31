import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  
  await app.listen(port);
  
  console.log('');
  console.log('🚀 StoryRover Backend is running!');
  console.log(`📡 API Server: http://localhost:${port}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /adventure/start - Start new adventure');
  console.log('  POST /adventure/choice - Make a choice');
  console.log('  GET  /adventure/status - Get current status');
  console.log('  POST /adventure/reset - Reset adventure');
  console.log('  GET  /hardware/test - Test Pi connection');
  console.log('  POST /hardware/test-movement - Test robot movement');
  console.log('');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️  Warning: GEMINI_API_KEY not set. Using mock responses.');
    console.log('   Set it in the .env file for real AI generation.');
    console.log('');
  }
}

bootstrap();
