import { Flex, Text, Heading } from '@radix-ui/themes'
import { version, description, } from '../../package.json';

export default function Home() {
  setTimeout(() => {

  }, 20);

  return (
    <>
      <Flex height={'100%'} width={'100%'} justify={'center'} align={'center'} direction={'column'} >
        <Flex justify={'center'} align={'center'} direction={'column'} style={{ background: "var(--gray-a2)", border: "1px dashed var(--gray-a7)", borderRadius: "var(--radius-4)" }} p="8" >
          <Heading size="8" style={{}}>HephaiOpen // {version}</Heading>
          <Text color="gray" size="4">{description}</Text>
        </Flex>
      </Flex>

    </>
  );
}

