import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';

interface PopupDynamiqueProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    children: React.ReactNode;
}

const PopupDynamique: React.FC<PopupDynamiqueProps> = ({ isOpen, onClose, anchorRef, children }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<{ top: number; left: number }>({ top: 0 + 4, left: 0 });

    useLayoutEffect(() => {
        if (isOpen && anchorRef.current) {
            setTimeout(() => {
                if (!popupRef.current || !anchorRef.current) return;

                const anchorRect = anchorRef.current.getBoundingClientRect();
                const popupRect = popupRef.current.getBoundingClientRect();


                let top = anchorRect.top + window.scrollY - popupRect.height - 76;
                let left = anchorRect.left + window.scrollX + (anchorRect.width / 2) - (popupRect.width / 2);

                left = Math.max(16, left);
                left = Math.min(left, window.innerWidth - popupRect.width - 16);


                setStyle({ top, left });
            }, 0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!popupRef.current || !anchorRef.current) return;

            const target = event.target as Element;
            const isSelectInteraction = target.closest('[role="listbox"]') ||
                target.closest('[role="option"]') ||
                target.closest('[data-radix-hover-card-content]');

            if (isSelectInteraction) return;

            if (!popupRef.current.contains(event.target as Node) &&
                !anchorRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen) return null;

    return (

        <div ref={popupRef} style={{ position: 'absolute', zIndex: 9999, top: style.top + 'px' }} className="toolbar-popup-dynamic">
            {children}
        </div>
    );
};

export default PopupDynamique;
