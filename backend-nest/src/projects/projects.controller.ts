import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProduceDto } from './dto/produce.dto';

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getHello(): string {
    return this.projectsService.getHello();
  }

  @Post("produce")
  produce(@Body() produceDto: ProduceDto) {
    return produceDto
  }
}
