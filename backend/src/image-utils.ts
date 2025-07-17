/**
 * Utilitaire pour reconstruire les URLs d'images depuis les noms stockés en base
 *
 * UTILISATION :
 * - En base : stockage des noms uniquement ("mon-image.jpg")
 * - En frontend/API : reconstruction dynamique des URLs complètes
 */

/**
 * Reconstruit l'URL complète d'une image depuis son nom
 * @param imageName Nom du fichier stocké en base
 * @returns URL complète ou null si pas d'image
 */
export function buildImageUrl(imageName: string | null): string | null {
  if (!imageName) return null;

  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imageName.startsWith("http")) {
    return imageName;
  }

  // Construire l'URL R2 depuis les variables d'environnement
  const baseUrl = process.env.R2_PUBLIC_URL;
  if (!baseUrl) {
    console.warn("⚠️ R2_PUBLIC_URL non configuré, retour du nom seul");
    console.warn(
      "Variables disponibles:",
      Object.keys(process.env).filter((k) => k.startsWith("R2"))
    );
    return imageName;
  }

  return `${baseUrl}/products/${imageName}`;
}

/**
 * Traite un tableau de produits pour ajouter les URLs complètes
 * @param products Produits avec champ image_url (nom uniquement)
 * @returns Produits avec image_url_full ajouté
 */
export function addImageUrlsToProductVariants(products: any[]): any[] {
  return products.map((product) => ({
    ...product,
    image_url_full: buildImageUrl(product.image_url),
  }));
}

/**
 * Exemples d'utilisation :
 *
 * // Dans une API route
 * const products = await pool.query('SELECT * FROM products');
 * const productsWithUrls = addImageUrlsToProductVariants (products.rows);
 * res.json(productsWithUrls);
 *
 * // Pour un produit unique
 * const imageUrl = buildImageUrl(product.image_url);
 *
 * // Variables d'environnement requises :
 * // R2_PUBLIC_URL=https://lightstep-images.1f6016842bd4950b1e2fad13cbb3462e.r2.cloudflarestorage.com
 */
