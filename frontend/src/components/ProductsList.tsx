/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { api } from "../utils/api";
import type { Product } from "../types/product";

interface FiltersType {
  genders: string[];
  brands: string[];
  sizes: number[];
  minPrice: string;
  maxPrice: string;
  ground_types: string[];
  uses: string[];
  dropMin: string;
  dropMax: string;
  weightMin: string;
  weightMax: string;
  colors: string[];
  stabilities: string[];
}

interface ProductsListProps {
  filters: FiltersType;
}

export default function ProductsList({ filters }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();

    filters.genders.forEach((gender) => params.append("genders", gender));
    filters.brands.forEach((brand) => params.append("brands", brand));
    filters.ground_types.forEach((ground_type) =>
      params.append("ground_types", ground_type)
    );
    filters.stabilities.forEach((stability) =>
      params.append("stabilities", stability)
    );
    filters.colors.forEach((color) => params.append("colors", color));
    filters.uses.forEach((use) => params.append("uses", use));

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.append(key, value);
      }
    });

    const url = `/api/products${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    api
      .get(url, {
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
  }, [filters]);

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
    width: 100%;
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
                `${R2_PUBLIC_URL}/${product.thumbnail_url}` ||
                "/placeholder-image.jpg"
              }
              alt={`${R2_PUBLIC_URL}/${product.thumbnail_url}`}
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
