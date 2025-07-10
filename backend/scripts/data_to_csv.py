import pandas as pd
from collections import defaultdict
import os
import random

# 1. Configuration des modèles de base (sans déclinaisons)
base_models = {
    "Graspifier": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 120.00,
        "price": 120.00,
        "weight": {"homme": 81, "femme": 65}, 
        "unisex": False,
        "homme": {"sizes": [i for i in range(40, 48)]},
        "femme": {"sizes": [36,37,38,40,42]},
        "type": "chaussures minimalistes",
        "category": "fitness",
        "ground_type": "salle",
        "stability": "guidée",
        "drop": 0,
        "rating": {"homme": 3.5, "femme": 5},
        "1_star": {"homme": 1, "femme": 0},
        "2_star": {"homme": 1, "femme": 0},
        "3_star": {"homme": 0, "femme": 0},
        "4_star": {"homme": 2, "femme": 0},
        "5_star": {"homme": 2, "femme": 1},
        "review_count": {"homme": 6, "femme": 1},
        "is_recommended": {"homme": 60, "femme": 100},
        "colors": ["Noir", "Vert"],
        "news": {"homme": True, "femme": False},
        "sole_details": "",
        "upper": "",
        "material": "Caoutchouc Vibram EcoStep avec 30 % de contenu Vibram recyclé.",
        "utilisation": "Idéal pour l'entraînement en musculation et les routines en salle, où l'attention est portée sur l'équilibre et la sensation au sol.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "La tige synthétique respirante et extensible de la Graspifier épouse véritablement le pied comme un gant, tandis que la semelle Max-Feel segmentée offre une excellente sensation au sol et une bonne articulation du pied, avec un équilibre optimal entre traction et durabilité. Notre caoutchouc Vibram EcoStep avec 30 % de contenu Vibram recyclé offre adhérence et traction, reconnaissant ainsi notre engagement envers la durabilité du produit. Épaisseur totale de la semelle : 5 mm",
        "is_active": "true"
    }
}

def generate_random_stocks(sizes, mean=15, variation=10):
    """
    Génère des stocks aléatoires avec:
    - mean: stock moyen
    - variation: écart maximum par rapport à la moyenne
    """
    return [max(0, mean + random.randint(-variation, variation)) for _ in sizes]

# 2. Génération automatique des déclinaisons
def generate_gender_variants(model_name, model_data):
    variants = []
    
    if model_data["unisex"]:
        # Taille unique pour les deux genres
        sizes = {"homme": [40,41,42,43], "femme": [38,39,40,41]}
        stocks = {"homme": [10]*4, "femme": [10]*4}
        
        for gender in ["homme", "femme"]:
            variants.append({
                "model": model_name,
                "gender": gender,
                "full_name": f"{model_name} {gender.capitalize()}",
                "sizes": sizes[gender],
                "stocks": generate_random_stocks(model_data[gender]["sizes"]),
                **model_data
            })
    else:
        for gender in ["homme", "femme"]:
            if gender in model_data:
                variants.append({
                    "model": model_name,
                    "gender": gender,
                    "full_name": f"{model_name} {gender.capitalize()}",
                    "sizes": model_data[gender]["sizes"],
                    "stocks": generate_random_stocks(model_data[gender]["sizes"]),
                    **model_data
                })
    
    return variants

# 3. Génération des CSV
all_products = []
all_variants = []

for model_name, model_data in base_models.items():
    variants = generate_gender_variants(model_name, model_data)
    
    for variant in variants:
        all_products.append({
            "sale": variant["sales"],
            "name": variant["full_name"],
            "brand": variant["brand"],
            "base_price": variant["base_price"],
            "weight": variant["weight"].get(variant["gender"]),
            "type": variant["type"],
            "category": variant["category"],
            "gender": variant["gender"],
            "ground_type": variant["ground_type"],
            "stability": variant["stability"],
            "drop": variant["drop"],
            "rating": variant["rating"].get(variant["gender"]),
            "1_star": variant["1_star"].get(variant["gender"]),
            "2_star": variant["2_star"].get(variant["gender"]),
            "3_star": variant["3_star"].get(variant["gender"]),
            "4_star": variant["4_star"].get(variant["gender"]),
            "5_star": variant["5_star"].get(variant["gender"]),
            "review_count": variant["review_count"].get(variant["gender"]),
            "is_recommended": variant["is_recommended"].get(variant["gender"]),
            "news":  variant["news"].get(variant["gender"]),
            "sole_details": variant["sole_details"],
            "upper":variant["upper"],
            "material": variant["material"],
            "utilisation": variant["utilisation"],
            "care_instructions": variant["care_instructions"],
            "description": model_data.get("description", "")
        })
        
        # Fichier variants_config.csv
        for color in variant["colors"]:
            for i, size in enumerate(variant["sizes"]):
                all_variants.append({
                    "name": variant["full_name"],
                    
                    "is_active" : variant["is_active"],
                    "colors": color,
                        "sku": variant["brand"][:6].upper()+"-"+(model_name.upper())+"-"+variant["gender"][:1].upper()+ "-" + str(size) + "-"+color.upper(),
                        "sizes": size,
                        "stocks": variant["stocks"][i]
            })
        

# 4. Export dans le répertoire courant
current_dir = os.getcwd()
products_path = os.path.join(current_dir, "products.csv")
variants_path = os.path.join(current_dir, "variants_product.csv")

pd.DataFrame(all_products).to_csv(products_path, index=False)
pd.DataFrame(all_variants).to_csv(variants_path, index=False)