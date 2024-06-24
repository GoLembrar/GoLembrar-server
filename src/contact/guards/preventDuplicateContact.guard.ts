import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../../common/utils/types/RequestWithUser';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PreventDuplicateContactGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const { identify } = request.body;
    const userId = request.user.id; //melhorar a busca do id do user, evitar o uso do tipo any

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
