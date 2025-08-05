import os

# Groupes de modèles
model_groups = {
    "EL-X Knit": ["EL-X_KNIT", "ELX_KNIT", "EL-XKNIT"],
    "V-Trek": ["V-TREK"],
    "V-Train 2.0": ["V-TRAIN_2.0", "V-TRAIN20", "VTRAIN20", "V Train 2.0"],
    "V-Trail 2.0": ["V-TRAIL_2.0"],
    "V-Street": ["V_STREET", "V Street"],
    "V-Soul": ["V-SOUL"],
    "V-Run": ["V-RUN"],
    "V-Lynx": ["V_LYNX", "VFF_Yeti"],
    "V-Kumo": ["VFF_V_KumoIMG", "V_KUMO"],
    "V-Aqua": ["V-AQUA"],
    "V-Alpha": ["A-ALPHA", "V-ALPHA"],
    "Spyridon EVO": ["SPYRIDON_EVO"],
    "Scarmkey": ["SCARMKEY"],
    "Roadaround": ["ROADAROUND"],
    "One Quarter Jeans":["ONEQUARTER"],
    "KSO Vintage":["KSO_VINTAGE"],
    "KMD EVO":["KMD_EVO", "KMDEVO"],
    "KMD Sport":["KMD_SPORT"],
    "Furoshiki":["FUROSHIKI"],
    "Breezandal":["BREEZANDAL"],
    "KSO EVO":["KSOEVO","KSO_EVO"],
    "Graspifier":["GRASPIFIER"]
}

# Groupes de couleurs
color_groups = {
    "Noir": ["BLACK", "BLACKBLACK", "BLACKYELLOW", "black", "BLACK-REFLECTIVE"],
    "Gris": ["GREY", "MILITARYDRAKGREY", "SILVER_PINE", "MILITARY"],
    "Violet": ["MILITARYPURPLE", "PURPLE"],
    "Vert": ["LIMEGREEN-GREY", "LIMEGREEN", "GREEN", "LIMEGREEN-IVORY-GREY", "LIMEGREEN-BLACK", "MILITARYGREEN-BLACK", "militarygreen", "WARM_TAUPE_SAGE", "MILITARYGREEN-BLACK"],
    "Blanc": ["WHITE", "OFF_WHITE", "IVORY-REFLECTIVE", "TOTALWHITE", "IVORY-LIMEGREEN", "IVORY-BLACK"],
    "Rose": ["DUSTY-PINK", "WHITEPINK"],
    "Bleu": ["BLUEBLACK", "WHITELIGHTBLUE", "Blue_Light_Green"],
    "Marron":["BROWN-GUM", "BROWN-PINK"],
    "Orange":["WHITEORANGE", "ORANGEIRIDESCENT"],
    "Rouge":["RIOT"],
    "Jaune":["YELLOW-WHITE"],
}

type_map = {
    "01": "thumbnail_01",
    "06": "thumbnail_02",
    "Merge": "thumbnail_02",
    "02": "galerie_01",
    "03": "galerie_02",
    "04": "galerie_03",
    "05": "galerie_04",
}

model_map = {}
for model, variantes in model_groups.items():
    for variante in variantes:
        model_map[variante.upper()] = model

color_map = {}
for couleur, variantes in color_groups.items():
    for variante in variantes:
        color_map[variante.upper()] = couleur

IMAGE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../rename-images'))

for filename in os.listdir(IMAGE_DIR):
    if not (filename.lower().endswith('.jpg') or filename.lower().endswith('.png') or filename.lower().endswith('.webp')):
        continue

    name, ext = os.path.splitext(filename)
    parts = name.split('_')

    # Gestion des couleurs composées (ex: OFF_WHITE)
    color_key = None
    type_key = None
    model_key = None
    if len(parts) > 3:
        possible_color = f"{parts[-3]}_{parts[-2]}".upper()
        if possible_color in color_map:
            color_key = possible_color
            type_key = parts[-1]
            model_key = "_".join(parts[:-3])
        else:
            color_key = parts[-2]
            type_key = parts[-1]
            model_key = "_".join(parts[:-3])
    else:
        color_key = parts[-2]
        type_key = parts[-1]
        model_key = parts[0]

    # Cas où il n'y a pas de type reconnu
    if type_key.upper() not in type_map:
        type_key = "01"

    model_human = model_map.get(model_key.upper(), model_key.replace("_", " ").title())
    color_human = color_map.get(color_key.upper(), color_key.replace("-", " ").title())
    type_human = type_map.get(type_key, type_key)

    new_name = f"{model_human}_{color_human}_{type_human}{ext.lower()}"
    old_path = os.path.join(IMAGE_DIR, filename)
    new_path = os.path.join(IMAGE_DIR, new_name)

    if not os.path.exists(new_path):
        os.rename(old_path, new_path)
        print(f"{filename} → {new_name}")
    else:
        print(f"ATTENTION : {new_name} existe déjà, {filename} non renommé.")

print("Renommage terminé.")