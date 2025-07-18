import { pool } from "../src/db";
import * as readline from "readline";

/**
 * Script d'ajout interactif de produits
 *
 * UTILISATION :
 * - Exécutez : npm run add-interactive
 * - Répondez aux questions pour ajouter un produit
 * - Compatible avec le nouveau schéma SQL optimisé
 *
 * CHAMPS GÉRÉS :
 * - Obligatoires : name, brand, price, sizes
 * - Sélection guidée : type, category, gender
 * - Optionnels : description, stock, color
 * - Auto : is_active=true, autres champs par défaut
 */

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
    console.log("   1. Trail Running");
    console.log("   2. Minimaliste");
    console.log("   3. Casual");
    console.log("   4. Running");
    console.log("   5. Autre");
    const typeChoice = await askQuestion("   Choix (1-5) : ");
    const typeMap = {
      "1": "Trail Running",
      "2": "Minimaliste",
      "3": "Casual",
      "4": "Running",
      "5": "Autre",
    };
    const type = typeMap[typeChoice as keyof typeof typeMap] || "Autre";

    console.log("\n📂 Catégorie :");
    console.log("   1. trail");
    console.log("   2. casual");
    console.log("   3. running");
    console.log("   4. gym");
    console.log("   5. yoga");
    const categoryChoice = await askQuestion("   Choix (1-5) : ");
    const categoryMap = {
      "1": "trail",
      "2": "casual",
      "3": "running",
      "4": "gym",
      "5": "yoga",
    };
    const category =
      categoryMap[categoryChoice as keyof typeof categoryMap] || "casual";

    console.log("\n👫 Genre :");
    console.log("   1. M (Homme)");
    console.log("   2. F (Femme)");
    console.log("   3. U (Unisex)");
    const genderChoice = await askQuestion("   Choix (1-3) : ");
    const genderMap = {
      "1": "M",
      "2": "F",
      "3": "U",
    };
    const gender = genderMap[genderChoice as keyof typeof genderMap] || "U";

    // Champs optionnels
    console.log("\n📝 Description (optionnel) :");
    const description = await askQuestion("   Description : ");

    // Stock par taille
    console.log("\n📦 Stock par taille :");
    console.log(
      "   Entrez le stock pour chaque taille (appuyez sur Entrée pour 0)"
    );
    const stock: number[] = [];

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i];
      const stockInput = await askQuestion(`   📏 Taille ${size} - Stock : `);
      const sizeStock = stockInput ? parseInt(stockInput) : 0;
      stock.push(isNaN(sizeStock) ? 0 : sizeStock);
    }

    console.log("\n🎨 Couleur principale (optionnel) :");
    const color = await askQuestion("   Couleur : ");

    // Validation
    if (!name || !brand || isNaN(price) || sizes.length === 0) {
      console.log("❌ Erreur : Tous les champs sont obligatoires !");
      return;
    }

    // Récapitulatif
    console.log("\n📋 RÉCAPITULATIF :");
    console.log("=".repeat(40));
    console.log(`📝 Nom       : ${name}`);
    console.log(`🏷️  Marque    : ${brand}`);
    console.log(`💰 Prix      : ${price}€`);
    console.log(`📏 Tailles   : ${sizes.join(", ")}`);
    console.log(`🔖 Type      : ${type}`);
    console.log(`📂 Catégorie : ${category}`);
    console.log(`👫 Genre     : ${gender}`);
    if (description) console.log(`📝 Description : ${description}`);

    // Affichage du stock par taille
    console.log("📦 Stock par taille :");
    for (let i = 0; i < sizes.length; i++) {
      console.log(`   📏 Taille ${sizes[i]} : ${stock[i]} unité(s)`);
    }

    if (color) console.log(`🎨 Couleur   : ${color}`);

    const confirm = await askQuestion("\n✅ Confirmer l'ajout ? (o/n) : ");

    if (confirm.toLowerCase() !== "o" && confirm.toLowerCase() !== "oui") {
      console.log("❌ Ajout annulé.");
      return;
    }

    // Insertion en base
    console.log("\n🚀 Ajout en cours...");
    const query = `
      INSERT INTO products (name, brand, price, type, category, gender, sizes, is_active, stock, description, color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;

    const values = [
      name,
      brand,
      price,
      type,
      category,
      gender,
      sizes,
      true, // is_active par défaut
      stock,
      description || null,
      color || null,
    ];
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
