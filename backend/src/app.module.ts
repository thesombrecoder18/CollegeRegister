import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EcoleModule } from './ecole/ecole.module';
import { InscriptionModule } from './inscription/inscription.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { AuditModule } from './audit/audit.module';
import { UtilisateurModule } from './utilisateur/utilisateur.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limiting : 20 requêtes / 60 secondes par IP (routes publiques)
    ThrottlerModule.forRoot([
      {
        name: 'public',
        ttl: 60_000,  // fenêtre de 60 secondes
        limit: 20,    // max 20 requêtes par IP
      },
    ]),
    PrismaModule,
    AuthModule,
    EcoleModule,
    InscriptionModule,
    ConfigurationModule,
    SuperadminModule,
    AuditModule,
    UtilisateurModule,
  ],
  providers: [
    // ThrottlerGuard en premier pour bloquer avant l'auth
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
  ],
})
export class AppModule {}
