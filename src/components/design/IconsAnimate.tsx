'use client';

import { IconProperties } from '@/types/hephai';
import { motion, useAnimation } from 'motion/react';
import type { Transition, Variants } from 'motion/react';
import { forwardRef, HTMLAttributes, useCallback, useImperativeHandle, useRef } from 'react';

export interface ExpandIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

const defaultTransition: Transition = {
    type: 'spring',
    stiffness: 250,
    damping: 25,
};
const lidVariants: Variants = {
    normal: { y: 0 },
    animate: { y: -1.1 },
};

const springTransition = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
};

const sparkleVariants: Variants = {
    initial: {
        y: 0,
        fill: 'none',
    },
    hover: {
        y: [0, -1, 0, 0],
        fill: 'currentColor',
        transition: {
            duration: 1,
            bounce: 0.3,
        },
    },
};

const starVariants: Variants = {
    initial: {
        opacity: 1,
        x: 0,
        y: 0,
    },
    blink: () => ({
        opacity: [0, 1, 0, 0, 0, 0, 1],
        transition: {
            duration: 2,
            type: 'spring',
            stiffness: 70,
            damping: 10,
            mass: 0.4,
        },
    }),
};

const penVariants: Variants = {
    normal: {
        rotate: 0,
        x: 0,
        y: 0,
    },
    animate: {
        rotate: [-0.5, 0.5, -0.5],
        x: [0, -1, 1.5, 0],
        y: [0, 1.5, -1, 0],
    },
};

const SettingsGearIcon = ({ size = 20 }: IconProperties) => {
    const controls = useAnimation();

    return (
        <div
            className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={() => controls.start('animate')}
            onMouseLeave={() => controls.start('normal')}
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                variants={{
                    normal: {
                        rotate: 0,
                    },
                    animate: {
                        rotate: 180,
                    },
                }}
                animate={controls}
            >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
            </motion.svg>
        </div>
    );
};
const DeleteIcon = ({ size = 20 }: IconProperties) => {
    const controls = useAnimation();

    return (
        <div
            className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={() => controls.start('animate')}
            onMouseLeave={() => controls.start('normal')}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.g
                    variants={lidVariants}
                    animate={controls}
                    transition={springTransition}
                >
                    <path d="M3 6h18" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </motion.g>
                <motion.path
                    d="M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8"
                    variants={{
                        normal: { d: 'M19 8v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V8' },
                        animate: { d: 'M19 9v12c0 1-1 2-2 2H7c-1 0-2-1-2-2V9' },
                    }}
                    animate={controls}
                    transition={springTransition}
                />
                <motion.line
                    x1="10"
                    x2="10"
                    y1="11"
                    y2="17"
                    variants={{
                        normal: { y1: 11, y2: 17 },
                        animate: { y1: 11.5, y2: 17.5 },
                    }}
                    animate={controls}
                    transition={springTransition}
                />
                <motion.line
                    x1="14"
                    x2="14"
                    y1="11"
                    y2="17"
                    variants={{
                        normal: { y1: 11, y2: 17 },
                        animate: { y1: 11.5, y2: 17.5 },
                    }}
                    animate={controls}
                    transition={springTransition}
                />
            </svg>
        </div>
    );
}

const SparklesIcon = ({ size = 20 }: IconProperties) => {
    const starControls = useAnimation();
    const sparkleControls = useAnimation();

    return (
        <div
            className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={() => {
                sparkleControls.start('hover');
                starControls.start('blink', { delay: 1 });
            }}
            onMouseLeave={() => {
                sparkleControls.start('initial');
                starControls.start('initial');
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                    variants={sparkleVariants}
                    animate={sparkleControls}
                />
                <motion.path
                    d="M20 3v4"
                    variants={starVariants}
                    animate={starControls}
                />
                <motion.path
                    d="M22 5h-4"
                    variants={starVariants}
                    animate={starControls}
                />
                <motion.path
                    d="M4 17v2"
                    variants={starVariants}
                    animate={starControls}
                />
                <motion.path
                    d="M5 18H3"
                    variants={starVariants}
                    animate={starControls}
                />
            </svg>
        </div>
    );
};

const SquarePenIcon = ({ size = 20 }: IconProperties) => {
    const controls = useAnimation();

    return (
        <div
            className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={() => controls.start('animate')}
            onMouseLeave={() => controls.start('normal')}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <motion.path
                    d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                    variants={penVariants}
                    animate={controls}
                    transition={{
                        duration: 0.5,
                        repeat: 1,
                        ease: 'easeInOut',
                    }}
                />
            </svg>
        </div>
    );
};

const ExpandIcon = forwardRef<ExpandIconHandle, HTMLAttributes<HTMLDivElement> & { size?: number }>(
    ({ onMouseEnter, onMouseLeave, size = 20, ...props }, ref) => {
        const controls = useAnimation();
        const isControlledRef = useRef(false);

        useImperativeHandle(ref, () => {
            isControlledRef.current = true;

            return {
                startAnimation: () => controls.start('animate'),
                stopAnimation: () => controls.start('normal'),
            };
        });

        const handleMouseEnter = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlledRef.current) {
                    controls.start('animate');
                } else {
                    onMouseEnter?.(e);
                }
            },
            [controls, onMouseEnter]
        );

        const handleMouseLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlledRef.current) {
                    controls.start('normal');
                } else {
                    onMouseLeave?.(e);
                }
            },
            [controls, onMouseLeave]
        );

        return (
            <div
                className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...props}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <motion.path
                        d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"
                        transition={defaultTransition}
                        variants={{
                            normal: { translateX: '0%', translateY: '0%' },
                            animate: { translateX: '2px', translateY: '2px' },
                        }}
                        animate={controls}
                    />
                    <motion.path
                        d="M3 16.2V21m0 0h4.8M3 21l6-6"
                        transition={defaultTransition}
                        variants={{
                            normal: { translateX: '0%', translateY: '0%' },
                            animate: { translateX: '-2px', translateY: '2px' },
                        }}
                        animate={controls}
                    />
                    <motion.path
                        d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
                        transition={defaultTransition}
                        variants={{
                            normal: { translateX: '0%', translateY: '0%' },
                            animate: { translateX: '2px', translateY: '-2px' },
                        }}
                        animate={controls}
                    />
                    <motion.path
                        d="M3 7.8V3m0 0h4.8M3 3l6 6"
                        transition={defaultTransition}
                        variants={{
                            normal: { translateX: '0%', translateY: '0%' },
                            animate: { translateX: '-2px', translateY: '-2px' },
                        }}
                        animate={controls}
                    />
                </svg>
            </div>
        );
    }
);

ExpandIcon.displayName = 'ExpandIcon';

export interface DownloadIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

const arrowVariants: Variants = {
    normal: { y: 0 },
    animate: {
        y: 2,
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 10,
            mass: 1,
        },
    },
};

const DownloadIcon = forwardRef<
    DownloadIconHandle,
    HTMLAttributes<HTMLDivElement>
>(({ onMouseEnter, onMouseLeave, ...props }, ref, size = 20) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
        isControlledRef.current = true;

        return {
            startAnimation: () => controls.start('animate'),
            stopAnimation: () => controls.start('normal'),
        };
    });

    const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isControlledRef.current) {
                controls.start('animate');
            } else {
                onMouseEnter?.(e);
            }
        },
        [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!isControlledRef.current) {
                controls.start('normal');
            } else {
                onMouseLeave?.(e);
            }
        },
        [controls, onMouseLeave]
    );

    return (
        <div
            className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <motion.g variants={arrowVariants} animate={controls}>
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                </motion.g>
            </svg>
        </div>
    );
});

DownloadIcon.displayName = 'DownloadIcon';



export { SettingsGearIcon, DeleteIcon, SparklesIcon, SquarePenIcon, ExpandIcon, DownloadIcon };
