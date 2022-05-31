import { CSSProperties } from "react";
import FaderHintProperties from "./FaderHintProperties";
import FaderProperties from "./FaderProperties";

export default interface SliderBarProps {
    disabled?: boolean;
    max?: number;
    min?: number;
    step?: number;
    value: number;
    className?: string,
    lineColor?: string,
    backgroundColor?: string,
    faderProperties?: FaderProperties;
    faderHintPropertie?: FaderHintProperties;
    width?: number;
    heigth?: number;
    style?: CSSProperties;

    onChange?: (value: number) => void;
}