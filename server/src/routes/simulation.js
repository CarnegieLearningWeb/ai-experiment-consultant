import { Router } from 'express';

export const simulationRouter = Router();

// TODO(simulation) M4: orchestrate create -> start -> simulate cohort -> fetch -> delete
// against the UpGrade demo backend. See docs/upgrade-knowledge/simulation-api.md.
simulationRouter.post('/', (_req, res) => {
  res.status(501).json({
    error: {
      code: 'not_implemented',
      message: 'simulation not yet implemented (M4)',
    },
  });
});
