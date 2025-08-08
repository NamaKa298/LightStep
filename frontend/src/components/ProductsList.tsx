/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { api } from "../utils/api";
import type { Product } from "../types/product";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/api/products", {
        signal: controller.signal,
      })

      .then((response) => {
        console.log("✅ Produits chargés:", response.data.length);
        setProducts(response.data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("❌ Erreur:", error.message);
        }
      });

    return () => controller.abort();
  }, []);

  const productsTable = css`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
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
