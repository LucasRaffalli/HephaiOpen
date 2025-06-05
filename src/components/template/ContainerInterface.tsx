import { Flex } from '@radix-ui/themes'
import React from 'react'

interface ContainerInterfaceProps {
    children?: React.ReactNode;
    justify?: "center" | "start" | "end" | "between";
    align?: "center" | "start" | "end" | "baseline" | "stretch";
    gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    height?: string;
    width?: string;
    padding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
    margin?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "-1" | "-2" | "-3" | "-4" | "-5" | "-6" | "-7" | "-8" | "-9";
}

export default function ContainerInterface({ children, align, gap, height, justify, direction, width, margin, padding }: ContainerInterfaceProps) {
    return (
        <Flex position={"relative"} p={padding} m={margin} direction={direction} justify={justify} gap={gap} align={align} height={height} width={width} style={{ background: "var(--gray-1)", border: "1px solid var(--gray-6)", borderRadius: "var(--radius-4)" }}>
            {children}
        </Flex>
    )
}
