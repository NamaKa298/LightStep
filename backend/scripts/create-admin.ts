import bcrypt from "bcryptjs";
import { pool } from "../src/db";

async function createAdminUser() {
  try {
    console.log("🔐 Création de l'utilisateur administrateur...");

    const email = "admin@lightstep.com"; // Changez ça par votre email !
    const password = "admin123"; // Changez ça par votre mot de passe !

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Supprimer l'ancien admin s'il existe
    await pool.query("DELETE FROM users WHERE email = $1", [email]);

    // Créer le nouvel admin
    const { rows } = await pool.query(
      `INSERT INTO users (email, password, role) 
       VALUES ($1, $2, 'admin') 
       RETURNING id, email, role, created_at`,
      [email, hashedPassword]
    );

    console.log("✅ Utilisateur administrateur créé :");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Mot de passe: ${password}`);
    console.log(`🛡️ Rôle: admin`);
    console.log(
      "\n⚠️  IMPORTANT: Changez le mot de passe après le premier test !"
    );
  } catch (error) {
    console.error("❌ Erreur lors de la création de l'admin:", error);
  } finally {
    await pool.end();
  }
}

createAdminUser();
