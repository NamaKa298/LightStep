-- CreateTable
CREATE TABLE "public"."brands" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."colors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "hex_code" VARCHAR(7) NOT NULL,
    "is_special" BOOLEAN DEFAULT false,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genders" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(10) NOT NULL,

    CONSTRAINT "genders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ground_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "ground_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "product_variant_id" INTEGER,
    "quantity" SMALLINT NOT NULL,
    "price_at_purchase" DECIMAL(8,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "order_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending',
    "shipping_address" VARCHAR(300),
    "billing_address" VARCHAR(300),
    "payment_method" VARCHAR(50),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_categories" (
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "public"."product_ground_types" (
    "product_id" INTEGER NOT NULL,
    "ground_type_id" INTEGER NOT NULL,

    CONSTRAINT "product_ground_types_pkey" PRIMARY KEY ("product_id","ground_type_id")
);

-- CreateTable
CREATE TABLE "public"."product_images" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color_id" INTEGER NOT NULL,
    "image_type" VARCHAR(50) NOT NULL,
    "sort_order" VARCHAR(10) NOT NULL,
    "highres_url" VARCHAR(255) NOT NULL,
    "lowres_url" VARCHAR(255) NOT NULL,
    "thumbnail_url" VARCHAR(255) NOT NULL,
    "original_filename" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "sku" VARCHAR(50) NOT NULL,
    "stock" SMALLINT NOT NULL DEFAULT 0,
    "is_active" BOOLEAN DEFAULT true,
    "price" DECIMAL(8,2) NOT NULL,
    "color_id" INTEGER,
    "size_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "sale" INTEGER DEFAULT 0,
    "name" VARCHAR(50) NOT NULL,
    "base_price" DECIMAL(8,2) NOT NULL,
    "brand_id" INTEGER,
    "weight" DECIMAL(5,1),
    "type_id" INTEGER,
    "gender_id" INTEGER,
    "stability" VARCHAR(20),
    "drop" SMALLINT,
    "rating" DECIMAL(2,1) DEFAULT 0.0,
    "1_star" SMALLINT DEFAULT 0,
    "2_star" SMALLINT DEFAULT 0,
    "3_star" SMALLINT DEFAULT 0,
    "4_star" SMALLINT DEFAULT 0,
    "5_star" SMALLINT DEFAULT 0,
    "review_count" SMALLINT DEFAULT 0,
    "is_recommended" SMALLINT DEFAULT 0,
    "news" BOOLEAN DEFAULT false,
    "sole_details" VARCHAR(500),
    "upper" VARCHAR(200),
    "material" VARCHAR(100),
    "care_instructions" VARCHAR(100),
    "description" VARCHAR(1500),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "use_details" VARCHAR(500),
    "use_id" INTEGER,
    "base_model" VARCHAR(55),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sizes" (
    "id" SERIAL NOT NULL,
    "eu_size" VARCHAR(10) NOT NULL,
    "uk_size" VARCHAR(10) NOT NULL,
    "us_size" VARCHAR(10) NOT NULL,
    "foot_length_cm" DECIMAL(5,2) NOT NULL,
    "gender_id" INTEGER,
    "foot_length_in" DECIMAL(5,2),

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "firstname" VARCHAR(50),
    "lastname" VARCHAR(50),
    "phone" VARCHAR(15),
    "role" VARCHAR(10) DEFAULT 'user',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."uses" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,

    CONSTRAINT "uses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_variant_images" (
    "id" SERIAL NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "product_image_id" INTEGER NOT NULL,

    CONSTRAINT "product_variant_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colors_name_key" ON "public"."colors"("name");

-- CreateIndex
CREATE INDEX "idx_product_image_color" ON "public"."product_images"("color_id");

-- CreateIndex
CREATE INDEX "idx_product_image_product" ON "public"."product_images"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_images_product_id_color_id_image_type_original_file_key" ON "public"."product_images"("product_id", "color_id", "image_type", "original_filename");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "public"."product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_product_id_color_id_size_id_key" ON "public"."product_variants"("product_id", "color_id", "size_id");

-- CreateIndex
CREATE INDEX "idx_product_base_model" ON "public"."products"("base_model");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_eu_size_gender_id_key" ON "public"."sizes"("eu_size", "gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_uk_size_gender_id_key" ON "public"."sizes"("uk_size", "gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_us_size_gender_id_key" ON "public"."sizes"("us_size", "gender_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "product_variant_images_product_variant_id_idx" ON "public"."product_variant_images"("product_variant_id");

-- CreateIndex
CREATE INDEX "product_variant_images_product_image_id_idx" ON "public"."product_variant_images"("product_image_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_images_product_variant_id_product_image_id_key" ON "public"."product_variant_images"("product_variant_id", "product_image_id");

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_ground_types" ADD CONSTRAINT "product_ground_types_ground_type_id_fkey" FOREIGN KEY ("ground_type_id") REFERENCES "public"."ground_types"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_ground_types" ADD CONSTRAINT "product_ground_types_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_variants" ADD CONSTRAINT "product_variants_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."types"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_use_id_fkey" FOREIGN KEY ("use_id") REFERENCES "public"."uses"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."sizes" ADD CONSTRAINT "sizes_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."product_variant_images" ADD CONSTRAINT "product_variant_images_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_variant_images" ADD CONSTRAINT "product_variant_images_product_image_id_fkey" FOREIGN KEY ("product_image_id") REFERENCES "public"."product_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
