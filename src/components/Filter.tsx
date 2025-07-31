/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

type FilterOption = {
  id?: number;
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
  genders: FilterOption[];
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
    genders: [] as string[],
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/products/filters")
      .then((res) => res.json())
      .then((data) => {
        setFiltersData({
          brands: data.brands,
          sizes: data.sizes,
          ground_types: data.ground_types,
          uses: data.uses,
          colors: data.colors,
          genders: data.genders,
        });
      });
  }, []);

  useEffect(() => {
    // Notifier le parent des changements de filtre
    onFilterChange(selectedFilters);
  }, [selectedFilters, onFilterChange]);

  if (!filtersData) {
    return <div>Chargement des filtres...</div>;
  }

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

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "minPrice" | "maxPrice"
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  const allFilter = css`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 20%;
  `;

  const filterSection = css`
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
  `;

  const filterTitle = css`
    margin-bottom: 10px;
    font-size: 16px;
    font-style: italic;
  `;

  const filterOption = css`
    display: flex;
    align-items: center;
    margin: 5px 0;
    gap: 10px;
    padding: 5px;
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
    <div css={allFilter}>
      {/* Filtre par genre */}
      <div css={filterSection}>
        <div css={filterTitle}>GENRE</div>
        {filtersData.genders.map((gender) => (
          <div key={gender.id} css={filterOption}>
            <input
              type="checkbox"
              id={`${gender.id}`}
              checked={selectedFilters.genders.includes(gender.name)}
              onChange={() => handleCheckboxChange("genders", gender.name)}
            />
            <label htmlFor={`gender-${gender.id}`}>{gender.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par marque */}
      <div css={filterSection}>
        <div css={filterTitle}>MARQUES</div>
        {filtersData.brands.map((brand) => (
          <div key={brand.id} css={filterOption}>
            <input
              type="checkbox"
              id={`${brand.id}`}
              checked={selectedFilters.brands.includes(brand.name)}
              onChange={() => handleCheckboxChange("brands", brand.name)}
            />
            <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par taille */}
      <div css={filterSection}>
        <div css={filterTitle}>TAILLES</div>
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
        <div css={filterTitle}>TYPE DE TERRAIN</div>
        {filtersData.ground_types.map((ground_type) => (
          <div key={ground_type.id} css={filterOption}>
            <input
              type="checkbox"
              id={`ground-${ground_type.id}`}
              checked={selectedFilters.ground_types.includes(ground_type.name)}
              onChange={() =>
                handleCheckboxChange("ground_types", ground_type.name)
              }
            />
            <label htmlFor={`ground-${ground_type.id}`}>
              {ground_type.name}
            </label>
          </div>
        ))}
      </div>

      {/* Filtre par utilisation */}
      <div css={filterSection}>
        <div css={filterTitle}>UTILISATION</div>
        {filtersData.uses.map((use) => (
          <div key={use.id} css={filterOption}>
            <input
              type="checkbox"
              id={`use-${use.id}`}
              checked={selectedFilters.uses.includes(use.name)}
              onChange={() => handleCheckboxChange("uses", use.name)}
            />
            <label htmlFor={`use-${use.id}`}>{use.name}</label>
          </div>
        ))}
      </div>

      {/* Filtre par couleur */}
      <div css={filterSection}>
        <div css={filterTitle}>COULEURS</div>
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
        <div css={filterTitle}>PRIX</div>
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
