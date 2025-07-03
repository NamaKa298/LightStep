-- Créer les tables seulement si elles n'existent pas (données préservées)

-- ⚠️ SUPPRIMER des tables définitivement (si plus utilisées)
-- DROP TABLE IF EXISTS reviews;    -- Décommentez pour supprimer reviews
-- DROP TABLE IF EXISTS old_table;  -- Décommentez pour supprimer old_table

-- CREATE TABLE IF NOT EXISTS products (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   brand VARCHAR(50),
--   price DECIMAL(10,2) NOT NULL,
--   size INTEGER[],
--   type VARCHAR(50),
--   activity VARCHAR(50),
--   gender VARCHAR(10),
--   -- Nouvelles colonnes (exemple)
--   description TEXT,
--   image_url VARCHAR(255),
--   stock INTEGER DEFAULT 0,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Créer la table users seulement si elle n'existe pas
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   firstname VARCHAR(100),
--   lastname VARCHAR(100),
--   phone VARCHAR(20),           -- ← NOUVELLE COLONNE
--   address TEXT,                -- ← NOUVELLE COLONNE
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

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