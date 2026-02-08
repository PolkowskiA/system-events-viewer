import { Controller, Get, Query } from '@nestjs/common';
import { EventsQueryDto } from './dto/events-query.dto';
import { EventsService } from './events.service';
import { type EventsPage } from './events.types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  list(@Query() query: EventsQueryDto): EventsPage {
    return this.eventsService.list(query);
  }
}
