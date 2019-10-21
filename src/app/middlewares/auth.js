import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // pega o segundo item do array desestruturado e descarta o primeiro (bearer)
  const [, token] = authHeader.split(' ');

  try {
    // promisify Transforma(via wrapper) uma função assincrona antiga em padrão novo
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).status({ error: 'Invalid toke.' });
  }
};
