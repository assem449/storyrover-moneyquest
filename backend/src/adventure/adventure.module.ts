import { Module } from '@nestjs/common';
import { AdventureController } from './adventure.controller';
import { AdventureService } from './adventure.service';
import { GeminiService } from '../gemini/gemini.service';
import { HardwareService } from '../hardware/hardware.service';
import { ElevenLabsService } from '../elevenlabs/elevenlabs.service';

@Module({
  controllers: [AdventureController],
  providers: [AdventureService, GeminiService, HardwareService, ElevenLabsService],
})
export class AdventureModule {}
