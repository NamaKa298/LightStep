// Test de l'API
async function testAPI() {
  const baseURL = "http://localhost:3001";

  try {
    console.log("🧪 Test de l'API LightStep...\n");

    // Test 1: Route de base
    console.log("📍 Test 1: Route de base (/)");
    const response1 = await fetch(baseURL);
    const data1 = await response1.json();
    console.log("✅ Statut:", response1.status);
    console.log("📄 Réponse:", JSON.stringify(data1, null, 2));
    console.log("");

    // Test 2: Route de santé
    console.log("📍 Test 2: Route de santé (/health)");
    const response2 = await fetch(`${baseURL}/health`);
    const data2 = await response2.json();
    console.log("✅ Statut:", response2.status);
    console.log("📄 Réponse:", JSON.stringify(data2, null, 2));
    console.log("");

    // Test 3: Route des produits
    console.log("📍 Test 3: Liste des produits (/api/products)");
    const response3 = await fetch(`${baseURL}/api/products`);
    const data3 = await response3.json();
    console.log("✅ Statut:", response3.status);
    console.log("📄 Réponse:", JSON.stringify(data3, null, 2));

    // Test 4: Ajouter un produit via POST
    console.log("\n📍 Test 4: Ajouter un produit via POST");
    const newProduct = {
      name: "Test Shoe via API",
      brand: "Test Brand",
      price: 75.0,
      type: "test",
      activity: "testing",
      gender: "unisex",
      size: [38, 39, 40],
    };

    const response4 = await fetch(`${baseURL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data4 = await response4.json();
    console.log("✅ Statut:", response4.status);
    console.log("📄 Nouveau produit:", JSON.stringify(data4, null, 2));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Erreur lors du test:", errorMessage);
    console.log(
      "\n💡 Assurez-vous que le serveur est en cours d'exécution sur http://localhost:3001"
    );
  }
}

testAPI();
