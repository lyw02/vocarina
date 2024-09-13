import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectsController } from './projects.controller';
import { FileService, ProjectsService } from './projects.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [ProjectsController],
  providers: [ProjectsService, FileService],
})
export class ProjectsModule {}
