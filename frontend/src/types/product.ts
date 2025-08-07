export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  size: number[];
  type?: string;
  activity?: string;
  gender?: string;
  description?: string;
  image_url?: string; // Nom du fichier stocké en base
  image_url_full?: string; // URL complète reconstruite par l'API
  images?: string[];
  stock?: number;
  rating?: number;
  review_count?: number;
  color?: string;
  colors?: string[];
};
