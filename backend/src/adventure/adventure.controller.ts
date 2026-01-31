import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdventureService } from './adventure.service';

@Controller('adventure')
export class AdventureController {
  constructor(private readonly adventureService: AdventureService) {}

  @Post('start')
  async startAdventure(@Body() body: { age?: number }) {
    const age = body.age || 10;
    return this.adventureService.startNewAdventure(age);
  }

  @Post('choice')
  async makeChoice(@Body() body: { choice: 'spend' | 'save' | 'invest' }) {
    return this.adventureService.processChoice(body.choice);
  }

  @Get('status')
  getStatus() {
    return this.adventureService.getCurrentStatus();
  }

  @Post('reset')
  reset() {
    return this.adventureService.reset();
  }
}
