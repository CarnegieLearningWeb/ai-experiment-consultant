import { Router } from 'express';

export const uploadsRouter = Router();

// TODO(uploads) M3: accept multipart/form-data with multer, save under server/uploads/<id>,
// return { id, mimeType, size }. Type allowlist: image/png, image/jpeg, image/webp.
uploadsRouter.post('/', (_req, res) => {
  res.status(501).json({
    error: {
      code: 'not_implemented',
      message: 'uploads not yet implemented (M3)',
    },
  });
});
