import Head from 'next/head';
import Image, { type StaticImageData } from 'next/image';
import { GetServerSideProps } from 'next';
import { Layout } from '@/components';
import UserHeader from '@/components/User/user-header';
import ModalBox, { type ModalState } from '@/components/Modal';
import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig, unstable_serialize, SWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  apiGetUserAccount,
  apiPatchUserAccount,
  apiPostUpload
} from '@/service/api/index';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Textarea
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { safeAwait, omit } from '@/utils';
import { useFileReader } from '@/hooks';
import NoImage from '@/assets/images/user/no-image.png';
import dayjs from 'dayjs';
import toObject from 'dayjs/plugin/toObject';
import utc from 'dayjs/plugin/utc';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';

dayjs.extend(toObject);
dayjs.extend(utc);

const breadcrumb = [
  { name: '首頁', url: '/' },
  { name: '會員中心', url: '/user/account' },
  { name: '個人資料', url: '/user/account' }
];

const gender = [
  { id: 0, name: '男性' },
  { id: 1, name: '女性' }
];

interface Props {
  token: string;
  fallback: {
    [x: string]: Service.RequestResult<ApiAuth.Account>;
  };
}

const Account: App.NextPageWithLayout<Props> = ({ token, fallback }) => {
  const { mutate } = useSWRConfig();

  const [image, setImage] = useState<string | StaticImageData>(NoImage);
  const [file, setFile] = useState<undefined | File>();
  const { dataURL } = useFileReader(file);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: '',
    footer: null
  });

  const setOpenModal = (boolean: boolean): void => {
    setModal((state) => ({
      ...state,
      isOpen: boolean
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1922 },
    (_, index) => currentYear - index - 1
  );

  const numberOptions = (length: number) => {
    return Array.from({ length }, (_, index) => index + 1);
  };
  const months = numberOptions(12);
  const days = numberOptions(31);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<UserAccountInterface.FormInputs>();

  // queries
  const { data: account } = useSWR(
    ['get', '/api/user/account'],
    async () =>
      apiGetUserAccount({
        headers: { Authorization: `Bearer ${token}` }
      }),
    {
      onError(err, key, config) {
        console.log(err);
      }
    }
  );
  const { trigger: updateAccount } = useSWRMutation(
    ['post', '/api/user/account'],
    (url, { arg }: { arg: ApiAuth.Account }) => apiPatchUserAccount(arg),
    {
      onSuccess: (data, key, config) => {
        setModal(() => ({
          isOpen: true,
          content: data.message,
          footer: <Button onClick={() => setOpenModal(false)}>OK</Button>
        }));
        mutate(['get', '/api/user/account']);
      },
      onError(err, key, config) {
        setModal(() => ({
          isOpen: true,
          content: err.message,
          footer: <Button onClick={() => setOpenModal(false)}>OK</Button>
        }));
      }
    }
  );

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setFile(files?.[0]);
  }

  function handleBirthday(data: UserAccountInterface.FormInputs) {
    const {
      year,
      month,
      day
    }: Pick<UserAccountInterface.FormInputs, 'year' | 'month' | 'day'> = data;
    const params = omit(data, ['year', 'month', 'day']);
    if (!year || !month || !day) return params;
    return {
      ...params,
      birthday: dayjs(new Date(year, month - 1, day)).format(
        'YYYY-MM-DDTHH:mm:ssZ'
      )
    };
  }

  const onSubmit = async (data: UserAccountInterface.FormInputs) => {
    setLoading(true);
    const params = handleBirthday(data) as ApiAuth.Account;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const [err, res] = await safeAwait(apiPostUpload(formData));
      if (res && res.status === 'Success') {
        params.photo = res.data.imageUrl;
      }
      if (err) {
      }
      setFile(undefined);
    }
    await updateAccount(params);
    setLoading(false);
  };

  useEffect(() => {
    if (account && account.status === 'Success') {
      const { years, months, date } = dayjs(account.data.birthday)
        .utc(true)
        .toObject();
      reset({
        email: account.data.email,
        name: account.data.name,
        nickName: account.data?.nickName ?? undefined,
        phone: account.data?.phone ?? undefined,
        gender: account.data?.gender ?? 0,
        address: account.data?.address ?? undefined,
        photo: account.data?.photo ?? undefined,
        country: account.data?.country ?? undefined,
        introduction: account.data?.introduction ?? undefined,
        year: isNaN(years) ? undefined : years,
        month: isNaN(months) ? undefined : months + 1,
        day: isNaN(date) ? undefined : date
      });
      account.data?.photo && setImage(account.data?.photo);
    }
  }, [account, reset]);

  return (
    <>
      <Head>
        <title>會員中心-個人資料-TripPlus+</title>
      </Head>

      <SWRConfig value={{ fallback }}>
        <UserHeader breadcrumb={breadcrumb} />

        <Box pt={3} className="pb-10 md:pb-20">
          <Container maxW={'container.xl'}>
            <Box backgroundColor={'white'} className="p-5 md:p-10">
              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                className="justify-center md:flex"
              >
                <Box className="mx-auto mt-10 w-60 md:mx-0 md:mr-28">
                  <Box
                    borderRadius={'full'}
                    overflow={'hidden'}
                    className="relative mx-auto h-60 w-60"
                  >
                    <Image
                      src={dataURL || image}
                      alt="使用者圖片"
                      width={500}
                      height={500}
                      priority
                    />
                  </Box>

                  <Box mt={6}>
                    <FormControl
                      className="flex items-center justify-center rounded py-2"
                      textAlign={'center'}
                    >
                      <label
                        htmlFor="photo"
                        className="mr-2 cursor-pointer rounded bg-primary px-3 py-1 text-center text-sm text-white hover:bg-primary-600"
                      >
                        選擇檔案
                      </label>
                      <Input
                        id="photo"
                        type="file"
                        display={'none'}
                        accept="image/*"
                        {...register('photo')}
                        onChange={onFileChange}
                      />

                      <span className="truncate text-sm">
                        {file ? file.name : '未選擇任何檔案'}
                      </span>
                    </FormControl>
                  </Box>
                </Box>

                <Box className="w-full md:w-2/5">
                  <FormControl my={10}>
                    <FormLabel>暱稱</FormLabel>
                    <Input
                      type="text"
                      {...register('nickName')}
                      placeholder="請輸入暱稱"
                    />
                  </FormControl>

                  <FormControl isRequired my={10}>
                    <FormLabel>真實身份 / 名稱</FormLabel>
                    <Input
                      type="text"
                      {...register('name', {
                        required: '請填入真實姓名'
                      })}
                      placeholder="請輸入真實身份 / 名稱"
                    />
                  </FormControl>

                  <FormControl isInvalid={!!errors.email} my={10}>
                    <FormLabel className="!font-normal">E-mail</FormLabel>
                    <Input
                      type="email"
                      {...register('email', {
                        required: '請填入 E-mail',
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: 'E-mail 格式錯誤'
                        }
                      })}
                      placeholder="請輸入 E-mail"
                      disabled
                    />

                    {!!errors.email && (
                      <FormErrorMessage className="visible">
                        {errors.email.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!errors.phone} my={10}>
                    <FormLabel>手機</FormLabel>
                    <Input
                      type="text"
                      {...register('phone', {
                        pattern: {
                          value: /^09\d{8}$/,
                          message: '手機格式錯誤'
                        }
                      })}
                      placeholder="請輸入手機"
                    />

                    {!!errors.phone && (
                      <FormErrorMessage className="visible">
                        {errors.phone.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl my={10}>
                    <FormLabel>地址</FormLabel>
                    <Input
                      type="text"
                      {...register('address')}
                      placeholder="請輸入地址"
                    />
                  </FormControl>

                  <FormControl my={10}>
                    <FormLabel>性別</FormLabel>
                    <Select {...register('gender')}>
                      {gender.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl my={10}>
                    <FormLabel>生日</FormLabel>
                    <Box className="items-center space-y-3 md:flex md:space-y-0">
                      <Select placeholder="年" {...register('year')}>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                      <span className="mx-3 hidden md:block">-</span>

                      <Select placeholder="月" {...register('month')}>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </Select>
                      <span className="mx-3 hidden md:block">-</span>

                      <Select placeholder="日" {...register('day')}>
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  </FormControl>

                  <FormControl my={10}>
                    <FormLabel>來自</FormLabel>
                    <Input
                      type="text"
                      {...register('country')}
                      placeholder="台北, 台灣"
                    />
                  </FormControl>

                  <FormControl my={10}>
                    <FormLabel>個人介紹</FormLabel>
                    <Textarea
                      {...register('introduction')}
                      placeholder="請輸入個人介紹"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="primary"
                    width={'100%'}
                    my={4}
                    isLoading={loading}
                  >
                    更新
                  </Button>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        <ModalBox
          content={modal.content}
          isOpen={modal.isOpen}
          onClose={() => setOpenModal(false)}
          header="提醒"
          footer={modal.footer}
        ></ModalBox>
      </SWRConfig>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const res = await apiGetUserAccount({
    headers: {
      Authorization: 'Bearer ' + session?.user.token
    }
  });
  return {
    props: {
      token: session?.user.token,
      fallback: {
        [unstable_serialize(['get', '/api/user/account'])]: res
      }
    }
  };
};

export default Account;

Account.getLayout = function (page: ReactElement) {
  return (
    <Layout>
      <Box className="bg-gray-100">{page}</Box>
    </Layout>
  );
};
