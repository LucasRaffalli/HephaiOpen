import { Flex, Text, Heading } from '@radix-ui/themes'
import { version, description, } from '../../package.json';
import { Link } from 'react-router-dom';
import ContainerInterface from '@/components/template/ContainerInterface';

export default function Home() {
  setTimeout(() => {

  }, 20);

  return (
    <ContainerInterface height='100%' padding='4' justify='between'>

      <Flex height={'100%'} width={'100%'} justify={'center'} align={'center'} direction={'column'} >
        <Heading size="8" style={{}}>HephaiOpen // {version}</Heading>
        <Text color="gray" size="4">{description}</Text>
        <Link to={'update'}> update page</Link>
      </Flex>

    </ContainerInterface>
  );
}

