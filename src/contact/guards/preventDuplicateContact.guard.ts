import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { concat } from 'rxjs';

@Injectable()
export class PreventDuplicateContactGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { identify } = request.body;

    const contact = await this.prisma.contact
      .findFirst({
        where: {
          identify,
        },
      })
      .catch(console.log);
    if (concat) throw new ConflictException('Contato já cadastrado');
    return true;
  }
}
