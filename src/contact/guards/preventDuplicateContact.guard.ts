import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PreventDuplicateContactGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request | any = context.switchToHttp().getRequest();
    const { identify } = request.body;
    const userId = request.user.id; 

    const contact = await this.prisma.contact.findFirst({
      where: {
        identify,
        userId,
      },
    });
    /* dessa forma garante que quando for fazer o filtro se existe ou não
    um contato, verifique somente para o usuario atual logado e não para todos os contatos existentes */
    if (contact) throw new ConflictException('Contato já cadastrado');
    return true;
  }
}
