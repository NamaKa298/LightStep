import pandas as pd
from collections import defaultdict
import os
import random
import csv

# 1. Configuration des modèles de base (sans déclinaisons)
base_models = {
    "Graspifier": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 120.00,
        "price": 120.00,
        "weight": {"Homme": 81, "Femme": 65}, 
        "unisex": False,
        "Homme": {"sizes": [i for i in range(40, 48)]},
        "Femme": {"sizes": [36,37,38,40,42]},
        "type": "Chaussures minimalistes",
        "category": "Fitness",
        "ground_type": "Salle",
        "stability": "Guidée",
        "drop": 0,
        "rating": {"Homme": 3.5, "Femme": 5},
        "1_star": {"Homme": 1, "Femme": 0},
        "2_star": {"Homme": 1, "Femme": 0},
        "3_star": {"Homme": 0, "Femme": 0},
        "4_star": {"Homme": 2, "Femme": 0},
        "5_star": {"Homme": 2, "Femme": 1},
        "review_count": {"Homme": 6, "Femme": 1},
        "is_recommended": {"Homme": 60, "Femme": 100},
        "colors": ["Noir", "Vert"],
        "news": {"Homme": True, "Femme": False},
        "sole_details": "",
        "upper": "",
        "material": "Caoutchouc Vibram EcoStep avec 30 % de contenu Vibram recyclé.",
        "uses": "Idéal pour l'entraînement en musculation et les routines en salle, où l'attention est portée sur l'équilibre et la sensation au sol.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "La tige synthétique respirante et extensible de la Graspifier épouse véritablement le pied comme un gant, tandis que la semelle Max-Feel segmentée offre une excellente sensation au sol et une bonne articulation du pied, avec un équilibre optimal entre traction et durabilité. Notre caoutchouc Vibram EcoStep avec 30 % de contenu Vibram recyclé offre adhérence et traction, reconnaissant ainsi notre engagement envers la durabilité du produit. Épaisseur totale de la semelle : 5 mm",
        "is_active": True
    },
    "KMD EVO": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 190.00,
        "price": 190.00,
        "weight": {"Homme": 210, "Femme": 160}, 
        "unisex": False,
        "Homme": {"sizes": [i for i in range(40, 45)]},
        "Femme": {"sizes": [i for i in range(36, 41)]},
        "type": "Chaussures minimalistes",
        "category": "Running",
        "ground_type": ["Route", "Sentiers"],
        "stability": "Modérée",
        "drop": 0,
        "rating": {"Homme" :4.4, "Femme": 4.4},
        "1_star": {"Homme" :2, "Femme": 2},
        "2_star": {"Homme": 4, "Femme": 1},
        "3_star": {"Homme": 0, "Femme": 1},
        "4_star": {"Homme": 8, "Femme": 1},
        "5_star": {"Homme": 32, "Femme": 20},
        "review_count": {"Homme": 43, "Femme": 25},
        "is_recommended": {"Homme": 85, "Femme": 83},
        "colors": {"Homme":["Noir","Vert","Blanc"], "Femme":["Noir","Marron"]},
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle intérieure : 2 mm EVA+Anti Microbial Drilex Sockliner\n Semelle intermédiaire : 6 mm EVA",
        "upper": "100% Filament de polyester à faible élasticité",
        "material": "",
        "uses": "",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "La KMD EVO est très appréciée des fans pour une bonne raison. Chaussure d'entraînement polyvalente pour l'intérieur et l'extérieur, elle est dotée d'une semelle intérieure Vibram Metaflex SL de 6 mm, d'une semelle extérieure Ecostep Recycle et d'une tige tricotée souple avec un système de laçage rapide.\nLégère, souple et confortable, la KMD EVO convient parfaitement aux activités d'entraînement traditionnelles en intérieur et en extérieur, telles que les cours de fitness, l'haltérophilie, le cardio et d'autres exercices en salle de sport.\nRemarque : Ce modèle Vibram FiveFingers utilise un composé de caoutchouc appelé Vibram EcoStep Recycle pour sa semelle. En raison de l'uses de matériaux recyclés, le caoutchouc présente des taches blanches. Il ne s'agit pas d'une peinture, d'un défaut ou d'une salissure, mais simplement du résultat du caoutchouc utilisé.",
        "is_active": True
    },
    "V-Trail 2.0": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 160.00,
        "price": 160.00,
        "weight": {"Homme": 182, "Femme": 142}, 
        "unisex": False,
        "Homme": {"sizes": [i for i in range(41, 46)]},
        "Femme": {"sizes": [i for i in range(37, 42)]},
        "type": "Chaussures minimalistes",
        "category": "Trail",
        "ground_type": "Sentiers",
        "stability": "Guidée",
        "drop": 0,
        "rating": {"Homme" :3.7, "Femme": 3.4},
        "1_star": {"Homme" : 45, "Femme": 19},
        "2_star": {"Homme": 28, "Femme": 18},
        "3_star": {"Homme": 24, "Femme": 23},
        "4_star": {"Homme": 49, "Femme": 19},
        "5_star": {"Homme": 129, "Femme": 43},
        "review_count": {"Homme": 275, "Femme": 122},
        "is_recommended": {"Homme": 72, "Femme": 61},
        "colors": "Noir",
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle Intérieure en EVA de 2 mm + Doublure en Polyester \nSemelle Extérieure en Caoutchouc Megagrip de 3,7 mm",
        "upper": "",
        "material": "",
        "uses": "Idéale pour courir dans la nature, sur les sentiers ou lors de courses d'obstacles : la chaussure de choix pour se déplacer sur des surfaces imprévisibles.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "La V-Trail 2.0 offre les nouvelles et meilleures caractéristiques pour conquérir les sentiers avec aisance, y compris les deux couches de matière autour des orteils pour éviter les fissures des coutures et une empeigne améliorée plus hydrofuge que la version précédente. La V-Trail 2.0 est dotée d'une maille 3D Cocoon tissée dans la semelle extérieure pour la protéger des objets les plus tranchants pendant l'entraînement en extérieur, comme les pierres et les racines. La maille est tridimensionnelle, elle disperse le point d'impact sur toute la partie inférieure de la chaussure. Elle offre toujours une excellente sensation au sol et dextérité. Le composé de la semelle extérieure Megagrip offre une adhérence suprême sur terrain sec comme humide.",
        "is_active": True
    },
    "V-Train 2.0": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 160.00,
        "price": 160.00,
        "weight": {"Homme": 220, "Femme": 175}, 
        "unisex": False,
        "Homme": {"sizes": [39,40,42,43,46]},
        "Femme": {"sizes": [35,36,38,40]},
        "type": "Chaussures minimalistes",
        "category": "Fitness",
        "ground_type": "Salle",
        "stability": "Guidée",
        "drop": 0,
        "rating": {"Homme" :4.4, "Femme": 4.3},
        "1_star": {"Homme" : 26, "Femme": 14},
        "2_star": {"Homme": 12, "Femme": 10},
        "3_star": {"Homme": 16, "Femme": 15},
        "4_star": {"Homme": 37, "Femme": 33},
        "5_star": {"Homme": 249, "Femme": 134},
        "review_count": {"Homme": 340, "Femme": 206},
        "is_recommended": {"Homme": 88, "Femme": 89},
        "colors": {"Homme": ["Noir", "Vert", "Gris"], "Femme": ["Noir", "Gris"]},
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle intérieure: Assise Plantaire en EVA de 2mm + Doublure en Polyester\n Semelle intermédiaire: N/A\n Caoutchouc: Semelle extérieure en caoutchouc XS Trek de 4mm",
        "upper": "Polyester, Panneaux Latéraux en TPU",
        "material": "",
        "uses": "",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "La V-Train 2.0 est idéale pour les entraîneurs et athlètes expérimentés.\n Bon niveau de sensation au sol et de protection avec une bonne articulation des orteils pour un bon équilibre et une stabilité optimale\n Construction de l’empeigne spécialement conçue pour l'entraînement intensif, axée sur la durabilité et les performances\n Cosses distinctives de traction de la corde dans la voûte\n Nouveau système de laçage des panneaux avec fermeture auto-agrippante, sensation plus douce. Idéale pour les mouvements agressifs et latéraux\n Composé caoutchouc XS Trek pour des performances polyvalentes en intérieur comme en extérieur",
        "is_active": True
    },
    "V-Trek": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 160.00,
        "price": 160.00,
        "weight": {"Homme": 185, "Femme": 139}, 
        "unisex": False,
        "Homme": {"sizes": [40,41,43,44,45]},
        "Femme": {"sizes": [36,37,39,40,42]},
        "type": "Chaussures minimalistes",
        "category": ["Trail", "Running"],
        "ground_type": ["Route", "Sentier"],
        "stability": "Modérée",
        "drop": 0,
        "rating": {"Homme" :4.3, "Femme": 4.3},
        "1_star": {"Homme" : 19, "Femme": 3},
        "2_star": {"Homme": 18, "Femme": 7},
        "3_star": {"Homme": 25, "Femme": 13},
        "4_star": {"Homme": 51, "Femme": 27},
        "5_star": {"Homme": 205, "Femme": 92},
        "review_count": {"Homme": 318, "Femme": 148},
        "is_recommended": {"Homme": 86, "Femme": 83},
        "colors": {"Homme": ["Noir", "Gris"], "Femme": ["Noir", "Violet"]},
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle Megagrip en caoutchouc de 4 mm pour des performances optimales sur diverses surfaces",
        "upper": "Empeigne extérieure en laine et matière synthétique pour plus d'extensibilité et de confort",
        "material": "",
        "uses": "Trekking, Marche, Escalade, Sport urbain.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "La V-Trek est idéale pour la marche, la randonnée et le trekking, et propose un style urbain très élégant. La semelle extérieure Flexible dotée de la technologie Megagrip est idéale pour une uses en extérieur, pour une adhérence dans des conditions sèches comme humides. Une semelle intermédiaire en polyuréthane légèrement plus épaisse offre un confort supplémentaire, et notre matériau supérieur mélangé en laine et matière synthétique aide à améliorer la respirabilité et à réduire les odeurs. La coupe mi-haute et le système de laçage traditionnel permettent également un look sportif et décontracté. Les fibres synthétiques présentes dans la construction assurent la résistance mécanique et la durabilité.",
        "is_active": True
    },
        "V-KUMO": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 120.00,
        "price": 120.00,
        "weight": {"Femme": 112}, 
        "unisex": False,
        "Femme": {"sizes": [i for i in range(38,42)]},
        "type": "Chaussures minimalistes",
        "category": "Casual",
        "ground_type": "Route",
        "stability": "Guidée",
        "drop": 0,
        "rating": {"Femme": 3},
        "1_star": {"Femme": 3},
        "2_star": {"Femme": 0},
        "3_star": {"Femme": 2},
        "4_star": {"Femme": 0},
        "5_star": {"Femme": 3},
        "review_count": {"Femme": 8},
        "is_recommended": {"Femme": 60},
        "colors": {"Femme": ["Noir", "Vert"]},
        "news": {"Femme": False},
        "sole_details": "Semelle intérieure : 2 mm EVA + Doublure en Drilex\n Semelle extérieure : 3 mm de caoutchouc\n Composé : Vibram XS Trek",
        "upper": "Polyester matelassé",
        "material": "",
        "uses": "Trekking, Marche, Escalade, Sport urbain.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Cette chaussure décontractée de tous les jours est élégante, confortable et offre une sensation maximale au sol. La tige en polyester matelassé est agréable au pied et s'attache bien grâce à une double bande auto-agrippante. La semelle extérieure est en caoutchouc Vibram XS Trek, qui offre une bonne adhérence pour les activités quotidiennes telles que promener le chien, faire les courses ou passer du temps en plein air avec des amis.",
        "is_active": True
    },
    "Spyridon EVO": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 135.00,
        "price": 135.00,
        "weight": {"Homme": 141, "Femme": 141}, 
        "unisex": False,
        "Homme": {"sizes": [i for i in range(42, 47)]},
        "Femme": {"sizes": [35,37,38,40]},
        "type": "Chaussures minimalistes",
        "category": ["Trail", "Running"],
        "ground_type": ["Route", "Sentier"],
        "stability": "Modérée",
        "drop": 0,
        "rating": {"Homme" :3.5, "Femme": 3.9},
        "1_star": {"Homme" : 3, "Femme": 0},
        "2_star": {"Homme": 4, "Femme": 2},
        "3_star": {"Homme": 4, "Femme": 2},
        "4_star": {"Homme": 1, "Femme": 6},
        "5_star": {"Homme": 10, "Femme": 5},
        "review_count": {"Homme": 22, "Femme": 15},
        "is_recommended": {"Homme": 59, "Femme": 73},
        "colors": {"Homme": ["Noir"], "Femme": ["Noir"]},
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle intérieure : 3 mm Polyuréthane + Doublure en Drilex Antimicrobien\n Semelle extérieure : 3,5 mm de caoutchouc\n Composé : Vibram Megagrip",
        "upper": "Polyester",
        "material": "",
        "uses": "Idéale pour courir dans la nature, sur les sentiers ou lors de courses d'obstacles : la chaussure de choix pour se déplacer sur des surfaces imprévisibles.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Une évolution naturelle de notre chaussure de trail populaire durable, légère et respirante, et dispose désormais d'un système de fermeture sécurisé à sangle auto-agrippante pour une meilleure stabilité. La semelle de cette chaussure de trail robuste est conçue avec la technologie Vibram 3D Cocoon, une fine couche protectrice en maille croisée qui offre une protection légère sur les sentiers et les terrains irréguliers. L'ajout de Vibram Megagrip offre une adhérence supérieure sur les surfaces humides comme sèches. La Spyridon EVO est née pour l'extérieur, idéale pour le trail, les randonnées, les courses d'obstacles et tout ce que Mère Nature peut mettre à vos pieds.",
        "is_active": True
    },
    "V-Lynx": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 150.00,
        "price": 150.00,
        "weight": {"Homme": 420, "Femme": 320}, 
        "unisex": False,
        "Homme": {"sizes": [39,41,42,44,47]},
        "Femme": {"sizes": [35,38,39,40]},
        "type": "Chaussures minimalistes",
        "category": "Casual",
        "ground_type": ["Route", "Sentier"],
        "stability": "Minimaliste",
        "drop": 0,
        "rating": {"Homme" :3.6, "Femme": 3.8},
        "1_star": {"Homme" : 2, "Femme": 0},
        "2_star": {"Homme": 1, "Femme": 1},
        "3_star": {"Homme": 0, "Femme": 0},
        "4_star": {"Homme": 6, "Femme": 3},
        "5_star": {"Homme": 3, "Femme": 1},
        "review_count": {"Homme": 12, "Femme": 5},
        "is_recommended": {"Homme": 58, "Femme": 80},
        "colors": {"Homme": ["Noir", "Gris"], "Femme": ["Noir", "Gris"]},
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle intérieure : Polyuréthane souple 4 mm ;\n Semelle extérieure : 4 mm ;\n Composant de la semelle : Vibram XS Trek",
        "upper": "Matière supérieure hydrofuge et rembourrée, fermeture à glissière thermo-soudée",
        "material": "",
        "uses": "",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Ce modèle est équipé d'une semelle intérieure en polyuréthane souple de 4 mm et d'une semelle extérieure flexible en caoutchouc Vibram de 4 mm, dotée du composé de caoutchouc XS TREK pour une traction et une adhérence sur des terrains variés. La tige déperlante et rembourrée garde vos pieds au chaud les jours de bruine, tandis que la fermeture éclair thermo-soudée améliore l'isolation. Parfaite pour le quotidien de l'automne et de l'hiver.",
        "is_active": True
    },
    "EL-X Knit": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 125.00,
        "price": 125.00,
        "weight": {"Homme": 140, "Femme": 110}, 
        "unisex": False,
        "Homme": {"sizes": [40,42,43,45,46]},
        "Femme": {"sizes": [37,39,40,42]},
        "type": "Chaussures minimalistes",
        "category": ["Fitness","Yoga"],
        "ground_type": ["Salle"],
        "stability": "Modérée",
        "drop": 0,
        "rating": {"Homme" :4.4, "Femme": 4.6},
        "1_star": {"Homme" : 1, "Femme": 1},
        "2_star": {"Homme": 3, "Femme": 1},
        "3_star": {"Homme": 1, "Femme": 2},
        "4_star": {"Homme": 4, "Femme": 3},
        "5_star": {"Homme": 24, "Femme": 27},
        "review_count": {"Homme": 33, "Femme": 34},
        "is_recommended": {"Homme": 91, "Femme": 91},
        "colors": {"Homme": ["Noir", "Gris"], "Femme": ["Noir", "Gris"]},
        "news": {"Homme": False, "Femme": False},
        "sole_details": "Semelle intérieure : 2 mm EVA\n Semelle intermédiaire : N/A\n Caoutchouc : 3 MM",
        "upper": "Tissée",
        "material": "",
        "uses": "",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Cette version améliorée d'un style populaire allie le confort d'enfilage d'une empeigne tissée souple à une semelle extérieure minimaliste et adhérente. La semelle XS Trek de 3 mm offre un équilibre optimal entre traction et durabilité sur des terrains variés. La EL-X Knit offre une bonne sensation au sol pour ceux qui recherchent une expérience minimaliste, et est idéale pour une uses au quotidien dans un style décontracté.",
        "is_active": True
    },
    "KOS Vintage": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 110.00,
        "price": 110.00,
        "weight": {"Homme": 175}, 
        "unisex": False,
        "Homme": {"sizes": [41,43,44,45,47]},
        "type": "Chaussures minimalistes",
        "category": "Casual",
        "ground_type": "Route",
        "stability": "Guidée",
        "drop": 0,
        "rating": {"Homme": 4.4},
        "1_star": {"Homme": 2},
        "2_star": {"Homme": 1},
        "3_star": {"Homme": 1},
        "4_star": {"Homme": 9},
        "5_star": {"Homme": 21},
        "review_count": {"Homme": 34},
        "is_recommended": {"Homme": 84},
        "colors": {"Homme": ["Vert", "Blanc"]},
        "news": {"Homme": False},
        "sole_details": "Semelle intérieure : Microfibre en Polyester\n Semelle intermédiaire : N/A\n Caoutchouc : 1,5 mm",
        "upper": "Polyamide Extensible, Polyester, Polyuréthane",
        "material": "",
        "uses": "",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Une nouvelle version d'un classique intemporel, l'édition limitée de la KSO Vintage célèbre le meilleur de ce que les chaussures minimalistes FiveFingers ont à offrir. Le polyamide extensible, fin et résistant et la maille extensible respirante enveloppent votre pied, pour un ajustement confortable qui ne laisse rien entrer. L’empeigne est respirante et à sèche rapidement, pour permettre une uses dans l'eau ou par temps humide, tandis que le système populaire de fermeture auto-agrippante assure un ajustement sûr. De plus, la semelle extérieure en caoutchouc performant XS Trek, non marquante, est extrêmement polyvalente et offre une excellente adhérence sur les surfaces sèches comme humides. La KSO Vintage est idéale aussi bien pour une uses quotidienne décontractée que pour des entraînements en salle de sport, et même pour les aventures sur les sentiers. Elle est conçue pour les vrais minimalistes qui veulent se connecter pleinement avec la Terre.",
        "is_active": True
    },
    "KMD sport": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 120.00,
        "price": 120.00,
        "weight": 180, 
        "unisex": True,
        "sizes": [i for i in range(38,44)],
        "type": "Chaussures minimalistes",
        "category": ["Fitness", "Running"],
        "ground_type": "Salle",
        "stability": "Modérée",
        "drop": 0,
        "rating": 4.6,
        "1_star": 0,
        "2_star": 3,
        "3_star": 4,
        "4_star": 6,
        "5_star": 56,
        "review_count": 70,
        "is_recommended": 96,
        "colors": ["Jaune"],
        "news": False,
        "sole_details": "Semelle extérieure en caoutchouc de 4 mm\n Assise plantaire en polyuréthane de 2 mm",
        "upper": "",
        "material": "",
        "uses": "",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Pensée pour l'athlète d'aujourd'hui, Vibram FiveFingers gagne en intensité avec la Vibram FiveFingers KMD Sport. Cette conception multisports conserve tout ce que nous aimons de la KSO avec des améliorations fonctionnelles qui plaisent aux amateurs de fitness les plus actifs. Pour la toute première fois, Vibram présente une semelle de 2 mm sans couture pour réduire les frottements. Les fermetures auto-agrippantes au talon et sur le cou-de-pied permettent de fixer l’empeigne en nylon extensible aux contours de votre pied, comme une seconde peau. La KMD Sport ne serait pas complète sans une semelle extérieure en caoutchouc Vibram TC1 de 4 mm qui offre l'adhérence et la protection dont vous avez besoin pour une large variété d'activités. Lavage en Machine / Séchage à l'Air Libre.",
        "is_active": True
    },
        "V street": {
        "brand": "Vibram fivefingers",
        "sales": 0,
        "base_price": 215.00,
        "price": 215.00,
        "weight": 230, 
        "unisex": True,
        "sizes": [39,41,42,44,45],
        "type": "Chaussures minimalistes",
        "category": "Casual",
        "ground_type": "Route",
        "stability": "Guidée",
        "drop": 0,
        "rating": 3.5,
        "1_star": 1,
        "2_star": 2,
        "3_star": 4,
        "4_star": 0,
        "5_star": 5,
        "review_count": 12,
        "is_recommended": 67,
        "colors": ["Noir","Gris","Blanc"],
        "news": False,
        "sole_details": "12mm Total Thickness of sole.​\n MIDSOLE: 6mm Foam\n RUBBER: 4mm Rubber",
        "upper": "Stretch poly-wool blend with knit-sleeve collar; speed lace system closure.",
        "material": "",
        "uses": "Idéal pour la marche urbaine sur des surfaces dures et artificielles.",
        "care_instructions": "Lavage en machine à froid / Séchage à l'air libre",
        "description": "Une édition limitée de la collaboration Brandblack® Vibram Fivefingers combine une semelle Vibram Fivefingers confortable avec du caoutchouc Vibram XS Trek. Cette semelle propulse et amortit, ce qui en fait le choix idéal pour les promenades urbaines. La conception lisse de la tige associe les meilleurs matériaux : une tige en laine mélangée pour une saisonnalité maximale, et un col de chaussette extensible pour un confort ajusté.",
        "is_active": True
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
        
        for gender in ["Unisexe"]:
            variants.append({
                "model": model_name,
                "gender": gender,
                "full_name": f"{model_name}",
                "sizes": model_data["sizes"],
                "stocks": generate_random_stocks(model_data["sizes"]),
                **model_data
            })
    else:
        for gender in ["Homme", "Femme"]:
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
all_categories = []
all_ground_types = []

for model_name, model_data in base_models.items():
    variants = generate_gender_variants(model_name, model_data)
    
    for variant in variants:
        all_products.append({
            "sale": variant["sales"],
            "name": variant["full_name"],
            "brand": variant["brand"],
            "base_price": variant["base_price"],
            "weight": variant["weight"].get(variant["gender"]) if isinstance(variant["weight"], dict) else variant["weight"],
            "type": variant["type"],
            "category": variant["category"],
            "gender": variant["gender"],
            "ground_type": variant["ground_type"],
            "stability": variant["stability"],
            "drop": variant["drop"],
            "rating": variant["rating"].get(variant["gender"]) if isinstance(variant["rating"], dict) else variant["rating"],
            "1_star": variant["1_star"].get(variant["gender"]) if isinstance(variant["1_star"], dict) else variant["1_star"],
            "2_star": variant["2_star"].get(variant["gender"]) if isinstance(variant["2_star"], dict) else variant["2_star"],
            "3_star": variant["3_star"].get(variant["gender"]) if isinstance(variant["3_star"], dict) else variant["3_star"],
            "4_star": variant["4_star"].get(variant["gender"]) if isinstance(variant["4_star"], dict) else variant["4_star"],
            "5_star": variant["5_star"].get(variant["gender"]) if isinstance(variant["5_star"], dict) else variant["5_star"],
            "review_count": variant["review_count"].get(variant["gender"]) if isinstance(variant["review_count"], dict) else variant["review_count"],
            "is_recommended": variant["is_recommended"].get(variant["gender"]) if isinstance(variant["is_recommended"], dict) else variant["is_recommended"],
            "news":  variant["news"].get(variant["gender"]) if isinstance(variant["news"], dict) else variant["news"],
            "sole_details": variant["sole_details"],
            "upper":variant["upper"],
            "material": variant["material"],
            "uses": variant["uses"],
            "care_instructions": variant["care_instructions"],
            "description": model_data.get("description", "")
        })
        
        # Fichier variants_config.csv
        if isinstance(variant["colors"], dict):
            colors_list = variant["colors"].get(variant["gender"])
        else:
            colors_list = variant["colors"]
        
        for color in colors_list:
            for i, size in enumerate(variant["sizes"]):
                all_variants.append({
                    "name": variant["full_name"],
                    "sku": variant["brand"][:6].upper()+"-"+(model_name.upper())+"-"+variant["gender"][:1].upper()+ "-" + str(size) + "-"+color.upper(),
                    "stocks": variant["stocks"][i],
                    "is_active" : variant["is_active"],
                    "price":variant["price"],
                    "colors": color,
                    "sizes": size,
            })
        
        categories_list = variant["category"]

        if isinstance(categories_list, str):
            categories_list = [categories_list]
        for category in categories_list:
            all_categories.append({
                "name":  variant["full_name"],
                "category": category,
            })

        ground_types_list = variant["ground_type"]

        if isinstance(ground_types_list, str):
            ground_types_list = [ground_types_list]
        for ground_type in ground_types_list:
            all_ground_types.append({
                "name":  variant["full_name"],
                "ground_type": ground_type,
            })

# 4. Export dans le dossier seed_data à la racine de backend
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)
seed_data_dir = os.path.join(backend_dir, "seed_data")
os.makedirs(seed_data_dir, exist_ok=True)
products_path = os.path.join(seed_data_dir, "products.csv")
variants_path = os.path.join(seed_data_dir, "variants_product.csv")
categories_path = os.path.join(seed_data_dir, "product_categories.csv")
ground_types_path = os.path.join(seed_data_dir, "product_ground_types.csv")

pd.DataFrame(all_products).to_csv(
    products_path,
    index=False,
    quoting=csv.QUOTE_ALL,
    escapechar="\\",
    encoding="utf-8"
)

pd.DataFrame(all_variants).to_csv(
    variants_path,
    index=False,
    quoting=csv.QUOTE_ALL,
    escapechar="\\",
    encoding="utf-8"
)

pd.DataFrame(all_categories).to_csv(
    categories_path,
    index=False,
    quoting=csv.QUOTE_ALL,
    escapechar="\\",
    encoding="utf-8"
)

pd.DataFrame(all_ground_types).to_csv(
    ground_types_path,
    index=False,
    quoting=csv.QUOTE_ALL,
    escapechar="\\",
    encoding="utf-8"
)