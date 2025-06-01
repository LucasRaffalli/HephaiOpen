import { useEffect, useState } from "react";
import "../../css/smokeEffect.css";
import { Flex, Text } from "@radix-ui/themes";

interface SmokeEffectProps {
    text: string;
    size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    uppercase?: boolean;
    weight?: 'light' | 'regular' | 'medium' | 'bold';
    color?: 'gray';
}

export default function SmokeEffect({ text, size = '3', uppercase = false, weight = 'regular', color }: SmokeEffectProps) {
    const [active, setActive] = useState(false);
    const displayText = uppercase ? text.toUpperCase() : text;

    useEffect(() => {
        const triggerAnimation = () => {
            setActive(true);
            setTimeout(() => setActive(false), 2000);
        };

        triggerAnimation();
        const interval = setInterval(triggerAnimation, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Flex className={`smoke ${active ? "active" : ""}`}>
            {displayText.split(" ").map((word, wordIndex) => (
                <Flex key={`word-${wordIndex}`}>
                    {word.split("").map((char, charIndex) => (
                        <Text color={color} as="span" size={size} weight={weight} key={`${wordIndex}-${charIndex}`} style={{ "--d": `${(wordIndex * word.length + charIndex) / 20}s` } as React.CSSProperties}>
                            {char}
                        </Text>
                    ))}
                    {wordIndex < text.split(" ").length - 1 && (
                        <Text as="span" size={size} weight={weight}>&nbsp;</Text>
                    )}
                </Flex>
            ))}
        </Flex>
    );
}
