import jwt from "jsonwebtoken";


import { StatusCodes } from "http-status-codes";

const authMiddleware = (req, res, next) => {
  // Récupération du token dans l'en-tête Authorization
  const token = req.header("Authorization");

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message: "Accès refusé. Aucun token fourni.",
      error: "Token manquant",
    });
  }

  try {
    // Vérification et décodage du token
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.jwtSecret,
    );
    req.user = decoded; // Ajoute l'utilisateur décodé à l'objet req

    next(); // Passe à la prochaine étape
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message: "Token invalide ou expiré.",
      error: err.message,
    });
  }
};

export default authMiddleware;
