import { Router } from 'express';

export const chatRouter = Router();

// TODO(chat) M2: call Anthropic with messages + curated upgrade-knowledge context.
chatRouter.post('/', (_req, res) => {
  res.status(501).json({
    error: {
      code: 'not_implemented',
      message: 'chat is not yet implemented (M2)',
    },
  });
});
