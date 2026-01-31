import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface HardwareCommand {
  text: string;
  zone: 'red' | 'blue' | 'yellow' | 'center';
  emotion: 'happy' | 'sad' | 'neutral' | 'excited';
}

@Injectable()
export class HardwareService {
  private raspberryPiUrl: string;

  constructor() {
    this.raspberryPiUrl = process.env.RASPBERRY_PI_URL || 'http://192.168.1.50:5000';
  }

  async sendCommand(command: HardwareCommand): Promise<boolean> {
    try {
      console.log(`📡 Sending command to Pi (${this.raspberryPiUrl}):`, command);
      
      const response = await axios.post(
        `${this.raspberryPiUrl}/command`,
        command,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('✅ Hardware responded:', response.data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Hardware connection failed:', error.message);
        if (error.code === 'ECONNREFUSED') {
          console.error(`   Make sure Raspberry Pi is running at ${this.raspberryPiUrl}`);
        }
      } else {
        console.error('❌ Unknown error:', error);
      }
      
      // Don't fail the request if hardware is unavailable (for testing without Pi)
      return false;
    }
  }

  async testConnection(): Promise<{ connected: boolean; url: string; message: string }> {
    try {
      await axios.get(`${this.raspberryPiUrl}/health`, { timeout: 3000 });
      return {
        connected: true,
        url: this.raspberryPiUrl,
        message: 'Successfully connected to Raspberry Pi'
      };
    } catch (error) {
      return {
        connected: false,
        url: this.raspberryPiUrl,
        message: `Cannot connect to Raspberry Pi at ${this.raspberryPiUrl}. Make sure it's running and on the same network.`
      };
    }
  }

  getZoneFromChoice(choice: 'spend' | 'save' | 'invest'): 'red' | 'blue' | 'yellow' {
    const zoneMap = {
      spend: 'red' as const,
      save: 'blue' as const,
      invest: 'yellow' as const,
    };
    return zoneMap[choice];
  }
}
