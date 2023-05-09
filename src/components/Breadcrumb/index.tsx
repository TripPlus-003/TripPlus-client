import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';

interface BreadcrumbProps {
  breadcrumb: ComponentsInterface.Breadcrumb[];
}

const BreadcrumbList = ({ breadcrumb }: BreadcrumbProps) => {
  return (
    <>
      <Breadcrumb color={'gray.400'}>
        {breadcrumb.map((item, index) => (
          <BreadcrumbItem
            key={item.name}
            isCurrentPage={index === breadcrumb.length - 1}
            className={index === breadcrumb.length - 1 ? 'text-gray-500' : ''}
          >
            <BreadcrumbLink href={item.url}>{item.name}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbList;
