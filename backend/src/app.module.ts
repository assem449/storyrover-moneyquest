import { Module } from '@nestjs/common';
import { AdventureModule } from './adventure/adventure.module';
import { HardwareController } from './hardware/hardware.controller';
import { HardwareService } from './hardware/hardware.service';

@Module({
  imports: [AdventureModule],
  controllers: [HardwareController],
  providers: [HardwareService],
})
export class AppModule {}
