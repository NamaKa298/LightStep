/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { IoIosInformationCircleOutline } from "react-icons/io";
import styled from "@emotion/styled";

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
  stabilities: FilterOption[];
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
    stabilities: [] as string[],
    minDrop: "",
    maxDrop: "",
    minWeight: "",
    maxWeight: "",
  });
  // CORRIGÉ
  const [openSections, setOpenSections] = useState({
    genders: false,
    brands: false,
    sizes: false,
    ground_types: false,
    uses: false,
    colors: false,
    price: false,
    stabilities: false,
    drop: false,
    weight: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/products/filters")
      .then((response) => {
        setFiltersData({
          brands: response.data.brands,
          sizes: response.data.sizes,
          ground_types: response.data.ground_types,
          uses: response.data.uses,
          colors: response.data.colors,
          genders: response.data.genders,
          stabilities: response.data.stabilities,
        });
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des filtres:", error);
      });
  }, []);

  useEffect(() => {
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
        return { ...prev, [filterType]: [...currentArray, value] };
      } else {
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
    padding-right: 50px;
  `;

  const filterSection = css`
    padding: 5px 15px;
    border-radius: 8px;
  `;

  const filterTitle = css`
    margin-bottom: 10px;
    font-size: 16px;
    font-style: italic;
    display: flex;
    justify-content: space-between;
    gap: 5vw;
  `;

  const filterOption = css`
    display: flex;
    align-items: center;
    margin: 5px 0;
    gap: 10px;
    padding: 5px;
  `;

  const colorSwatch = css`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
    border: 2px solid #ddd;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      transform: scale(1.5);
      border-color: #333;
    }
  `;

  const colorSwatchSelected = css`
    border-color: #000;
    border-width: 2px;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.25);
  `;

  const colorSwatchCheckmark = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
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

  const colorSwatchContainer = css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  `;
  const Separator = styled.hr`
    color: #80808073;
    height: 1px;
    margin: 0.8em 0;
  `;

  const toggleSection = (sectionName: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  return (
    <div css={allFilter}>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("genders")}>
          GENRE {openSections.genders ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.genders && (
          <div>
            {filtersData.genders.map((gender) => (
              <div key={gender.id} css={filterOption}>
                <input
                  type="checkbox"
                  id={`gender-${gender.id}`}
                  checked={selectedFilters.genders.includes(gender.name)}
                  onChange={() => handleCheckboxChange("genders", gender.name)}
                />
                <label htmlFor={`gender-${gender.id}`}>{gender.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("brands")}>
          MARQUE {openSections.brands ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.brands && (
          <div>
            {filtersData.brands.map((brand) => (
              <div key={brand.id} css={filterOption}>
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  checked={selectedFilters.brands.includes(brand.name)}
                  onChange={() => handleCheckboxChange("brands", brand.name)}
                />
                <label htmlFor={`brand-${brand.id}`}>{brand.name}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("sizes")}>
          TAILLE {openSections.sizes ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.sizes && (
          <div>
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
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("price")}>
          PRIX {openSections.price ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.price && (
          <div>
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
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("ground_types")}>
          TERRAIN
          {openSections.ground_types ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.ground_types && (
          <div>
            {filtersData.ground_types.map((ground_type) => (
              <div key={ground_type.id} css={filterOption}>
                <input
                  type="checkbox"
                  id={`ground-${ground_type.id}`}
                  checked={selectedFilters.ground_types.includes(
                    ground_type.name
                  )}
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
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("uses")}>
          <span css={{ display: "flex", gap: "3px" }}>
            USAGE <IoIosInformationCircleOutline />
          </span>
          {openSections.uses ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.uses && (
          <div>
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
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("stabilities")}>
          <span css={{ display: "flex", gap: "3px" }}>
            STABILITE <IoIosInformationCircleOutline />
          </span>
          {openSections.stabilities ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.stabilities && (
          <div>
            {filtersData.stabilities.map((stability) => (
              <div key={stability.id} css={filterOption}>
                <input
                  type="checkbox"
                  id={`stability-${stability.id}`}
                  checked={selectedFilters.stabilities.includes(stability.name)}
                  onChange={() =>
                    handleCheckboxChange("stabilities", stability.name)
                  }
                />
                <label htmlFor={`stability-${stability.id}`}>
                  {stability.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("drop")}>
          <span>
            DROP <IoIosInformationCircleOutline />
          </span>
          {openSections.drop ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.drop && (
          <div>
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
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("weight")}>
          POIDS {openSections.weight ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.weight && (
          <div>
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
        )}
      </div>
      <div css={filterSection}>
        <div css={filterTitle} onClick={() => toggleSection("colors")}>
          COULEUR {openSections.colors ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <Separator />
        {openSections.colors && (
          <div>
            <div css={colorSwatchContainer}>
              {filtersData.colors.map((color) => {
                const isSelected = selectedFilters.colors.includes(color.name);

                return (
                  <div
                    key={color.name}
                    css={[
                      colorSwatch,
                      { backgroundColor: color.hex_code },
                      isSelected && colorSwatchSelected,
                    ]}
                    onClick={() => handleCheckboxChange("colors", color.name)}
                    title={color.name}
                  >
                    {isSelected && <span css={colorSwatchCheckmark}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
