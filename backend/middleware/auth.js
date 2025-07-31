import jwt from 'jsonwebtoken';

export const authenticate = (roles = []) => {
  // roles param can be a single role string (e.g. 'Admin') or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};