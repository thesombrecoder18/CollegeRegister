import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ConfigurationService } from './configuration.service';
import { UpdateConfigurationDto } from './dto/configuration.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

@SkipThrottle()
@Controller('configuration')
export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}

  @Roles(RoleUser.GERANT)
  @Get()
  get(@CurrentUser() user: JwtPayload) {
    return this.configurationService.getForEcole(user);
  }

  @Roles(RoleUser.GERANT)
  @Patch()
  update(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateConfigurationDto,
  ) {
    return this.configurationService.update(user, dto);
  }
}
