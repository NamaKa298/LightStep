/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Star } from "./Star";

type StarRatingProps = {
  rating: number | string;
  reviewCount?: number;
  size?: "small" | "medium" | "large";
};

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  const ContainerStarsandReviewCount = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    font-family: "Manuale", sans-serif;
    font-size: 16px;
  `;
  // Convertir rating en nombre
  const numericRating =
    typeof rating === "string" ? parseFloat(rating) : rating;

  // Vérifier que la note est valide
  if (
    isNaN(numericRating) ||
    numericRating < 0 ||
    numericRating === null ||
    numericRating === undefined
  ) {
    return null;
  }

  // Limiter la note entre 0 et 5
  const clampedRating = Math.min(Math.max(numericRating, 0), 5);

  return (
    <div css={ContainerStarsandReviewCount}>
      <div className="flex">
        {Array.from(Array(5)).map((_, index) => {
          const starSerialNumber = index + 1;

          // Étoile complètement remplie (ex: pour rating=3.8, étoiles 1,2,3 sont pleines)
          if (starSerialNumber <= Math.floor(clampedRating)) {
            return <Star key={starSerialNumber} />;
          }

          // Étoile complètement vide (ex: pour rating=3.8, étoile 5 est vide car 5 > ceil(3.8)=4)
          if (starSerialNumber > Math.ceil(clampedRating)) {
            return <Star key={starSerialNumber} filling={0} />;
          }

          // Étoile partiellement remplie (ex: pour rating=3.8, étoile 4 avec filling=3.8-3=0.8)
          const filling = clampedRating - index;

          return <Star key={starSerialNumber} filling={filling} />;
        })}
      </div>
      {reviewCount !== undefined && reviewCount > 0 && (
        <span className="text-gray-500 text-xs">({reviewCount})</span>
      )}
    </div>
  );
}
