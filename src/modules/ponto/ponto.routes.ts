import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/rbac';
import * as ctrl from './ponto.controller';

export const pontoRouter = Router();
pontoRouter.use(requireAuth);

// Listar pontos de um local
pontoRouter.get('/local/:localId', ctrl.listar);

// Obter ponto específico (Mestre → qualquer, Player → se Local for visível)
pontoRouter.get('/:id', ctrl.obter);

// CRUD (somente Mestre)
pontoRouter.post('/', requireRole('MESTRE'), ctrl.criar);
pontoRouter.patch('/:id', requireRole('MESTRE'), ctrl.atualizar);
pontoRouter.delete('/:id', requireRole('MESTRE'), ctrl.remover);
