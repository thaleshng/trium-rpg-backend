import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { requireRole } from '../../middlewares/rbac';
import * as ctrl from './ponto.controller';
import { uploadImagemPonto } from './ponto.multer';

export const pontoRouter = Router();
pontoRouter.use(requireAuth);

pontoRouter.get('/local/:localId', ctrl.listar);

pontoRouter.get('/:id', ctrl.obter);

pontoRouter.post('/', requireRole('MESTRE'), ctrl.criar);
pontoRouter.patch('/:id', requireRole('MESTRE'), ctrl.atualizar);
pontoRouter.delete('/:id', requireRole('MESTRE'), ctrl.remover);

pontoRouter.post("/:id/imagem", requireRole("MESTRE"), uploadImagemPonto.single("imagem"), ctrl.uploadImagem);
pontoRouter.delete("/:id/imagem", requireRole("MESTRE"), ctrl.removerImagem);