import type { CategoryCardType } from '@/types/category';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';

const Card = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Image = styled.img`
  height: 3.1rem;
  border-radius: 1rem;
`;

const Name = styled.div`
  ${({ theme }) => theme.typography.label2Regular}
  margin-top: ${({ theme }) => theme.spacing.spacing1};
  margin-bottom: ${({ theme }) => theme.spacing.spacing5};
`;

export const CategoryCard = ({ id, name, image }: CategoryCardType) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => {
        navigate(`/themes/${id}`);
      }}
    >
      <Image src={image} />
      <Name>{name}</Name>
    </Card>
  );
};
