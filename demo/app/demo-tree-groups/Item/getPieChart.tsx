import * as React from 'react';
interface Sector {
    percentage: number;
    label: string;
    color: string;
}
export interface CalculatedSector extends Sector {
    color: string;
    arcSweep: number;
    L: number;
    X: number;
    Y: number;
    R: number;
}
export interface Data {
    size: number;
    sectors: Sector[];
}
export default function calculateSectors(data: Data): JSX.Element[] {
    let paths: JSX.Element[] = [];
    let l = data.size / 2;
    let a = 0; // Angle
    let aRad = 0; // Angle in Rad
    let z = 0; // Size z
    let x = 0; // Side x
    let y = 0; // Side y
    let X = 0; // SVG X coordinate
    let Y = 0; // SVG Y coordinate
    let R = 0; // Rotation

    data.sectors
        .map(function (item, key) {
            let arcSweep;
            a = 360 * item.percentage;
            const aCalc = (a > 180)
                ? 360 - a
                : a;
            aRad = aCalc * Math.PI / 180;
            z = Math.sqrt(2 * l * l - (2 * l * l * Math.cos(aRad)));
            if (aCalc <= 90) {
                x = l * Math.sin(aRad);
            } else {
                x = l * Math.sin((180 - aCalc) * Math.PI / 180);
            }
            y = Math.sqrt(z * z - x * x);
            Y = y;
            if (a <= 180) {
                X = l + x;
                arcSweep = 0;
            } else {
                X = l - x;
                arcSweep = 1;
            }

            paths.push(<path
                fill={item.color}
                d={`M${l},${l} L${l},0 A${l},${l} 1 0,1 ${X}, ${Y} z`}
                transform={`rotate(${R},${l},${l})`}
                mask="url(#cut-out-middle)"/>);

            R = R + a;
        });

    return paths;
}
