import Link from 'next/link';
import Image from 'next/image';
import { Box, List, ListItem, Flex, Container, Spacer } from '@chakra-ui/react';
import Logo from '@/assets/images/logo.png';

const Footer = () => {
  const footerMenu = [
    {
      title: '關於',
      list: [
        { title: '關於我們', url: '/about' },
        { title: '使用條款', url: '/terms' },
        { title: '隱私權政策', url: '/privacy' }
      ]
    },
    {
      title: '協助',
      list: [
        { title: '常見問題', url: '/faq' },
        { title: '提案教學', url: '/teach' },
        { title: '聯絡我們', url: '/about' }
      ]
    }
  ];

  return (
    <Box as="footer" className="mt-auto py-10 md:py-20">
      <Container maxW="container.xl">
        <Flex className="flex-col md:flex-row md:justify-between">
          <Flex className="flex-col text-center font-medium md:flex-row md:text-left">
            {footerMenu.map((item) => (
              <List key={item.title} className="my-5 md:my-0 md:mr-20">
                <Box mb={3} className="text-lg">
                  {item.title}
                </Box>
                {item.list.map((subItem) => (
                  <ListItem key={subItem.title} py={1}>
                    <Link href={subItem.url} className="hover:text-[#757575]">
                      {subItem.title}
                    </Link>
                  </ListItem>
                ))}
              </List>
            ))}
          </Flex>

          <Flex
            flexFlow={'column'}
            className="mt-10 items-center md:mt-0 md:items-end"
          >
            <Link href="/">
              <Image
                src={Logo}
                width={172}
                height={48}
                alt="TripPlus Logo"
                priority
              />
            </Link>

            <Spacer />

            <Box color={'light'} textAlign={'center'}>
              Copyright © 2023 TripPlus. All rights reserved.
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
