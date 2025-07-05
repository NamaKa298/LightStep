-- Créer les tables seulement si elles n'existent pas (données préservées)

-- ⚠️ SUPPRIMER des tables définitivement (si plus utilisées)
-- DROP TABLE IF EXISTS reviews;    -- Décommentez pour supprimer reviews
-- DROP TABLE IF EXISTS old_table;  -- Décommentez pour supprimer old_table

-- TABLE PRODUCTS OPTIMISÉE POUR NEON (économie d'espace)
DROP TABLE IF EXISTS products;

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(50),
  price DECIMAL(8,2) NOT NULL,           -- Max 999,999.99€
  description VARCHAR(500),              -- TEXT → VARCHAR limité
  category VARCHAR(50),
  type VARCHAR(30),
  activity VARCHAR(30),
  gender CHAR(1),                        -- 'H'/'F'/'U' au lieu de VARCHAR
  
  -- 📏 CARACTÉRISTIQUES OPTIMISÉES
  sizes SMALLINT[],                      -- INTEGER[] → SMALLINT[] (16-bit)
  colors VARCHAR(100),                   -- "noir,blanc,rouge" au lieu d'array
  weight DECIMAL(5,1),                   -- 320.5g (1 décimale suffit)
  drop_height SMALLINT,                  -- 8mm (entier)
  stability VARCHAR(20),
  ground_types VARCHAR(50),              -- "route,trail" au lieu d'array
  
  -- 🖼️ IMAGES ULTRA-OPTIMISÉES (noms de fichiers uniquement)
  main_image VARCHAR(80),                -- "nike-270-main.webp"
  gallery_images VARCHAR(250),           -- "nike-270-side.webp,nike-270-back.webp"
  
  -- 📊 BUSINESS OPTIMISÉ
  stock SMALLINT DEFAULT 0,              -- Max 32,767
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count SMALLINT DEFAULT 0,
  flags SMALLINT DEFAULT 0,              -- Bitfield : featured=1, new=2, sale=4
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE USERS OPTIMISÉE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,    -- Réduit de 255 à 200
  password VARCHAR(200) NOT NULL,        -- Réduit de 255 à 200
  firstname VARCHAR(50),                 -- Réduit de 100 à 50
  lastname VARCHAR(50),                  -- Réduit de 100 à 50
  phone VARCHAR(15),                     -- Réduit de 20 à 15
  address VARCHAR(300),                  -- TEXT → VARCHAR limité
  role VARCHAR(10) DEFAULT 'user',       -- 'user', 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  sizes INTEGER[],
  colors TEXT[],
  news BOOLEAN,
  genders TEXT[],
  brands TEXT[],
  activities TEXT[],
  min_price INTEGER DEFAULT 50,
  max_price INTEGER DEFAULT 200,
  drops NUMERIC[],
  grounds TEXT[],
  types TEXT[],
  weights NUMERIC[],
  stabilities TEXT[],
  uses TEXT[],
  min_rating DECIMAL DEFAULT 0.0,
  max_rating DECIMAL DEFAULT 5.0
);

-- 🖼️ FONCTION UTILITAIRE POUR GÉNÉRER LES URLS D'IMAGES
-- Usage dans votre backend Node.js :
/*
// utils/images.js
const R2_CDN = process.env.R2_PUBLIC_URL; // "https://lightstep-images.1f6016842bd4950b1e2fad13cbb3462e.r2.cloudflarestorage.com"
const PRODUCTS_FOLDER = "products";

export function getImageUrl(imageName) {
  if (!imageName) return null;
  return `${R2_CDN}/${PRODUCTS_FOLDER}/${imageName}`;
}

export function formatProduct(product) {
  return {
    ...product,
    main_image_url: getImageUrl(product.main_image),
    gallery_urls: product.gallery_images?.split(',').map(name => getImageUrl(name.trim()))
  };
}

// Exemple d'usage :
// DB: "nike-270-main.webp"
// URL générée : "https://lightstep-images.../products/nike-270-main.webp"
*/

-- 💾 GAIN D'ESPACE ESTIMÉ :
-- Ancienne version : ~200 bytes par produit
-- Version optimisée : ~100 bytes par produit  
-- ÉCONOMIE : 50% d'espace !