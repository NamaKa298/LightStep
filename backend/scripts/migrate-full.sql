-- Migration complète : Ajouts ET suppressions
-- ⚠️ ATTENTION : Certaines opérations peuvent supprimer des données !

/*
-- 1️⃣ AJOUTER des colonnes (SANS PERTE DE DONNÉES)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Modifier image_url pour accepter du JSON (plusieurs images)
ALTER TABLE products 
ALTER COLUMN image_url TYPE TEXT;

-- Ou ajouter une nouvelle colonne pour plusieurs images
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Ajouter une colonne pour la couleur
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color VARCHAR(50);

-- Ou si vous voulez plusieurs couleurs disponibles
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS colors TEXT[];

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- 1️⃣ BIS - CRÉER la table users pour l'authentification
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer l'administrateur par défaut (changez l'email et le mot de passe !)
INSERT INTO users (email, password, role) 
VALUES ('admin@lightstep.com', '$2b$10$example_hashed_password', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 2️⃣ SUPPRIMER des colonnes (⚠️ PERTE DE DONNÉES !)
-- Décommentez seulement si vous êtes sûr !

-- Supprimer une colonne inutile (exemple)
ALTER TABLE products 
DROP COLUMN IF EXISTS old_column_name;


-- 3️⃣ MODIFIER des colonnes (⚠️ RISQUÉ !)
-- Décommentez avec précaution !


-- Changer le type d'une colonne (peut échouer si données incompatibles)
ALTER TABLE products 
ALTER COLUMN price TYPE NUMERIC(12,2);

-- Renommer une colonne
ALTER TABLE products 
RENAME COLUMN old_name TO new_name;


-- 4️⃣ AJOUTER des contraintes
ALTER TABLE products 
ADD CONSTRAINT price_positive 
CHECK (price > 0);

ALTER TABLE products 
ADD CONSTRAINT rating_range 
CHECK (rating >= 0.0 AND rating <= 5.0);

ALTER TABLE products 
ADD CONSTRAINT review_count_positive 
CHECK (review_count >= 0);

-- 5️⃣ VIDER la table products (⚠️ SUPPRIME TOUTES LES DONNÉES !)
-- Décommentez pour vider la table et repartir de zéro

-- Option 1 : DELETE (plus sûr, annulable)
-- DELETE FROM products;
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Option 2 : TRUNCATE (plus rapide)
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE;

-- 6️⃣ SUPPRIMER des tables (⚠️ DESTRUCTION TOTALE !)
-- Décommentez seulement si vous êtes sûr !

-- Supprimer une table complète
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS old_unused_table;


ALTER TABLE products 
DROP COLUMN IF EXISTS news;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS news BOOLEAN DEFAULT FALSE;


UPDATE products
SET size = ARRAY[36, 37, 38, 39]
WHERE id = 3;

INSERT INTO categories (...)
VALUES (ARRAY[36, 37, 38, 39, 40, 41, 43, 43, 44, 45, 46, 47, 48],
ARRAY['red', 'black', 'blue', 'green', 'yellow', 'white', 'purple', 'pink', 'orange', 'brown', 'gray', 'gold', 'silver'],
[TRUE, FALSE],
ARRAY['male', 'female', 'unisex'],
ARRAY['Vibram FiveFingers', 'Xero Shoes', 'Merrell', 'Altra', 'Aylla', 'Gumbies', 'Inov-8', 'Topo', 'Skinners', 'Luna Sandals'],
ARRAY['running', 'fitness', 'trail', 'casual', 'yoga'],
ARRAY[50,200],
ARRAY[0, 1, 2, 34],
ARRAY[ 'road', 'trail'],
ARRAY['minimalist_shoes', 'socks_shoes'],
ARRAY['light', 'medium', 'heavy'],
ARRAY['regular', 'wide', 'narrow'],
ARRAY[0, 1, 2, 3, 5]);
*/

/* \copy products(name,sale,brand,base_price,weight,type,category,gender,ground_type,stability,drop,rating,"1_star","2_star","3_star","4_star","5_star",review_count,is_recommended,news,sole_details,upper,material,utilisation,care_instructions,description
) FROM './products.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', QUOTE '"', ESCAPE '\', NULL '')*/

-- INSERT INTO sizes(eu_size,us_size,uk_size,foot_length_cm,foot_length_in, gender_id) VALUES
-- (35, '6-6.5', 4, 21.3, 8.375, 1),
-- (36, '6.5-7', 4.5, 21.9, 8.625, 1),
-- (37, '7-7.5', 5, 22.5, 8.875, 1),
-- (38, '7.5-8', 5.5, 23.2, 9.125, 1),
-- (39, '8-8.5', 6, 23.8, 9.375, 1),
-- (40, '8.5-9', 6.5, 24.4, 9.625, 1),
-- (41, '9-9.5', 7, 25.1, 9.875, 1),
-- (42, '9.5-10', 7.5, 25.7, 10.125, 1),
-- (39, '7.5-8', 6, 24.1, 9.5, 2),
-- (40, '8-8.5', 6.5, 24.8, 9.75, 2),
-- (41, '8.5-9', 7, 25.4, 10, 2),
-- (42, '9-9.5', 7.5, 26, 10.25, 2),
-- (43, '9.5-10', 8, 26.7, 10.5, 2),
-- (44, '10.5-11', 8.5, 27.3, 10.75, 2),
-- (45, '11-11.5', 9, 28, 11, 2),
-- (46, '11.5-12', 9.5, 28.6, 11.25, 2),
-- (47, '12-12.5', 10, 29.2, 11.5, 2),
-- (48, '12.5-13', 10.5, 30, 11.75, 2),
-- (49, '13-14', 11, 30.5, 12, 2);

-- CREATE TABLE product_images (
--   id SERIAL PRIMARY KEY,
--   product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
--   color_id INTEGER NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
--   image_type VARCHAR(50) NOT NULL,  -- 'thumbnail', 'main', 'detail', etc.
--   sort_order VARCHAR(10) NOT NULL,  -- '01', '02', etc.
  
--   -- URLs des différentes versions
--   highres_url VARCHAR(255) NOT NULL,
--   lowres_url VARCHAR(255) NOT NULL,
--   thumbnail_url VARCHAR(255) NOT NULL,
  
--   -- Métadonnées
--   original_filename VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

--   -- 3. Créer un index pour les performances
-- CREATE INDEX idx_product_images_product ON product_images(product_id);
-- CREATE INDEX idx_product_images_color ON product_images(color_id);

-- -- 4. Optionnel : Trigger pour updated_at
-- CREATE OR REPLACE FUNCTION update_timestamp()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trigger_update_timestamp
-- BEFORE UPDATE ON product_images
-- FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ALTER TABLE products ADD COLUMN base_model VARCHAR(55);

-- UPDATE products
-- SET base_model = regexp_replace(
--     LOWER(REGEXP_REPLACE(name, ' Femme| Homme', '', 'gi')),
--     '[^a-z0-9]+', '_', 'g'
-- );
-- CREATE INDEX idx_products_base_model ON products(base_model);

TRUNCATE TABLE product_images RESTART IDENTITY;