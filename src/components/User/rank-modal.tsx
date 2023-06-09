import Image from 'next/image';
import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Icon,
  Textarea,
  FormControl,
  Input,
  useToast
} from '@chakra-ui/react';
import { AiFillStar } from 'react-icons/ai';
import { FiUploadCloud } from 'react-icons/fi';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { safeAwait } from '@/utils';
import useSWRMutation from 'swr/mutation';
import { apiPostOrders, apiPostUpload } from '@/api';
import { useFileReaders } from '@/hooks';
import ScrollBar from '@/components/ScrollBar/horizontal';

interface RankModalProps {
  modalInfo: {
    orderId: string;
    productId: string;
    title: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const RankModal = ({ modalInfo, isOpen, onClose }: RankModalProps) => {
  const toast = useToast();
  const shortComment: string[] = [
    '符合期待',
    '質感優異',
    '運送迅速',
    '想再回購',
    '服務貼心',
    '風格獨特'
  ];

  const [selectShortComment, setSelectShortComment] = useState<string[]>([]);

  const addShortComment = (item: string) => {
    if (selectShortComment.includes(item)) {
      setSelectShortComment((state) =>
        state.filter((comment) => comment !== item)
      );
    } else {
      setSelectShortComment((state) => [...state, item]);
    }
  };

  const rateTexts = [
    { rate: 1, text: '很差' },
    { rate: 2, text: '不太好' },
    { rate: 3, text: '一般' },
    { rate: 4, text: '不錯' },
    { rate: 5, text: '非常好' }
  ];

  const [rate, setRate] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dataURLs, setDataURLs] = useState<string[]>([]);
  const { dataURLs: dataURLarr } = useFileReaders(files);

  const deleteImg = (idx: number) => {
    setFiles((state) => state.filter((item, index) => index !== idx));
  };

  const selectedRateText = rateTexts.find((item) => item.rate === rate);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset
  } = useForm<ApiUser.Ranking>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const fileArray = Array.from(fileList);
      setFiles((state) => [...state, ...fileArray]);
    }
  };

  const { trigger: setComment } = useSWRMutation(
    '/api/user/change-password',
    (url, { arg }: { arg: ApiUser.Ranking }) =>
      apiPostOrders(modalInfo.orderId, arg),
    {
      onSuccess: (data, key, config) => {
        toast({
          status: 'success',
          position: 'top',
          duration: 3000,
          isClosable: true,
          containerStyle: {
            width: '100%',
            maxWidth: '100%'
          },
          render: () => (
            <Box
              color="white"
              p={3}
              bg="secondary-emphasis.400"
              textAlign={'center'}
            >
              您已成功評價
            </Box>
          )
        });
      },
      onError: (err, key, config) => {
        toast({
          title: err.message,
          status: 'warning',
          position: 'top',
          duration: 3000,
          isClosable: true,
          containerStyle: {
            width: '100%',
            maxWidth: '100%'
          }
        });
      }
    }
  );

  const onSubmit = async (data: ApiUser.Ranking) => {
    const payload = {
      productId: modalInfo.productId,
      rate,
      shortComment: shortComment.join(),
      imageUrls: [] as string[],
      comment: data.comment
    };

    if (files.length > 0) {
      files.map(async (item) => {
        const formData = new FormData();
        formData.append('file', item);
        const [err, res] = await safeAwait(apiPostUpload(formData));

        if (res && res.status === 'Success') {
          payload.imageUrls.push(res.data.imageUrl);
        }
      });
    }

    setComment(payload);
  };

  useEffect(() => {
    if (isOpen) return;
    reset({
      comment: ''
    });
    setRate(0);
    setSelectShortComment(() => []);
    setFiles(() => []);
    setDataURLs(() => []);
  }, [isOpen, reset]);

  useEffect(() => {
    setDataURLs((state) => [...state, ...dataURLarr]);
  }, [dataURLarr]);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={'5xl'}
    >
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        className={'!w-[90%] py-6 md:p-10'}
      >
        <ModalHeader textAlign={'center'}>
          <div className="text-xl md:text-[1.75rem]">滿意度評價</div>
          <div className="mt-4 text-sm md:mt-6 md:text-base">
            {modalInfo.title}
          </div>
        </ModalHeader>
        <ModalCloseButton
          border={1}
          borderColor={'gray.300'}
          borderStyle={'solid'}
          borderRadius={100}
          color={'gray.500'}
          fontSize={8}
          width={6}
          height={6}
          top={3}
        />
        <ModalBody>
          <Box className="text-center">
            <Box className="mt-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Icon
                  key={index}
                  as={AiFillStar}
                  mx={1}
                  className={`cursor-pointer text-3xl ${
                    index + 1 <= rate ? '!text-primary-500' : '!text-gray-200'
                  }`}
                  onClick={() => setRate(index + 1)}
                />
              ))}
            </Box>

            <Box className="mt-4 text-xs md:text-sm">
              {rate > 0 && <span className="text-gray-400">商品品質</span>}
              <span className="ml-2 text-gray-500">
                {selectedRateText ? selectedRateText.text : '請選擇評分'}
              </span>
            </Box>

            <Box className="mb-2 mt-6 text-xs md:text-sm">
              {shortComment.map((item) => (
                <Button
                  key={item}
                  border={1}
                  borderStyle={'solid'}
                  bgColor={'transparent'}
                  borderColor={'gray.300'}
                  fontSize={{ base: '0.75rem', md: '0.875rem' }}
                  px={{ base: 3, md: 5 }}
                  py={{ base: 1, md: 2 }}
                  m={2}
                  _hover={{
                    bg: 'secondary',
                    color: 'secondary-emphasis.500',
                    borderColor: 'secondary-emphasis.500'
                  }}
                  onClick={() => addShortComment(item)}
                  className={
                    selectShortComment.includes(item)
                      ? '!border-secondary-emphasis !bg-secondary text-secondary-emphasis'
                      : ''
                  }
                >
                  {item}
                </Button>
              ))}
            </Box>

            <FormControl>
              <Textarea
                {...register('comment')}
                bgColor={'gray.100'}
                color={'gray.900'}
                border={0}
                placeholder="分享更多開於此商品的評價以幫助其他買家"
                letterSpacing={1}
                fontSize={{ base: '0.875rem', md: '1rem' }}
                height={40}
                p={{ base: 4, md: 6 }}
              />
            </FormControl>

            <Box
              bgColor={'gray.100'}
              color={'secondary-emphasis.500'}
              className="border-t border-solid border-gray-200 p-3 text-sm md:p-5 md:text-base"
              textAlign={'left'}
              fontWeight={500}
              _hover={{
                color: 'secondary-emphasis.400'
              }}
            >
              <FormControl>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  display={'none'}
                  multiple
                />
                <label htmlFor="photo" className="cursor-pointer">
                  <Icon as={FiUploadCloud} mx={1} className="text-xl" />
                  <span className="ml-1">上傳檔案</span>
                </label>
              </FormControl>

              {dataURLs.length > 0 && (
                <ScrollBar>
                  <Flex mt={3} className="space-x-3">
                    {dataURLs.map((item: string, idx: number) => (
                      <Box key={idx} position={'relative'}>
                        <Image
                          src={item}
                          alt=""
                          width={100}
                          height={100}
                          priority
                        />
                        <Box
                          position={'absolute'}
                          top={0}
                          right={0}
                          p={1}
                          color={'gray.700'}
                          cursor={'pointer'}
                          onClick={() => deleteImg(idx)}
                        >
                          <IoIosCloseCircleOutline />
                        </Box>
                      </Box>
                    ))}
                  </Flex>
                </ScrollBar>
              )}
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Flex className="w-full flex-col space-y-3 md:flex-row md:justify-end md:space-x-3 md:space-y-0">
            <Button
              borderColor={'gray.300'}
              variant="outline"
              onClick={onClose}
              className="w-full md:!h-12 md:w-[154px]"
              borderRadius={4}
              fontSize={{ base: '0.875rem', md: '1rem' }}
            >
              取消
            </Button>
            <Button
              type="submit"
              colorScheme="primary"
              className="w-full md:!h-12 md:w-[154px]"
              borderRadius={4}
              isDisabled={rate <= 0}
              fontSize={{ base: '0.875rem', md: '1rem' }}
            >
              完成
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RankModal;
