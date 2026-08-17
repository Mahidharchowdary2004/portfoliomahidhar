export interface AdminTokenPayload {
  id: string;
  username: string;
}

// Augment Express's Request type so req.admin is recognized everywhere
// without needing a cast at every route.
declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export {};
