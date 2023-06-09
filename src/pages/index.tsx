import { Layout } from '@/components';
import { ReactElement, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import landscape from '@/assets/images/index/mountains-nature-landscape.png';
import landscapeMobile from '@/assets/images/index/mountains-nature-landscape-mobile.png';
import plus from '@/assets/images/plus.png';
import lightbulb from '@/assets/images/identity/lightbulb.svg';
import calendar from '@/assets/images/identity/calendar.svg';
import cardSearch from '@/assets/images/identity/card-search.svg';
import moneyBag from '@/assets/images/identity/money-bag.svg';
import userCheck from '@/assets/images/identity/user-check.svg';
import Banner from '@/components/Swiper/banner';
import Cases from '@/components/Swiper/cases';
import HomeData from '@/components/HomeData';
import { CgInfinity } from 'react-icons/cg';
import { MdChevronRight } from 'react-icons/md';
import useSWR, { useSWRConfig } from 'swr';
import { apiGetHome, apiGetHomeData, apiGetHomeBanner } from '@/api/index';
import { currencyTWD } from '@/utils';
import { GetStaticProps } from 'next';
import Loading from '@/components/Loading';
import {
  Text,
  Box,
  Container,
  Heading,
  Flex,
  Progress
} from '@chakra-ui/react';

const Index = () => {
  const [bannerList, setBannerList] = useState<ApiHome.BannerItem[]>([]);
  const [hotItemList, setHotItemList] = useState<ApiHome.Item[]>([]);
  const [newItemList, setNewItemList] = useState<ApiHome.Item[]>([]);
  const [caseList, setCaseList] = useState<ApiHome.Item[]>([]);
  const [homeData, setHomeData] = useState<ApiHome.HomeData>({
    sponsorCount: 0,
    successCount: 0,
    sum: 0
  });

  const { data } = useSWR(['get', '/api/home'], apiGetHome, {
    onSuccess(data, key, config) {
      if (data && data.status === 'Success') {
        getHome(data.data);
      }
    }
  });

  const { data: statistics } = useSWR(
    ['get', '/api/homeData'],
    apiGetHomeData,
    {
      onSuccess(data, key, config) {
        if (data && data.status === 'Success') {
          getHomeData(data.data);
        }
      }
    }
  );

  const { data: banner, isLoading } = useSWR(
    ['get', '/api/home/banner'],
    apiGetHomeBanner,
    {
      onSuccess(data, key, config) {
        if (data && data.status === 'Success') {
          getHomeBanner(data.data);
        }
      }
    }
  );

  const getHome = (data: ApiHome.Home) => {
    setHotItemList(data.hot);
    setNewItemList(data.latest);
    setCaseList(data.success);
  };

  const getHomeData = (data: ApiHome.HomeData) => {
    setHomeData(data);
  };

  const getHomeBanner = (data: ApiHome.BannerItem[]) => {
    setBannerList(data);
  };

  const getCategory = (value: number) => {
    switch (value) {
      case 0:
        return '社會計劃';
      case 1:
        return '創新設計';
      case 2:
        return '精選商品';
      default:
        return '';
    }
  };

  const category = [
    {
      title: '社會企劃',
      url: '/projects?sort=all&category=0'
    },
    {
      title: '創新設計',
      url: '/projects?sort=all&category=1'
    },
    {
      title: '精選商品',
      url: '/projects?sort=all&category=2'
    }
  ];

  const identityList = [
    {
      image: lightbulb,
      width: 38,
      height: 50,
      text: '100% 原創設計'
    },
    {
      image: userCheck,
      width: 45,
      height: 50,
      text: '完整提案者資訊'
    },
    {
      image: moneyBag,
      width: 50,
      height: 50,
      text: '平台基金保障'
    },
    {
      image: cardSearch,
      width: 60,
      height: 60,
      text: '公信力檢驗'
    },
    {
      image: calendar,
      width: 50,
      height: 49,
      text: '專案進度公開透明'
    }
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>Fund Your Next Adventure-TripPlus+</title>
      </Head>
      <Box className="flex flex-col items-center justify-center">
        <Image
          src={landscape}
          alt="mountains-nature-landscape"
          width={1920}
          height={240}
          className="absolute left-0 top-0 hidden object-cover md:block md:h-[440px]"
          priority
        ></Image>
        <Image
          src={landscapeMobile}
          alt="mountains-nature-landscape"
          width={768}
          height={508}
          className="absolute left-0 top-0 object-cover md:hidden md:h-[440px]"
          priority
        ></Image>
      </Box>
      <Box className="mt-[210px] ss:mt-[300px] sm:mt-[380px] md:mb-5">
        <Flex justifyContent="center">
          {category.map((item) => {
            return (
              <Link
                key={item.title}
                href={item.url}
                className="border-r-[1px] border-gray-200 px-5 text-sm font-medium last:border-r-0 hover:text-gray-500 md:px-12 md:text-base"
              >
                {item.title}
              </Link>
            );
          })}
        </Flex>
      </Box>
      <Banner bannerList={bannerList} />
      <Box as="section" className="bg-gray-100 py-10 md:py-20">
        <Container maxW="container.xl">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom={{ xs: '20px', md: '40px' }}
            className="text-gray-600"
          >
            <Text
              fontSize={{ xs: '28px', md: '32px' }}
              fontWeight={700}
              className="relative"
            >
              熱門項目
              <Image
                src={plus}
                alt="plus"
                width={20}
                height={20}
                priority
                className="absolute right-[-20px] top-0"
              ></Image>
            </Text>
            <Link
              href="/projects?sort=hot_project"
              className="flex items-center text-sm md:text-base"
            >
              查看更多
              <MdChevronRight className="text-2xl" />
            </Link>
          </Flex>
          <Box>
            <Box className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {hotItemList.map((item) => {
                return (
                  <Flex direction="column" key={item.title}>
                    <Link
                      href={`/project/${item._id}`}
                      className="aspect-ratio aspect-ratio-10x7 relative"
                    >
                      <Image
                        src={item.keyVision}
                        alt={item.title}
                        width={800}
                        height={560}
                        priority
                        className="aspect-ratio-object rounded-lg transition-opacity duration-300 hover:opacity-75"
                      ></Image>
                      <span className="absolute right-3 top-3 z-[200] rounded bg-red p-2 text-xs text-white md:text-sm">
                        紅利回饋
                      </span>
                    </Link>
                    <Box
                      py={4}
                      height={250}
                      className="flex flex-col justify-between"
                    >
                      <Box>
                        <Text
                          fontSize={{ xs: '12px', md: '14px' }}
                          className="text-gray-600"
                        >
                          {getCategory(item.category)}
                        </Text>
                        <Link href={`/project/${item._id}`}>
                          <Heading
                            fontSize={{ xs: '16px', md: '20px' }}
                            fontWeight={500}
                            my={2}
                            className="line-clamp-2 text-gray-900 hover:text-secondary-emphasis"
                          >
                            {item.title}
                          </Heading>
                        </Link>
                        <Link
                          href={`/organization/${item.teamId._id}`}
                          className="text-xs leading-6 text-secondary-emphasis hover:text-secondary-emphasis-400 md:text-sm"
                        >
                          {item.teamId.title}
                        </Link>
                      </Box>
                      <Box>
                        <Text
                          fontSize={{ xs: '18px', md: '20px' }}
                          fontWeight={500}
                          className="text-gray-900"
                        >
                          {currencyTWD(item.target)}
                        </Text>
                        <Progress
                          colorScheme="primary"
                          size="sm"
                          value={item.progressRate}
                          className="mb-[18px] mt-4 rounded-[6px] !bg-gray-200"
                        />
                        <Box className="flex justify-between">
                          <Text
                            fontSize={{ xs: '14px', md: '16px' }}
                            className="text-gray-900"
                          >
                            {item.progressRate}%
                          </Text>
                          <Text fontSize={{ xs: '12px', md: '14px' }}>
                            倒數 {item.countDownDays} 天
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <Box as="section" className="bg-gray-100 pb-[80px]">
        <Container maxW="container.xl">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom={{ xs: '20px', md: '40px' }}
            className="text-gray-600"
          >
            <Text
              fontSize={{ xs: '28px', md: '32px' }}
              fontWeight={700}
              className="relative"
            >
              最新項目
              <Image
                src={plus}
                alt="plus"
                width={20}
                height={20}
                priority
                className="absolute right-[-20px] top-0"
              ></Image>
            </Text>
            <Link
              href="/projects?sort=recently_launched"
              className="flex items-center text-sm md:text-base"
            >
              查看更多
              <MdChevronRight className="text-2xl" />
            </Link>
          </Flex>
          <Box>
            <Box className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {newItemList.map((item) => {
                return (
                  <Flex direction="column" key={item.title}>
                    <Link
                      href={`/project/${item._id}`}
                      className="aspect-ratio aspect-ratio-10x7 relative"
                    >
                      <Image
                        src={item.keyVision}
                        alt={item.title}
                        width={800}
                        height={560}
                        priority
                        className="aspect-ratio-object rounded-lg transition-opacity duration-300 hover:opacity-75"
                      ></Image>
                      <span className="absolute right-3 top-3 z-[200] rounded bg-red p-2 text-xs text-white md:text-sm">
                        紅利回饋
                      </span>
                    </Link>
                    <Box
                      py={4}
                      height={250}
                      className="flex flex-col justify-between"
                    >
                      <Box>
                        <Text
                          fontSize={{ xs: '12px', md: '14px' }}
                          className="text-gray-600"
                        >
                          {getCategory(item.category)}
                        </Text>
                        <Link href={`/project/${item._id}`}>
                          <Heading
                            fontSize={{ xs: '16px', md: '20px' }}
                            fontWeight={500}
                            my={2}
                            className="line-clamp-2 text-gray-900 hover:text-secondary-emphasis"
                          >
                            {item.title}
                          </Heading>
                        </Link>
                        <Link
                          href={`/organization/${item.teamId._id}`}
                          className="text-xs leading-6 text-secondary-emphasis hover:text-secondary-emphasis-400 md:text-sm"
                        >
                          {item.teamId.title}
                        </Link>
                      </Box>
                      <Box>
                        <Text
                          fontSize={{ xs: '18px', md: '20px' }}
                          fontWeight={500}
                          className="text-gray-900"
                        >
                          {currencyTWD(item.target)}
                        </Text>
                        <Progress
                          colorScheme="primary"
                          size="sm"
                          value={item.progressRate}
                          className="mb-[18px] mt-4 rounded-[6px] !bg-gray-200"
                        />
                        <Box className="flex justify-between">
                          <Text
                            fontSize={{ xs: '14px', md: '16px' }}
                            className="text-gray-900"
                          >
                            {item.progressRate}%
                          </Text>
                          <Text fontSize={{ xs: '12px', md: '14px' }}>
                            倒數 {item.countDownDays} 天
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <Box as="section" className="bg-secondary-light">
        <Container maxW="container.xl" className="py-[60px] md:py-[100px]">
          <Box className="flex justify-center">
            <Text
              fontSize={{ xs: '36px', md: '48px' }}
              className="flex content-center items-center font-alkatra"
            >
              Why
              <Image
                src="/images/logo.png"
                alt="logo"
                width={208}
                height={58}
                priority
                className="md:[208px] mx-3 w-[130px]"
              ></Image>
              ?
            </Text>
          </Box>
          <Box className="mt-[45px] flex flex-col items-center md:mt-[65px]  md:flex-row md:justify-between md:[&>*:last-child]:mb-[44px] [&>*:not(:last-child)]:mb-[44px]">
            {identityList.map((identity) => {
              return (
                <Box
                  className="flex flex-col items-center md:mb-0"
                  key={identity.text}
                >
                  <Image
                    src={identity.image}
                    alt={identity.text}
                    width={identity.width}
                    height={identity.height}
                    style={{
                      width: identity.width + 'px',
                      height: identity.height + 'px'
                    }}
                  ></Image>
                  <Text
                    fontSize={{ xs: '16px', md: '18px' }}
                    fontWeight={500}
                    className="mt-[20px]"
                  >
                    {identity.text}
                  </Text>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
      <Box as="section" className="py-[80px]">
        <Container maxW="container.xl">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            marginBottom={{ xs: '20px', md: '40px' }}
            className="text-gray-600"
          >
            <Text
              fontSize={{ xs: '28px', md: '32px' }}
              fontWeight={700}
              className="relative"
            >
              精選商品
              <Image
                src={plus}
                alt="plus"
                width={20}
                height={20}
                priority
                className="absolute right-[-20px] top-0"
              ></Image>
            </Text>
            <Link
              href="/projects?sort=all&category=2"
              className="flex items-center text-sm md:text-base"
            >
              查看更多
              <MdChevronRight className="text-2xl" />
            </Link>
          </Flex>
          <Box>
            {/* TODO: 待有商品資料後再進行修改 */}
            <Box className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {newItemList.map((item) => {
                return (
                  <Flex direction="column" key={item.title}>
                    <Link
                      href={`/product/${item._id}`}
                      className="aspect-ratio aspect-ratio-10x7 relative"
                    >
                      <Image
                        src={item.keyVision}
                        alt={item.title}
                        width={800}
                        height={560}
                        priority
                        className="aspect-ratio-object rounded-lg transition-opacity duration-300 hover:opacity-75"
                      ></Image>
                      <span className="absolute right-3 top-3 z-[200] rounded bg-red p-2 text-xs text-white md:text-sm">
                        可用紅利
                      </span>
                    </Link>
                    <Box
                      py={4}
                      height={210}
                      className="flex flex-col justify-between"
                    >
                      <Box>
                        <Text
                          fontSize={{ xs: '12px', md: '14px' }}
                          className="text-gray-600"
                        >
                          {getCategory(item.category)}
                        </Text>
                        <Link href={`/product/${item._id}`}>
                          <Heading
                            fontSize={{ xs: '16px', md: '20px' }}
                            fontWeight={500}
                            my={2}
                            className="line-clamp-2 text-gray-900 hover:text-secondary-emphasis"
                          >
                            {item.title}
                          </Heading>
                        </Link>
                        <Link
                          href={`/organization/${item.teamId._id}`}
                          className="text-xs leading-6 text-secondary-emphasis hover:text-secondary-emphasis-400 md:text-sm"
                        >
                          {item.teamId.title}
                        </Link>
                      </Box>
                      <Box>
                        <Progress
                          colorScheme="success"
                          size="sm"
                          value={100}
                          className="mb-[18px] mt-4 rounded-[6px] !bg-gray-200"
                        />
                        <Box className="flex items-center justify-end text-gray">
                          <CgInfinity className="mr-1 text-lg md:text-xl" />
                          <Text fontSize={{ xs: '12px', md: '14px' }}>
                            長期販售
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>
      <Box as="section" className="bg-gray-100 py-[40px] md:py-[80px]">
        <Container maxW="container.xl">
          <Heading className="mb-5 text-center text-[32px] font-bold md:mb-10">
            成功案例
          </Heading>
          <Cases caseList={caseList} />
        </Container>
      </Box>

      <HomeData
        successCount={homeData.successCount}
        sum={homeData.sum}
        sponsorCount={homeData.sponsorCount}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {}
  };
};

export default Index;

Index.getLayout = function (page: ReactElement) {
  return (
    <Layout>
      <div>{page}</div>
    </Layout>
  );
};
