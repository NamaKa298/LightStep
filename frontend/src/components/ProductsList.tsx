/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  size: number[];
  type?: string;
  activity?: string;
  gender?: string;
  description?: string;
  image_url?: string; // Nom du fichier stocké en base
  image_url_full?: string; // URL complète reconstruite par l'API
  images?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  color?: string;
  colors?: string[];
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Produits chargés:", data.length);
        setProducts(data);
      })
      .catch((error) => {
        console.error("❌ Erreur:", error.message);
      });
  }, []);

  const productsTable = css`
    display: flex;
    flex-direction: row;
    font-family: "Montserrat", sans-serif;
  `;

  const productModel = css`
    font-size: 15px;
    font-weight: 400;
  `;

  const productPrice = css`
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 5%;
    padding-top: 10px;
  `;

  const productImage = css`
    width: 70%;
    height: auto;
    gap: 5px;
  `;

  return (
    <div>
      {/* Liste des produits */}
      <div css={productsTable}>
        {products.map((product) => (
          <div key={product.id}>
            <img
              css={productImage}
              src={
                product.image_url_full ||
                product.image_url ||
                "/placeholder-image.jpg"
              }
              alt={product.name}
            />
            <h3 css={productModel}>{product.name}</h3>
            <div>
              {/* Affichage des étoiles de notation */}
              {product.rating !== undefined &&
                product.rating !== null &&
                (typeof product.rating === "number"
                  ? product.rating > 0
                  : parseFloat(product.rating) > 0) && (
                  <div>
                    <StarRating
                      rating={product.rating}
                      reviewCount={product.review_count}
                    />
                  </div>
                )}
              <p css={productPrice}>{product.price}€</p>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div>
          <p>Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
}
