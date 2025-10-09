import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe :", error);
    throw error;
  }
};

export const sanitizeUserData =(user) =>{
  // Crée une copie de l'objet user sans les champs 'password' et 'email'
  const { password, email, createdAt, updatedAt, ...sanitizedUser } = user;

  // Retourne l'objet sans les informations sensibles
  return sanitizedUser;
}