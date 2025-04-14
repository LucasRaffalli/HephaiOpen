import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const paths = [
    "M86.2903 0.674316V0.758636H36.0603C35.8867 0.758636 35.7131 0.758636 35.5395 0.768556C21.1952 1.11576 19.0823 21.9428 33.1587 24.7105C33.9722 24.8642 34.7906 24.9535 35.6189 24.9486C35.7429 24.9486 62.6261 24.9486 62.7501 24.9486C62.9039 24.9486 63.0279 25.0874 63.0279 25.261C63.0279 25.4346 62.9088 25.5735 62.7501 25.5735C62.6311 25.5735 35.7479 25.5735 35.6239 25.5735C22.3211 26.2382 15.268 42.1746 15.268 55.1054V93.0593C15.0895 103.951 9.38051 115.523 1.52387 122.596C0.710429 123.325 1.23123 124.669 2.32243 124.669H15.268V124.585H65.4979C65.6715 124.585 65.8451 124.585 66.0187 124.575C80.3631 124.228 82.476 103.401 68.3995 100.633C67.5861 100.479 66.7677 100.39 65.9394 100.395C65.8154 100.395 38.9322 100.395 38.8082 100.395C38.6544 100.395 38.5304 100.256 38.5304 100.083C38.5304 99.909 38.6495 99.7702 38.8082 99.7702C38.9272 99.7702 65.8104 99.7702 65.9344 99.7702C79.2371 99.1055 86.2903 83.169 86.2903 70.2383V32.2844C86.4688 21.3922 92.1778 9.82056 100.034 2.7476C100.848 2.01848 100.327 0.674316 99.2359 0.674316H86.2903Z",
    "M116.492 15.0484H96.2896C96.0367 15.0484 95.8035 15.1823 95.6795 15.4055C92.6936 20.7226 90.8435 26.754 90.7493 32.3241V70.2433C90.7493 70.8583 90.7344 71.4783 90.7096 72.0983C90.6799 72.7778 91.6421 72.9316 91.8306 72.2818C99.0871 47.2289 98.9283 40.1113 104.221 30.7468C106.448 26.8086 110.212 21.4518 116.849 16.0751C117.27 15.7329 117.032 15.0534 116.492 15.0534V15.0484Z",
];

export default function HephaiLoader() {
    const controls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            // Tracé
            await controls.start({
                pathLength: 1,
                transition: { duration: 2, ease: "easeInOut" }
            });

            // Remplissage
            await controls.start({
                fill: "white",
                transition: { duration: 1.5, ease: "easeInOut" }
            });

            // Pause remplissage visible
            await new Promise((res) => setTimeout(res, 2000));

            // Unfill
            await controls.start({
                fill: "transparent",
                transition: { duration: 1.5, ease: "easeInOut" }
            });

            // ⚠️ Attente que le fill disparaisse bien
            await new Promise((res) => setTimeout(res, 1600));

            // Détracé
            await controls.start({
                pathLength: 0,
                transition: { duration: 2, ease: "easeInOut" }
            });

            // Petite pause avant de recommencer
            await new Promise((res) => setTimeout(res, 1000));

            sequence();
        };

        sequence();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <svg
                viewBox="0 0 125 125"
                xmlns="http://www.w3.org/2000/svg"
                className="w-64 h-64"
            >
                {paths.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{
                            pathLength: 0,
                            fill: "transparent",
                        }}
                        animate={controls}
                        style={{
                            transition: "fill 1.5s ease-in-out",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}
