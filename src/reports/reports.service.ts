import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(reportDto);
    report.user = user;
    return await this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne(id);
    if (!report) throw new NotFoundException('Report not found');
    report.approved = approved;
    return await this.reportsRepository.save(report);
  }
}
