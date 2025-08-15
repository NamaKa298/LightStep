import { useSliderWithInput } from "../hooks/use-slider-with-input";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import "./ui/slider-styles.css";

export default function Component() {
  const minValue = 0;
  const maxValue = 200;
  const initialValue = [50, 150];

  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({ minValue, maxValue, initialValue });

  return (
    <div className="*:not-first:mt-3 w-full">
      <Label>Fourchette de prix</Label>
      <div className="flex items-center gap-1">
        <Input
          className="h-8 w-10 px-0 py-0 border-transparent"
          type="text"
          inputMode="decimal"
          value={inputValues[0]}
          onChange={(e) => handleInputChange(e, 0)}
          onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              validateAndUpdateValue(inputValues[0], 0);
            }
          }}
          aria-label="Enter minimum value"
        />
        <Slider
          className="grow"
          value={sliderValue}
          onValueChange={handleSliderChange}
          min={minValue}
          max={maxValue}
          aria-label="Dual range slider with input"
        />
        <Input
          className="h-8 w-10 px-0 py-0 border-transparent"
          type="text"
          inputMode="decimal"
          value={inputValues[1]}
          onChange={(e) => handleInputChange(e, 1)}
          onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              validateAndUpdateValue(inputValues[1], 1);
            }
          }}
          aria-label="Enter maximum value"
        />
      </div>
    </div>
  );
}
