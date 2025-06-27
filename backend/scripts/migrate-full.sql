-- Migration complète : Ajouts ET suppressions
-- ⚠️ ATTENTION : Certaines opérations peuvent supprimer des données !

-- 1️⃣ AJOUTER des colonnes (SANS PERTE DE DONNÉES)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 2️⃣ SUPPRIMER des colonnes (⚠️ PERTE DE DONNÉES !)
-- Décommentez seulement si vous êtes sûr !

/*
-- Supprimer une colonne inutile (exemple)
ALTER TABLE products 
DROP COLUMN IF EXISTS old_column_name;
*/

-- 3️⃣ MODIFIER des colonnes (⚠️ RISQUÉ !)
-- Décommentez avec précaution !

/*
-- Changer le type d'une colonne (peut échouer si données incompatibles)
ALTER TABLE products 
ALTER COLUMN price TYPE NUMERIC(12,2);

-- Renommer une colonne
ALTER TABLE products 
RENAME COLUMN old_name TO new_name;
*/

-- 4️⃣ AJOUTER des contraintes
ALTER TABLE products 
ADD CONSTRAINT price_positive 
CHECK (price > 0);

-- 5️⃣ SUPPRIMER des tables (⚠️ DESTRUCTION TOTALE !)
-- Décommentez seulement si vous êtes sûr !

/*
-- Supprimer une table complète
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS old_unused_table;
*/
