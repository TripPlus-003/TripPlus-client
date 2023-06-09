import { Button, Icon } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleSSOBtn() {
  function handleGoogleSSO() {
    const w = window.open(`${process.env.BASE_API_URL}/auth/google`, '_self');
  }

  return (
    <Button colorScheme="gray" width={'100%'} my={4} onClick={handleGoogleSSO}>
      <Icon as={FcGoogle} mr={1} className="text-xl" />
      使用 Google 帳號登入
    </Button>
  );
}
