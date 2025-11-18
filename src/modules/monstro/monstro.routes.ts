import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/rbac';
import * as ctrl from './monstro.controller';

export const monstroRouter = Router();
monstroRouter.use(requireAuth);

// Listar monstros da missão
monstroRouter.get('/missao/:missaoId', ctrl.listarDaMissao);

// Obter monstro específico (MESTRE → qualquer, PLAYER → se visível)
monstroRouter.get('/:id', ctrl.obter);

// CRUD (somente mestre)
monstroRouter.post('/', requireRole('MESTRE'), ctrl.criar);
monstroRouter.patch('/:id', requireRole('MESTRE'), ctrl.atualizar);
monstroRouter.delete('/:id', requireRole('MESTRE'), ctrl.remover);
