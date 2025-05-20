import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EvolutionApiService } from './evolutionApi.service';

@Module({
  imports: [HttpModule],
  providers: [EvolutionApiService],
  exports: [EvolutionApiService],
  
})

export class EvolutionApiModule {}