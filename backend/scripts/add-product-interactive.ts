import { pool } from "../src/db";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function parseSizes(sizeInput: string): number[] {
  return sizeInput
    .split(",")
    .map((s) => parseInt(s.trim()))
    .filter((s) => !isNaN(s));
}

async function addProductInteractive() {
  try {
    console.log("👟 AJOUT D'UN NOUVEAU PRODUIT");
    console.log("=".repeat(40));

    const name = await askQuestion("📝 Nom du produit : ");
    const brand = await askQuestion("🏷️  Marque : ");
    const priceInput = await askQuestion("💰 Prix (€) : ");
    const price = parseFloat(priceInput);

    console.log("\n📏 Tailles disponibles (séparez par des virgules)");
    console.log("   Exemple: 36,37,38,39,40");
    const sizeInput = await askQuestion("   Tailles : ");
    const sizes = parseSizes(sizeInput);

    console.log("\n🔖 Type de chaussure :");
    console.log("   1. minimalist_shoes");
    console.log("   2. zero_drop");
    console.log("   3. casual");
    console.log("   4. autre");
    const typeChoice = await askQuestion("   Choix (1-4) : ");
    const typeMap = {
      "1": "minimalist_shoes",
      "2": "zero_drop",
      "3": "casual",
      "4": "autre",
    };
    const type = typeMap[typeChoice as keyof typeof typeMap] || "autre";

    console.log("\n🏃 Activité :");
    console.log("   1. running");
    console.log("   2. trail");
    console.log("   3. gym");
    console.log("   4. casual");
    console.log("   5. autre");
    const activityChoice = await askQuestion("   Choix (1-5) : ");
    const activityMap = {
      "1": "running",
      "2": "trail",
      "3": "gym",
      "4": "casual",
      "5": "autre",
    };
    const activity =
      activityMap[activityChoice as keyof typeof activityMap] || "autre";

    console.log("\n👫 Genre :");
    console.log("   1. male");
    console.log("   2. female");
    console.log("   3. unisex");
    const genderChoice = await askQuestion("   Choix (1-3) : ");
    const genderMap = {
      "1": "male",
      "2": "female",
      "3": "unisex",
    };
    const gender =
      genderMap[genderChoice as keyof typeof genderMap] || "unisex";

    // Validation
    if (!name || !brand || isNaN(price) || sizes.length === 0) {
      console.log("❌ Erreur : Tous les champs sont obligatoires !");
      return;
    }

    // Récapitulatif
    console.log("\n📋 RÉCAPITULATIF :");
    console.log("=".repeat(40));
    console.log(`📝 Nom      : ${name}`);
    console.log(`🏷️  Marque   : ${brand}`);
    console.log(`💰 Prix     : ${price}€`);
    console.log(`📏 Tailles  : ${sizes.join(", ")}`);
    console.log(`🔖 Type     : ${type}`);
    console.log(`🏃 Activité : ${activity}`);
    console.log(`👫 Genre    : ${gender}`);

    const confirm = await askQuestion("\n✅ Confirmer l'ajout ? (o/n) : ");

    if (confirm.toLowerCase() !== "o" && confirm.toLowerCase() !== "oui") {
      console.log("❌ Ajout annulé.");
      return;
    }

    // Insertion en base
    console.log("\n🚀 Ajout en cours...");
    const query = `
      INSERT INTO products (name, brand, price, type, activity, gender, size) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [name, brand, price, type, activity, gender, sizes];
    const result = await pool.query(query, values);

    console.log(`✅ Produit ajouté avec succès !`);
    console.log(`🆔 ID : ${result.rows[0].id}`);

    // Demander si on veut ajouter un autre produit
    const another = await askQuestion(
      "\n➕ Ajouter un autre produit ? (o/n) : "
    );
    if (another.toLowerCase() === "o" || another.toLowerCase() === "oui") {
      console.log("\n" + "=".repeat(50) + "\n");
      await addProductInteractive(); // Récursion
    }
  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    rl.close();
    await pool.end();
  }
}

console.log("🌟 AJOUT INTERACTIF DE PRODUITS");
console.log("🎯 Répondez aux questions pour ajouter vos produits\n");

addProductInteractive();
