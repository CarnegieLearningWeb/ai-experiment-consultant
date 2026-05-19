import { Router } from 'express';

export const reportRouter = Router();

// TODO(report) M5: hybrid template + AI generation per docs/architecture.md and spec §28.
reportRouter.post('/', (_req, res) => {
  res.status(501).json({
    error: {
      code: 'not_implemented',
      message: 'report not yet implemented (M5)',
    },
  });
});
