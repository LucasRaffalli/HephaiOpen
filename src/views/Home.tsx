import { Flex, Button, Text, Box, Container, Heading } from '@radix-ui/themes'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { version, name, author, description, license, type } from '../../package.json';

export default function Home() {


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

