import { Module } from '@nestjs/common';
import { SupabaseService } from './common/supabase/supabase.service';

@Module({
  imports: [],
  controllers: [],
  providers: [SupabaseService],
})
export class AppModule {}
