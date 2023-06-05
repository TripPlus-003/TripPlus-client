import Pagination from '@/components/Pagination';
import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import useSWR, { useSWRConfig } from 'swr';
import { apiGetProject } from '@/api';
import { currency } from '@/utils';
import { Box, Container, Center, Flex, Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const category = [
  { name: '全部主題', value: '' },
  { name: '社會計劃', value: 0 },
  { name: '創新設計', value: 1 },
  { name: '精選商品', value: 2 }
];

const tabs = [
  { name: '最新上線', value: 'recently_launched' },
  { name: '即將結束', value: 'recently_ending' },
  { name: '全部專案', value: 'all' },
  { name: '專案人次', value: 'project_backers' },
  { name: '熱門專案', value: 'hot_project' }
];

const ProList = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const { mutate } = useSWRConfig();

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

  const [list, setList] = useState<Project.ProjectItem[]>([]);
  const [page, setPage] = useState<Project.Pagination>({
    page: 1,
    limit: 1,
    totalPages: 1
  });
  const [sortType, setSortType] = useState('recently_launched');

  const [categoryValue, setCategoryValue] = useState('');

  const [queryParams, setQueryParams] = useState({
    sort: 'recently_launched',
    category: '',
    page: '1',
    limit: '9'
  });

  const getProjects = (data: ApiProject.Projects) => {
    const items = data.items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        category: getCategory(item.category),
        team: item.teamId.title,
        teamId: item.teamId._id,
        keyVision: item.keyVision,
        target: currency(item.target, 'zh-TW', 'TWD'),
        progressRate: item.progressRate,
        countDownDays: item.countDownDays,
        type: item.type,
        updatedAt: item.updatedAt
      };
    });

    setList(() => items);
  };

  const { data: projectList, isLoading } = useSWR(
    ['/api/project', queryParams],
    async ([key, queryParams]) => await apiGetProject(queryParams),
    {
      revalidateOnMount: false,
      onSuccess(data, key, config) {
        if (data && data.status === 'Success') {
          getProjects(data.data);
          setPage({
            page: data.data.page,
            limit: data.data.limit,
            totalPages: data.data.totalPages
          });
        }
      }
    }
  );

  const mutateData = useCallback(() => {
    if (pathname === '/projects') {
      mutate(['/api/project', queryParams]);
    } else {
      // TODO:產品 API，暫先接專案
      mutate(['/api/project', queryParams]);
    }
  }, [pathname, mutate, queryParams]);

  const onPageChange = (page: number) => {
    router.push({
      pathname,
      query: {
        ...queryParams,
        page: String(page)
      }
    });
    mutateData();
  };

  const changeSortType = (value: string) => {
    setSortType(value);
    router.push({
      pathname,
      query: {
        ...queryParams,
        sort: value,
        page: '1'
      }
    });
    mutateData();
  };

  const changeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoryValue(e.target.value);
    router.push({
      pathname,
      query: {
        ...queryParams,
        category: e.target.value,
        page: '1'
      }
    });
    mutateData();
  };

  useEffect(() => {
    mutateData();
  }, [mutateData]);

  useEffect(() => {
    setQueryParams({
      sort: Array.isArray(query.sort)
        ? query.sort.slice(-1)[0]
        : query.sort || 'recently_launched',
      category: Array.isArray(query.category)
        ? query.category.slice(-1)[0]
        : query.category || '',
      page: Array.isArray(query.page)
        ? query.page.slice(-1)[0]
        : query.page || '1',
      limit: Array.isArray(query.limit)
        ? query.limit.slice(-1)[0]
        : query.limit || '9'
    });

    setCategoryValue(
      Array.isArray(query.category)
        ? query.category.slice(-1)[0]
        : query.category || ''
    );

    setSortType(
      Array.isArray(query.sort)
        ? query.sort.slice(-1)[0]
        : query.sort || 'recently_launched'
    );
  }, [query]);

  if (isLoading) return <Loading />;

  return (
    <Box pt={10} className="pb-10 md:pb-20">
      <Container maxW={'container.xl'}>
        <Flex className="flex-col md:flex-row md:justify-between">
          <Select
            w={{ base: 'full', md: 200 }}
            value={categoryValue}
            onChange={changeCategory}
          >
            {category.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </Select>

          <Flex
            borderColor={'gray.300'}
            borderStyle={'solid'}
            fontWeight={500}
            color={'gray.900'}
            justifyContent={'space-between'}
            borderRadius={{ base: 'xl', sm: 'full' }}
            mt={{ base: 5, md: 0 }}
            className="bg-secondary-light px-1  text-sm xs:px-5 xs:text-base"
          >
            {tabs.map((item) => (
              <Box
                key={item.value}
                p={3}
                w={{ base: 16, sm: 'auto' }}
                cursor={'pointer'}
                fontWeight={500}
                className={`hover:text-secondary-emphasis  md:block ${
                  sortType === item.value ? 'text-secondary-emphasis' : ''
                }`}
                onClick={() => changeSortType(item.value)}
              >
                {item.name}
              </Box>
            ))}
          </Flex>
        </Flex>

        <Flex flexWrap={'wrap'} pt={10}>
          {list.length <= 0 ? (
            <Box textAlign={'center'} w={'full'} fontWeight={500} mt={4}>
              尚無資料
            </Box>
          ) : (
            list.map((item) => <Card item={item} key={item.id} />)
          )}
        </Flex>

        {list.length > 0 && (
          <Center mt={10}>
            <Pagination
              totalPage={page.totalPages}
              currentPage={page.page}
              onPageChange={onPageChange}
            />
          </Center>
        )}
      </Container>
    </Box>
  );
};

export default ProList;
