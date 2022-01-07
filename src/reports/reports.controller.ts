import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { AuthGuard } from '../guards/auth.guard';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { CreateReportDto } from './dtos/create-report';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async create(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  approveReport(
    @Param('id') id: string,
    @Body() { approved }: ApprovedReportDto,
  ) {
    return this.reportsService.changeApproval(id, approved);
  }
}
