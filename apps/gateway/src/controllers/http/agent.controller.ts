import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from '@app/common/decorators';
import { Request } from 'express';
import { CreateAgentDto } from '../../dto/agent/create-agent.dto';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../../guards/access-token.guard';
import { JwtPayloadDto } from '../../dto/auth/jwt-payload.dto';
import { AgentService } from '../../services/agent.service';
import { AgentDto, AgentRole, ApiResponse } from '@app/common/dto-generic';
import { GetAccountAgentsResponse } from '@app/common/grpc/models/agent/get-account-agents.model';

@Controller('agent')
export class AgentHttpController {
  constructor(private readonly agentService: AgentService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER)
  @Post()
  createAgent(
    @Req() req: Request,
    @Body() dto: CreateAgentDto,
  ): Observable<ApiResponse<AgentDto | null>> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return this.agentService.createAgent(jwtPaylaod, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(AgentRole.OWNER, AgentRole.ADMIN)
  @Get()
  async getAccountAgents(
    @Req() req: Request,
  ): Promise<Observable<GetAccountAgentsResponse>> {
    const jwtPaylaod = req['user'] as JwtPayloadDto;
    return await this.agentService.getAccountAgents(jwtPaylaod);
  }
}
