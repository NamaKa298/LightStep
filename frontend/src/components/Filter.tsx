/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

// Types TypeScript
type FiltreOption = {
  id: string;
  label: string;
  count?: number;
};

type FiltreCategorie = {
  id: string;
  label: string;
  options: FiltreOption[];
};

export default function Filtres() {
  // État pour les filtres
  const [categoriesFiltres, setCategoriesFiltres] = useState<FiltreCategorie[]>([]);
  const [filtresActifs, setFiltresActifs] = useState<Record<string, string[]>>({});
  const [dropdownOuvert, setDropdownOuvert] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement des filtres depuis le backend
  useEffect(() => {
    const chargerFiltres = async () => {
      try {
        const response = await fetch("/api/filtres");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: FiltreCategorie[] = await response.json();
        setCategoriesFiltres(data);
      } catch (err) {
        console.error("Erreur de chargement des filtres", err);
        setError("Impossible de charger les filtres. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    chargerFiltres();
  }, []);

  // Gestion des interactions
  const toggleDropdown = (categorieId: string) => {
    setDropdownOuvert(dropdownOuvert === categorieId ? null : categorieId);
  };

  const toggleFiltre = (categorieId: string, optionId: string) => {
    setFiltresActifs((prev) => {
      const currentSelections = prev[categorieId] || [];
      const nouvellesSelections = currentSelections.includes(optionId)
        ? currentSelections.filter((id) => id !== optionId)
        : [...currentSelections, optionId];

      return {
        ...prev,
        [categorieId]: nouvellesSelections,
      };
    });
  };

  const supprimerFiltre = (categorieId: string, optionId: string) => {
    setFiltresActifs((prev) => {
      const nouvellesSelections = prev[categorieId]?.filter((id) => id !== optionId) || [];
      return {
        ...prev,
        [categorieId]: nouvellesSelections,
      };
    });
  };

  const effacerTousLesFiltres = () => {
    setFiltresActifs({});
  };

  // États de chargement et d'erreur
  if (loading) {
    return (
      <div css={styles.container}>
        <h2 css={styles.title}>Filtrer les produits</h2>
        <div css={styles.loadingError}>Chargement des filtres...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div css={styles.container}>
        <h2 css={styles.title}>Filtrer</h2>
        <div css={[styles.loadingError, styles.error]}>{error}</div>
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <h2 css={styles.title}>Filtrer</h2>

      {/* Filtres actifs */}
      <div css={styles.activeFilters}>
        {Object.entries(filtresActifs).map(([categorieId, options]) =>
          options?.map((optionId) => {
            const categorie = categoriesFiltres.find((c) => c.id === categorieId);
            const option = categorie?.options.find((o) => o.id === optionId);

            return option ? (
              <span key={`${categorieId}-${optionId}`} css={styles.filterBadge}>
                {option.label}
                <button
                  onClick={() => supprimerFiltre(categorieId, optionId)}
                  css={styles.removeButton}
                  aria-label={`Retirer le filtre ${option.label}`}
                >
                  ×
                </button>
              </span>
            ) : null;
          })
        )}

        {Object.values(filtresActifs).some((options) => options?.length > 0) && (
          <button onClick={effacerTousLesFiltres} css={styles.clearAllButton} aria-label="Effacer tous les filtres">
            Effacer tout
          </button>
        )}
      </div>

      {/* Dropdowns des filtres */}
      <div css={styles.dropdownsContainer}>
        {categoriesFiltres.map((categorie) => {
          const isOpen = dropdownOuvert === categorie.id;
          return (
            <div key={categorie.id} css={styles.dropdownWrapper}>
              <button
                css={styles.dropdownButton(isOpen)}
                onClick={() => toggleDropdown(categorie.id)}
                aria-expanded={isOpen}
                aria-controls={`dropdown-${categorie.id}`}
              >
                {categorie.label}
                <span css={styles.dropdownIcon(isOpen)} aria-hidden="true">
                  ▼
                </span>
              </button>

              {isOpen && (
                <div id={`dropdown-${categorie.id}`} css={styles.dropdownContent} role="menu">
                  {categorie.options.map((option) => (
                    <label key={option.id} css={styles.filterOption}>
                      <input
                        type="checkbox"
                        checked={filtresActifs[categorie.id]?.includes(option.id) || false}
                        onChange={() => toggleFiltre(categorie.id, option.id)}
                        aria-label={`Filtrer par ${option.label}`}
                      />
                      <span>
                        {option.label}
                        {option.count !== undefined && <span css={styles.count}> ({option.count})</span>}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: css`
    font-family: "Arial", sans-serif;
    max-width: 300px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  `,
  title: css`
    margin-top: 0;
    font-size: 1.5rem;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  `,
  loadingError: css`
    padding: 15px;
    text-align: center;
    color: #666;
  `,
  error: css`
    color: #dc3545;
  `,
  activeFilters: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  `,
  filterBadge: css`
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    background-color: #e9ecef;
    border-radius: 20px;
    font-size: 0.9rem;
  `,
  removeButton: css`
    margin-left: 5px;
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    &:hover {
      color: #dc3545;
    }
  `,
  clearAllButton: css`
    background: none;
    border: none;
    color: #0d6efd;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 5px;
    &:hover {
      text-decoration: underline;
    }
  `,
  dropdownsContainer: css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
  dropdownWrapper: css`
    position: relative;
  `,
  dropdownButton: (isOpen: boolean) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 15px;
    background-color: ${isOpen ? "#e9ecef" : "white"};
    border: 1px solid #ced4da;
    border-radius: ${isOpen ? "4px 4px 0 0" : "4px"};
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
    &:hover {
      background-color: #f1f1f1;
    }
  `,
  dropdownIcon: (isOpen: boolean) => css`
    font-size: 0.7rem;
    transition: transform 0.2s;
    transform: ${isOpen ? "rotate(180deg)" : "none"};
  `,
  dropdownContent: css`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ced4da;
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding: 10px;
    z-index: 100;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
  `,
  filterOption: css`
    display: flex;
    align-items: center;
    padding: 8px 5px;
    cursor: pointer;
    font-size: 0.9rem;
    &:hover {
      background-color: #f8f9fa;
    }
    input {
      margin-right: 10px;
      cursor: pointer;
    }
  `,
  count: css`
    color: #6c757d;
    font-size: 0.8rem;
    margin-left: 5px;
  `,
};
