import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/rbac';
import * as ctrl from './local.controller';

export const localRouter = Router();
localRouter.use(requireAuth);

// Listar locais de uma missão
localRouter.get('/missao/:missaoId', ctrl.listarDaMissao);

// Obter local pelo ID (Mestre → qualquer, Player → visível)
localRouter.get('/:id', ctrl.obter);

// CRUD restrito ao Mestre
localRouter.post('/', requireRole('MESTRE'), ctrl.criar);
localRouter.patch('/:id', requireRole('MESTRE'), ctrl.atualizar);
localRouter.delete('/:id', requireRole('MESTRE'), ctrl.remover);
