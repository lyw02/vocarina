import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProduceDto } from './dto/produce.dto';
import { UseCustomSerializer } from 'src/app.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getHello(): string {
    return this.projectsService.getHello();
  }

  @Post('produce')
  @UseCustomSerializer()
  async produce(@Body() produceDto: ProduceDto) {
    await this.projectsService.getAudio(`70c735ab-32ad-42cf-9f88-700968406bdf`, `OTTO EX`);
    const metadata = await this.projectsService.getCachedMetadata()
    // console.log(metadata)
    return { metadata };
    // return produceDto
  }
}
