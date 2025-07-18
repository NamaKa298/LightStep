-- Créer les tables seulement si elles n'existent pas (données préservées)

-- ⚠️ SUPPRIMER des tables définitivement (si plus utilisées)
-- DROP TABLE IF EXISTS reviews;    -- Décommentez pour supprimer reviews
-- DROP TABLE IF EXISTS old_table;  -- Décommentez pour supprimer old_table

-- TABLE PRODUCTS OPTIMISÉE POUR NEON (économie d'espace)


CREATE TABLE genders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(1) NOT NULL
);

CREATE TABLE ground_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  eu_size VARCHAR(10) NOT NULL,
  uk_size VARCHAR(10) NOT NULL,
  us_size VARCHAR(10) NOT NULL,
  foot_length_mm SMALLINT NOT NULL,
  gender_id INTEGER REFERENCES genders(id),
  UNIQUE (eu_size, gender_id),
  UNIQUE (uk_size, gender_id),
  UNIQUE (us_size, gender_id)
);

CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  hex_code VARCHAR(7) NOT NULL,
  is_special BOOLEAN DEFAULT FALSE,
  UNIQUE (name)
);

CREATE TABLE uses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sale INTEGER DEFAULT 0,
  name VARCHAR(50) NOT NULL,
  base_price DECIMAL(8,2) NOT NULL,
  is_active BOOLEAN,
  brand_id INTEGER REFERENCES brands(id),
  weight DECIMAL(5,1),
  type_id INTEGER REFERENCES types(id),
  category_id INTEGER REFERENCES categories(id),
  gender_id INTEGER REFERENCES genders(id),
  ground_type_id INTEGER REFERENCES ground_types(id),
  stability VARCHAR(20),
  drop SMALLINT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  "1_star" SMALLINT DEFAULT 0,               -- Note : INTEGER au lieu de SMALLINT
  "2_star" SMALLINT DEFAULT 0,               -- Note : INTEGER au lieu de SMALLINT
  "3_star" SMALLINT DEFAULT 0,               -- Note : INTEGER au lieu de SMALLINT
  "4_star" SMALLINT DEFAULT 0,               -- Note : INTEGER au lieu de SMALLINT
  "5_star" SMALLINT DEFAULT 0,
  review_count SMALLINT DEFAULT 0,   
  is_recommended SMALLINT DEFAULT 0,  -- 0 = false, 1 = true
  news BOOLEAN DEFAULT FALSE,
  sole_details VARCHAR(150),           -- "air,gel" au lieu d'array
  upper VARCHAR(100),                -- "cuir,synthétique" au lieu d'array
  material VARCHAR(100),               -- "cuir,synthétique" au lieu d'array
  care_instructions VARCHAR(100),            -- "course,randonnée" au lieu d'array
  description VARCHAR(500),              -- "route,trail" au lieu d'array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  phone VARCHAR(15),
  role VARCHAR(10) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address VARCHAR(300),
  billing_address VARCHAR(300),
  payment_method VARCHAR(50)
);

CREATE TABLE product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  sku VARCHAR(50) UNIQUE NOT NULL,
  stock SMALLINT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  price DECIMAL(8,2) NOT NULL,
  color_id INTEGER REFERENCES colors(id),
  size_id INTEGER REFERENCES sizes(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, color_id, size_id)
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_variant_id INTEGER REFERENCES product_variants(id),
  quantity SMALLINT NOT NULL,
  price_at_purchase DECIMAL(8,2) NOT NULL
);

CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  product_variant_id INTEGER REFERENCES product_variants(id),
  url VARCHAR(40) NOT NULL,
  type VARCHAR(20) NOT NULL,
  sort_order SMALLINT NOT NULL DEFAULT 0
);