import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import * as ctrl from './personagem.controller';

export const personagemRouter = Router();
personagemRouter.use(requireAuth);

// Listar personagens da missão (MESTRE → todos, PLAYER → só o seu)
personagemRouter.get('/missao/:missaoId', ctrl.listarDaMissao);

// Criar personagem (MESTRE → qualquer, PLAYER → apenas o próprio)
personagemRouter.post('/', ctrl.criar);

// Obter / Atualizar / Remover
personagemRouter.get('/:id', ctrl.obter);
personagemRouter.patch('/:id', ctrl.atualizar);
personagemRouter.delete('/:id', ctrl.remover); // apenas Mestre (validado no service)
