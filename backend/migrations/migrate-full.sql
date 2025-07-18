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

<<<<<<< HEAD:backend/scripts/migrate-full.sql

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

-- ALTER TABLE types
-- ALTER COLUMN name TYPE VARCHAR(30);

INSERT INTO uses(name) VALUES
('Occasionel'),
('Régulier'),
('Intensif');
=======
*/

ALTER TABLE products
ADD COLUMN IF NOT EXISTS use_id INTEGER REFERENCES uses(id);
>>>>>>> db_recuperation:backend/migrations/migrate-full.sql
