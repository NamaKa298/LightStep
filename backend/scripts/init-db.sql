-- Supprimer la table si elle existe (ATTENTION : efface les données !)
DROP TABLE IF EXISTS products;

-- Créer la table products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  size INTEGER[],
  type VARCHAR(50),
  activity VARCHAR(50),
  gender VARCHAR(10)
);