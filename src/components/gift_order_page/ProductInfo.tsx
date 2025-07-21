import apiClient from '@/api/apiClient';
import useProductInfo from '@/hooks/useProductInfo';
import type { GiftItemDataType } from '@/types/giftItem';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  background-color: white;
`;

const Label = styled.div`
  ${({ theme }) => theme.typography.title2Bold};
  margin-left: 1rem;
  margin-top: 0.7rem;
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: calc(100% - 2rem);
  height: 5.6rem;
  box-sizing: border-box;
  margin: 0.8rem 1rem 4.6rem 1rem;
  border-radius: 0.5rem;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.gray300};
  border-width: 1px;
`;

const ProductImg = styled.img`
  width: 4rem;
  aspect-ratio: 1 / 1;
  margin-left: 1rem;
  border-radius: 0.3rem;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: auto;
  margin-left: 0.8rem;
`;

const Name = styled.div`
  ${({ theme }) => theme.typography.body2Regular}
`;

const Brand = styled.div`
  ${({ theme }) => theme.typography.label2Regular}
  color: ${({ theme }) => theme.colors.gray700};
`;

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.3rem;
`;

const PriceLabel = styled.div`
  ${({ theme }) => theme.typography.label1Regular}
  color: ${({ theme }) => theme.colors.gray700};
`;

const PriceValue = styled.div`
  ${({ theme }) => theme.typography.title2Bold}
  margin-left: 0.3rem;
`;

export const ProductInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) throw new Error('id가 없습니다');
  const parsedId = parseInt(id!);
  const [currentGift, setCurrentGift] = useState<GiftItemDataType>();
  const { setId, setName, setPrice, setBrand } = useProductInfo();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(`/api/products/${parsedId}`);
        setCurrentGift(response.data.data);
      } catch (error) {
        console.log('⚠️ 요청 처리 중 오류가 발생했습니다.', error);
        toast.warn('⚠️ 로그인 요청 처리 중 오류가 발생했습니다.', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
          style: {
            width: '25rem',
            color: 'black',
            backgroundColor: 'white',
          },
        });
        navigate('/');
      }
    };
    getData();
  }, [navigate, parsedId]);

  useEffect(() => {
    if (!currentGift) return;

    setId(currentGift.id);
    setName(currentGift.name);
    setPrice(currentGift.price.basicPrice);
    setBrand(currentGift.brandInfo.name);
  }, [currentGift, setBrand, setId, setName, setPrice]);

  return (
    <Container>
      <Label>상품 정보</Label>
      <Body>
        <ProductImg src={currentGift?.imageURL} />
        <Info>
          <Name>{currentGift?.name}</Name>
          <Brand>{currentGift?.brandInfo.name}</Brand>
          <Price>
            <PriceLabel>상품가</PriceLabel>
            <PriceValue>{currentGift?.price.basicPrice}원</PriceValue>
          </Price>
        </Info>
      </Body>
    </Container>
  );
};
