import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const sizesArray = [
  {
    eu_size: "35",
    us_size: "6-6.5",
    uk_size: "4",
    foot_length_cm: "21.3",
    foot_length_in: "8.375",
  },
  {
    eu_size: "36",
    us_size: "6.5-7",
    uk_size: "4.5",
    foot_length_cm: "21.9",
    foot_length_in: "8.625",
  },
  {
    eu_size: "37",
    us_size: "7-7.5",
    uk_size: "5",
    foot_length_cm: "22.5",
    foot_length_in: "8.875",
  },
  {
    eu_size: "38",
    us_size: "7.5-8",
    uk_size: "5.5",
    foot_length_cm: "23.2",
    foot_length_in: "9.125",
  },
  {
    eu_size: "39",
    us_size: "8-8.5",
    uk_size: "6",
    foot_length_cm: "23.8",
    foot_length_in: "9.375",
  },
  {
    eu_size: "40",
    us_size: "8.5-9",
    uk_size: "6.5",
    foot_length_cm: "24.4",
    foot_length_in: "9.625",
  },
  {
    eu_size: "41",
    us_size: "9-9.5",
    uk_size: "7",
    foot_length_cm: "25.1",
    foot_length_in: "9.875",
  },
  {
    eu_size: "42",
    us_size: "9.5-10",
    uk_size: "7.5",
    foot_length_cm: "25.7",
    foot_length_in: "10.125",
  },
  {
    eu_size: "39",
    us_size: "7.5-8",
    uk_size: "6",
    foot_length_cm: "24.1",
    foot_length_in: "9.5",
  },
  {
    eu_size: "40",
    us_size: "8-8.5",
    uk_size: "6.5",
    foot_length_cm: "24.8",
    foot_length_in: "9.75",
  },
  {
    eu_size: "41",
    us_size: "8.5-9",
    uk_size: "7",
    foot_length_cm: "25.4",
    foot_length_in: "10",
  },
  {
    eu_size: "42",
    us_size: "9-9.5",
    uk_size: "7.5",
    foot_length_cm: "26",
    foot_length_in: "10.25",
  },
  {
    eu_size: "43",
    us_size: "9.5-10",
    uk_size: "8",
    foot_length_cm: "26.7",
    foot_length_in: "10.5",
  },
  {
    eu_size: "44",
    us_size: "10.5-11",
    uk_size: "8.5",
    foot_length_cm: "27.3",
    foot_length_in: "10.75",
  },
  {
    eu_size: "45",
    us_size: "11-11.5",
    uk_size: "9",
    foot_length_cm: "28",
    foot_length_in: "11",
  },
  {
    eu_size: "46",
    us_size: "11.5-12",
    uk_size: "9.5",
    foot_length_cm: "28.6",
    foot_length_in: "11.25",
  },
  {
    eu_size: "47",
    us_size: "12-12.5",
    uk_size: "10",
    foot_length_cm: "29.2",
    foot_length_in: "11.5",
  },
  {
    eu_size: "48",
    us_size: "12.5-13",
    uk_size: "10.5",
    foot_length_cm: "30",
    foot_length_in: "11.75",
  },
  {
    eu_size: "49",
    us_size: "13-14",
    uk_size: "11",
    foot_length_cm: "30.5",
    foot_length_in: "12",
  },
  {
    eu_size: "35",
    us_size: "6-6.5",
    uk_size: "4",
    foot_length_cm: "21.3",
    foot_length_in: "8.375",
  },
  {
    eu_size: "36",
    us_size: "6.5-7",
    uk_size: "4.5",
    foot_length_cm: "21.9",
    foot_length_in: "8.625",
  },
  {
    eu_size: "37",
    us_size: "7-7.5",
    uk_size: "5",
    foot_length_cm: "22.5",
    foot_length_in: "8.875",
  },
  {
    eu_size: "38",
    us_size: "7.5-8",
    uk_size: "5.5",
    foot_length_cm: "23.2",
    foot_length_in: "9.125",
  },
  {
    eu_size: "39",
    us_size: "8",
    uk_size: "6",
    foot_length_cm: "23.95",
    foot_length_in: "9.44",
  },
  {
    eu_size: "40",
    us_size: "8.5",
    uk_size: "6.5",
    foot_length_cm: "24.6",
    foot_length_in: "9.69",
  },
  {
    eu_size: "41",
    us_size: "9",
    uk_size: "7",
    foot_length_cm: "25.25",
    foot_length_in: "9.94",
  },
  {
    eu_size: "42",
    us_size: "9.5",
    uk_size: "7.5",
    foot_length_cm: "25.85",
    foot_length_in: "10.19",
  },
  {
    eu_size: "43",
    us_size: "9.5-10",
    uk_size: "8",
    foot_length_cm: "26.7",
    foot_length_in: "10.5",
  },
  {
    eu_size: "44",
    us_size: "10.5-11",
    uk_size: "8.5",
    foot_length_cm: "27.3",
    foot_length_in: "10.75",
  },
  {
    eu_size: "45",
    us_size: "11-11.5",
    uk_size: "9",
    foot_length_cm: "28",
    foot_length_in: "11",
  },
  {
    eu_size: "46",
    us_size: "11.5-12",
    uk_size: "9.5",
    foot_length_cm: "28.6",
    foot_length_in: "11.25",
  },
  {
    eu_size: "47",
    us_size: "12-12.5",
    uk_size: "10",
    foot_length_cm: "29.2",
    foot_length_in: "11.5",
  },
  {
    eu_size: "48",
    us_size: "12.5-13",
    uk_size: "10.5",
    foot_length_cm: "30",
    foot_length_in: "11.75",
  },
  {
    eu_size: "49",
    us_size: "13-14",
    uk_size: "11",
    foot_length_cm: "30.5",
    foot_length_in: "12",
  },
];

const gendersArray = [
  {
    name: "Femme",
  },
  {
    name: "Homme",
  },
  {
    name: "Unisexe",
  },
];

const brandsArray = [
  {
    name: "Vibram fivefingers",
  },
  {
    name: "Luna Sandals",
  },
  {
    name: "Altra",
  },
  {
    name: "Aylla",
  },
  {
    name: "Inov-8",
  },
  {
    name: "Skinners",
  },
  {
    name: "Merell",
  },
  {
    name: "Topo Athletic",
  },
  {
    name: "Xero Shoes",
  },
];

const colorsArray = [
  {
    name: "Noir",
    hex_code: "#000000",
    is_special: false,
  },
  {
    name: "Vert",
    hex_code: "#008000",
    is_special: false,
  },
  {
    name: "Blanc",
    hex_code: "#FFFFFF",
    is_special: false,
  },
  {
    name: "Jaune",
    hex_code: "#FFFF00",
    is_special: false,
  },
  {
    name: "Orange",
    hex_code: "#FFA500",
    is_special: false,
  },
  {
    name: "Gris",
    hex_code: "#808080",
    is_special: false,
  },
  {
    name: "Bleu",
    hex_code: "#0000FF",
    is_special: false,
  },
  {
    name: "Marron",
    hex_code: "#A52A2A",
    is_special: false,
  },
  {
    name: "Rouge",
    hex_code: "#FF0000",
    is_special: false,
  },
  {
    name: "Rose",
    hex_code: "#FFC0CB",
    is_special: false,
  },
  {
    name: "Violet",
    hex_code: "#800080",
    is_special: false,
  },
];

const groundTypesArray = [
  {
    name: "Boue",
  },
  {
    name: "Glace/Neige",
  },
  {
    name: "Piste",
  },
  {
    name: "Route",
  },
  {
    name: "Salle",
  },
  {
    name: "Sentier",
  },
];

const stabilitiesArray = [
  {
    name: "Minimaliste",
  },
  {
    name: "Neutre",
  },
  {
    name: "Modérée",
  },
  {
    name: "Guidée",
  },
];

const usesArray = [
  {
    name: "Occasionnel",
  },
  {
    name: "Régulier",
  },
  {
    name: "Intensif",
  },
];

const typesArray = [
  {
    name: "Chaussures minimalistes",
  },
  {
    name: "Chaussettes",
  },
  {
    name: "Chaussures chausettes",
  },
];

const arrayCategories = [
  {
    name: "Fitness",
  },
  {
    name: "Casual",
  },
  {
    name: "Yoga",
  },
  {
    name: "Trail",
  },
  {
    name: "Running",
  },
];

async function seed() {
  await prisma.gender.createMany({
    data: gendersArray,
    skipDuplicates: true,
  });
  await prisma.brand.createMany({
    data: brandsArray,
    skipDuplicates: true,
  });
  await prisma.color.createMany({
    data: colorsArray,
    skipDuplicates: true,
  });
  await prisma.use.createMany({
    data: usesArray,
    skipDuplicates: true,
  });
  await prisma.type.createMany({
    data: typesArray,
    skipDuplicates: true,
  });
  await prisma.category.createMany({
    data: arrayCategories,
    skipDuplicates: true,
  });
  await prisma.stability.createMany({
    data: stabilitiesArray,
    skipDuplicates: true,
  });
  await prisma.groundType.createMany({
    data: groundTypesArray,
    skipDuplicates: true,
  });
  await prisma.size.createMany({
    data: sizesArray,
    skipDuplicates: true,
  });
}

seed()
  .catch((e) => {
    console.error("Erreur lors de l'insertion:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// pour executer le script : "npx ts-node prisma/seed.ts"
// Pour vérifier que l'implémentation est correcte : "npx prisma studio" à l'endroit ou se trouve le schema prisma
