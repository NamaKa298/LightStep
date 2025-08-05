import StarRating from "./StarRating";

export default function StarRatingTest() {
  const testRatings = [
    { rating: 0, description: "Aucune étoile" },
    { rating: 1, description: "1 étoile pleine" },
    { rating: 1.3, description: "1 étoile pleine + 0.3 partielle" },
    { rating: 2.7, description: "2 étoiles pleines + 0.7 partielle" },
    { rating: 3.8, description: "3 étoiles pleines + 0.8 partielle" },
    { rating: 4.2, description: "4 étoiles pleines + 0.2 partielle" },
    { rating: 5, description: "5 étoiles pleines" },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test du composant StarRating</h2>
      <div className="space-y-4">
        {testRatings.map((test, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-600">{test.description}</p>
              <p className="text-xs text-gray-400">Rating: {test.rating}</p>
            </div>
            <StarRating
              rating={test.rating}
              reviewCount={Math.floor(Math.random() * 100) + 1}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">
          Logique des étoiles :
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <strong>Étoile pleine :</strong> starNumber ≤ Math.floor(rating)
          </li>
          <li>
            <strong>Étoile vide :</strong> starNumber {">"} Math.ceil(rating)
          </li>
          <li>
            <strong>Étoile partielle :</strong> filling = rating - (starNumber -
            1)
          </li>
        </ul>
      </div>
    </div>
  );
}
