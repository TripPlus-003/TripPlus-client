import Image from 'next/image';
import Link from 'next/link';
import {
  Box,
  Flex,
  List,
  ListItem,
  Container,
  Spacer,
  Button,
  Center,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerFooter,
  Input,
  Icon,
  BoxProps
} from '@chakra-ui/react';

import { AiOutlineSearch } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import { GrClose } from 'react-icons/gr';
import { TbMessageCircle } from 'react-icons/tb';
import { useState, useEffect, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';
import UserImage from '@/assets/images/user/user-image.png';
import MemberMenu from './member-menu';
import Logo from '@/assets/images/logo.png';
import useSWR, { useSWRConfig } from 'swr';
import { apiGetUserAccount } from '@/api/index';

const backendUrl: string | undefined = process.env.BACKEND_URL;

const Header = ({ ...rest }: BoxProps) => {
  const { mutate } = useSWRConfig();

  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const loginStatus = useAuthStore((state) => state.getters.isLogin);
  const [isLogin, setIsLogin] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string>(UserImage.src);

  useEffect(() => {
    if (hasHydrated) {
      setIsLogin(loginStatus);
    }
  }, [hasHydrated, loginStatus]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [transparent, setTransparent] = useState<boolean>(router.route === '/');

  type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

  const [placement, setPlacement] = useState<DrawerPlacement>('top');
  const [openMemberMenu, setOpenMemberMenu] = useState(false);

  const menu = [
    { title: '首頁', url: '/', isShowPc: false },
    { title: '探索', url: '/projects', isShowPc: true },
    { title: '提案', url: backendUrl || '', isShowPc: true }
  ];

  useEffect(() => {
    if (router.route === '/' || router.route === '/about') setTransparent(true);
    setOpenMemberMenu(false);
  }, [router.route]);
  const memberBtnRef = useRef<HTMLButtonElement>(null);
  const memberMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hidePopup = (e: MouseEvent) => {
      if (!memberBtnRef.current) return;
      if (!memberMenuRef.current) return;
      if (
        openMemberMenu &&
        !memberBtnRef.current.contains(e.target as Node) &&
        !memberMenuRef.current.contains(e.target as Node)
      ) {
        setOpenMemberMenu(false);
      }
    };

    const handleClick = (e: unknown) => hidePopup(e as MouseEvent);

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [openMemberMenu]);

  const { data: account } = useSWR(
    ['get', '/api/user/account'],
    apiGetUserAccount,
    {
      revalidateOnMount: false,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        if (data && data.status === 'Success') {
          setUserPhoto(data.data.photo || '');
        }
      }
    }
  );

  useEffect(() => {
    if (isLogin) {
      mutate(['get', '/api/user/account']);
    } else {
      setUserPhoto('');
    }
  }, [isLogin]);

  return (
    <Box
      as="header"
      className={`relative font-medium ${
        transparent
          ? 'border-none bg-transparent'
          : 'border-b-[1px] border-b-gray-200 bg-white '
      } ${isOpen ? '!z-[1500]' : 'z-10'}`}
      py={5}
      {...rest}
    >
      <Container maxW="container.xl" className="md:relative">
        <Flex alignItems="center">
          <Flex alignItems="center">
            <Link href="/">
              <Image
                src={Logo}
                width={172}
                height={48}
                alt="TripPlus Logo"
                className="mr-16"
                priority
              />
            </Link>

            <List gap="12" className="hidden md:flex">
              {menu.map(
                (item) =>
                  item.isShowPc && (
                    <ListItem key={item.title}>
                      <Link
                        href={item.url}
                        target={item.title === '提案' ? '_blank' : '_self'}
                        className="hover:text-[#757575]"
                      >
                        {item.title}
                      </Link>
                    </ListItem>
                  )
              )}
            </List>
          </Flex>

          <Spacer />

          <Box alignItems="center" className="hidden md:flex">
            <Center className="mr-8 cursor-pointer">
              <Icon as={AiOutlineSearch} mr={1} className="text-xl" />
              搜尋
            </Center>

            {hasHydrated && isLogin ? (
              <Flex alignItems={'center'}>
                <Link href="/message" className="mr-6">
                  <Icon
                    as={TbMessageCircle}
                    fontSize={'3xl'}
                    color={'gray.600'}
                    _hover={{ color: 'primary.500' }}
                  />
                </Link>
                <button
                  ref={memberBtnRef}
                  className="h-12 w-12 overflow-hidden rounded-md focus:border-2 focus:border-secondary-emphasis-300"
                  onClick={() => {
                    setOpenMemberMenu(!openMemberMenu);
                  }}
                >
                  <Image
                    src={userPhoto || UserImage}
                    alt="使用者圖片"
                    width={100}
                    height={100}
                    priority
                  />
                </button>
              </Flex>
            ) : (
              <Button colorScheme="primary" width={81}>
                <Link href="/login">登入</Link>
              </Button>
            )}

            {openMemberMenu && (
              <Box
                ref={memberMenuRef}
                className="absolute right-3 top-14 rounded border bg-white pt-1.5 text-center text-sm tracking-widest text-gray-500 shadow-md"
              >
                <MemberMenu
                  onClose={() => {
                    setOpenMemberMenu(false);
                  }}
                />
              </Box>
            )}
          </Box>

          <Box className="cursor-pointer text-xl md:hidden">
            {isOpen ? (
              <Icon as={GrClose} onClick={onClose} />
            ) : (
              <Icon as={FaBars} onClick={onOpen} />
            )}
          </Box>
        </Flex>
      </Container>
      <Drawer placement={placement} onClose={onClose} isOpen={isOpen}>
        <DrawerContent className="!top-20 !z-10" backgroundColor={'#F9F9F9'}>
          <DrawerHeader pt={5} pb={0}>
            <Box pos="relative">
              <Icon
                as={AiOutlineSearch}
                mr={1}
                pos="absolute"
                top="2.5"
                left="5"
                zIndex={2}
                className="cursor-pointer text-xl"
              />

              <Input
                placeholder="搜尋關鍵字"
                backgroundColor={'#ededed'}
                pl={12}
              />
            </Box>
          </DrawerHeader>

          <DrawerBody>
            <List className="text-center">
              {menu.map((item) => (
                <ListItem
                  key={item.title}
                  className="border-b border-[#E9E9E9] last:border-b-0 hover:bg-white"
                >
                  <Link
                    href={item.url}
                    target={item.title === '提案' ? '_blank' : '_self'}
                    className="block py-3"
                  >
                    {item.title}
                  </Link>
                </ListItem>
              ))}
            </List>
          </DrawerBody>

          <DrawerFooter pt={0}>
            {hasHydrated && isLogin ? (
              <Box width={'100%'} textAlign={'center'}>
                <Box
                  bgColor={'gray.200'}
                  py={0.5}
                  color={'secondary-emphasis.500'}
                  mb={3}
                  fontWeight={500}
                >
                  Member
                </Box>
                <MemberMenu onClose={onClose} />
              </Box>
            ) : (
              <Button colorScheme="primary" width={'100%'}>
                <Link href="/login">登入</Link>
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
export default Header;
