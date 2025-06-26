import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  size: number[];
};

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-bold">{product.name}</h3>
          <p>
            {product.brand} - {product.price}€
          </p>
          <p>Tailles : EU {product.size}</p>
        </div>
      ))}
    </div>
  );
}
