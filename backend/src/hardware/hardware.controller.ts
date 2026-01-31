import { Controller, Get, Post, Body } from '@nestjs/common';
import { HardwareService } from './hardware.service';

@Controller('hardware')
export class HardwareController {
  constructor(private readonly hardwareService: HardwareService) {}

  @Get('test')
  async testConnection() {
    return this.hardwareService.testConnection();
  }

  @Post('test-movement')
  async testMovement(@Body() body: { zone: 'red' | 'blue' | 'yellow' | 'center' }) {
    const result = await this.hardwareService.sendCommand({
      text: `Testing movement to ${body.zone} zone`,
      zone: body.zone,
      emotion: 'neutral'
    });
    
    return {
      success: result,
      message: result ? 'Command sent successfully' : 'Failed to send command (Pi might be offline)'
    };
  }
}
