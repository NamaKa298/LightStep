/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

type FilterOption = {
  name: string;
  count?: number;
  hex_code?: string;
};

type FiltersData = {
  brands: FilterOption[];
  sizes: number[];
  ground_types: FilterOption[];
  uses: FilterOption[];
  colors: FilterOption[];
};

type FiltersProps = {
  onFilterChange: (filters: any) => void;
};

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filtersData, setFiltersData] = useState<FiltersData | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [] as string[],
    sizes: [] as number[],
    ground_types: [] as string[],
    uses: [] as string[],
    colors: [] as string[],
    gender: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    // Charger les options de filtre
    fetch("http://localhost:3001/api/products/filters")
      .then((res) => res.json())
      .then((data) => {
        setFiltersData({
          brands: data.brands,
          sizes: data.sizes,
          ground_types: data.ground_types,
          uses: data.uses,
          colors: data.colors,
        });
      });
  }, []);

  useEffect(() => {
    // Notifier le parent des changements de filtre
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  const handleCheckboxChange = (
    filterType: keyof typeof selectedFilters,
    value: string | number
  ) => {
    setSelectedFilters((prev) => {
      const currentArray = [...prev[filterType]] as (string | number)[];
      const valueIndex = currentArray.indexOf(value);

      if (valueIndex === -1) {
        // Ajouter la valeur
        return { ...prev, [filterType]: [...currentArray, value] };
      } else {
        // Retirer la valeur
        return {
          ...prev,
          [filterType]: currentArray.filter((v) => v !== value),
        };
      }
    });
  };

  const handleRadioChange = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "minPrice" | "maxPrice"
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  const filterSection = css`
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
  `;

  const filterTitle = css`
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 16px;
  `;

  const filterOption = css`
    display: flex;
    align-items: center;
    margin: 5px 0;
  `;

  const colorSwatch = css`
    width: 16px;
    height: 16px;
    border-radius: 3px;
    margin-right: 8px;
    display: inline-block;
    border: 1px solid #ddd;
  `;

  const priceInputs = css`
    display: flex;
    gap: 10px;
    margin-top: 10px;
  `;

  const priceInput = css`
    width: 70px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  `;

  if (!filtersData) return <div>Chargement des filtres...</div>;

  return (
    <div>
      {/* Filtre par genre */}
      <div css={filterSection}>
        <div css={filterTitle}>Genre</div>
        <div css={filterOption}>
          <input
            type="radio"
            id="gender-men"
            checked={selectedFilters.gender === "men"}
            onChange={() => handleRadioChange("gender", "men")}
          />
          <label htmlFor="gender-men">Homme</label>
        </div>
        <div css={filterOption}>
          <input
            type="radio"
            id="gender-women"
            checked={selectedFilters.gender === "women"}
            onChange={() => handleRadioChange("gender", "women")}
          />
          <label htmlFor="gender-women">Femme</label>
        </div>
        <div css={filterOption}>
          <input
            type="radio"
            id="gender-unisex"
            checked={selectedFilters.gender === "unisex"}
            onChange={() => handleRadioChange("gender", "unisex")}
          />
          <label htmlFor="gender-unisex">Unisexe</label>
        </div>
      </div>

      {/* Filtre par marque */}
      <div css={filterSection}>
        <div css={filterTitle}>Marques</div>
        {filtersData.brands.map((brand) => (
          <div key={brand.name} css={filterOption}>
            <input
              type="checkbox"
              id={`brand-${brand.name}`}
              checked={selectedFilters.brands.includes(brand.name)}
              onChange={() => handleCheckboxChange("brands", brand.name)}
            />
            <label htmlFor={`brand-${brand.name}`}>{brand.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par taille */}
      <div css={filterSection}>
        <div css={filterTitle}>Tailles</div>
        {filtersData.sizes.map((size) => (
          <div key={size} css={filterOption}>
            <input
              type="checkbox"
              id={`size-${size}`}
              checked={selectedFilters.sizes.includes(size)}
              onChange={() => handleCheckboxChange("sizes", size)}
            />
            <label htmlFor={`size-${size}`}>{size}</label>
          </div>
        ))}
      </div>

      {/* Filtre par type de terrain */}
      <div css={filterSection}>
        <div css={filterTitle}>Type de terrain</div>
        {filtersData.ground_types.map((type) => (
          <div key={type.name} css={filterOption}>
            <input
              type="checkbox"
              id={`ground-${type.name}`}
              checked={selectedFilters.ground_types.includes(type.name)}
              onChange={() => handleCheckboxChange("ground_types", type.name)}
            />
            <label htmlFor={`ground-${type.name}`}>{type.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par activité */}
      <div css={filterSection}>
        <div css={filterTitle}>Activité</div>
        {filtersData.uses.map((use) => (
          <div key={use.name} css={filterOption}>
            <input
              type="checkbox"
              id={`use-${use.name}`}
              checked={selectedFilters.uses.includes(use.name)}
              onChange={() => handleCheckboxChange("uses", use.name)}
            />
            <label htmlFor={`use-${use.name}`}>{use.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par couleur */}
      <div css={filterSection}>
        <div css={filterTitle}>Couleurs</div>
        {filtersData.colors.map((color) => (
          <div key={color.name} css={filterOption}>
            <input
              type="checkbox"
              id={`color-${color.name}`}
              checked={selectedFilters.colors.includes(color.name)}
              onChange={() => handleCheckboxChange("colors", color.name)}
            />
            <span css={[colorSwatch, { backgroundColor: color.hex_code }]} />
            <label htmlFor={`color-${color.name}`}>{color.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par prix */}
      <div css={filterSection}>
        <div css={filterTitle}>Prix</div>
        <div css={priceInputs}>
          <input
            css={priceInput}
            type="number"
            placeholder="Min"
            value={selectedFilters.minPrice}
            onChange={(e) => handlePriceChange(e, "minPrice")}
          />
          <span>-</span>
          <input
            css={priceInput}
            type="number"
            placeholder="Max"
            value={selectedFilters.maxPrice}
            onChange={(e) => handlePriceChange(e, "maxPrice")}
          />
        </div>
      </div>
    </div>
  );
}
