import { useEffect, useState } from "react";

export const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem("isDarkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });

    return [isDarkMode, setIsDarkMode] as const;
};
