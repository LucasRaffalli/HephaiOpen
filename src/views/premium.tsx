import SmokeEffect from '@/components/design/SmokeEffect';
import '@/css/premium.css';
import '@/css/component/holographic.css';
import ContainerInterface from '@/components/template/ContainerInterface';
import CardStylized from '@/components/design/CardStylized';
import ParallaxEffect from '@/components/design/ParallaxEffect';
import { Box } from '@radix-ui/themes';

export default function Premium() {
    return (
        <>
            <ContainerInterface padding='4' justify="center" align="center" direction="column" height='100%'>
                <ParallaxEffect intensity={0.7} perspective={1200} tiltMax={45} deadzoneX={0.1} deadzoneY={0.245}>
                    <CardStylized
                        isGrayTop
                        sizeTextSmall="3"
                        uppercase
                        sizeText='4'
                        weight='bold'
                        contentTop="Premium features, Elegant & intuitive design, Instant Online Access"
                        topSmallText="An optimised experience for simplified, efficient management."
                        bottomTitle="hephai Premium"
                        bottomDescription={<SmokeEffect text="coming soon" size='2' uppercase weight='medium' color='gray' />}
                    />
                </ParallaxEffect>

                <Box className='shadowCard'></Box>
            </ContainerInterface>


        </>
    );
}
