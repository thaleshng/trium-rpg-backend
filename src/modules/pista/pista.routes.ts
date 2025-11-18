import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/rbac';
import * as ctrl from './pista.controller';

export const pistaRouter = Router();
pistaRouter.use(requireAuth);

// Listar pistas de um ponto
pistaRouter.get('/ponto/:pontoId', ctrl.listar);

// Obter pista específica (Mestre → qualquer, Player → se visível)
pistaRouter.get('/:id', ctrl.obter);

// CRUD (somente Mestre)
pistaRouter.post('/', requireRole('MESTRE'), ctrl.criar);
pistaRouter.patch('/:id', requireRole('MESTRE'), ctrl.atualizar);
pistaRouter.delete('/:id', requireRole('MESTRE'), ctrl.remover);
