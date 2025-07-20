import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import type { GiftItemDataType } from '@/types/giftItems';
import { GiftItemCard } from './GiftItemCard';
import { Header } from './Header';
import { MoreButton } from './MoreButton';
import apiClient from '@/api/apiClient';
import { keyframes } from '@emotion/react';

const Container = styled.div`
  width: 100%;
  min-height: 16rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${({ theme }) => theme.spacing.spacing2};
  width: calc(100% - ${({ theme }) => theme.spacing.spacing8});
  height: fit-content;
  margin-top: ${({ theme }) => theme.spacing.spacing4};
  background-color: white;
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 1.7rem;
  height: 1.7rem;
  border: 0.2rem solid #ccc;
  border-top-color: ${({ theme }) => theme.colors.gray900};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const ErrorText = styled.div`
  position: absolute;
  justify-self: center;
  align-self: center;
  font-size: 1rem;
  font-weight: 500;
`;

export const GiftList = () => {
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [giftItemList, getGiftItemList] = useState<GiftItemDataType[] | null>(null);
  const [giftItems, setGiftItems] = useState<GiftItemDataType[]>([]);
  const [isViewMore, setIsViewMore] = useState(false);
  const [targetType, setTargetType] = useState(localStorage.getItem('currentTarget') || 'ALL');
  const [rankType, setRankType] = useState(localStorage.getItem('currentTopic') || 'MANY_WISH');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(
          `/api/products/ranking?targetType=${targetType}&rankType=${rankType}`
        );
        console.log(response.data.data);
        getGiftItemList(response.data.data);
        setIsError(false);
      } catch (error) {
        setIsError(true);
        setLoading(false);
        console.log('⚠️ 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. ', error);
      }
    };
    setTimeout(() => {
      getData();
    }, 1000);
  }, [targetType, rankType]);

  useEffect(() => {
    if (giftItemList === null) return;

    setLoading(false);
  }, [giftItemList]);

  useEffect(() => {
    if (giftItemList === null) return;

    if (isViewMore) {
      setGiftItems(giftItemList!);
    } else {
      setGiftItems(giftItemList!.slice(0, 6));
    }
  }, [giftItemList, isViewMore]);

  return (
    <>
      <Header
        getGiftItemList={getGiftItemList}
        setIsError={setIsError}
        targetType={targetType}
        setTargetType={setTargetType}
        rankType={rankType}
        setRankType={setRankType}
        setLoading={setLoading}
      />
      <Container>
        {loading && <Spinner />}
        {!loading && (
          <List>
            {giftItems.map((item, i) => {
              return (
                <GiftItemCard
                  key={item.id}
                  rank={i + 1}
                  id={item.id}
                  name={item.name}
                  image={item.imageURL}
                  brandName={item.brandInfo.name}
                  price={item.price.basicPrice}
                />
              );
            })}
          </List>
        )}
        {isError && (
          <ErrorText>⚠️ 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</ErrorText>
        )}
        {!loading && giftItemList?.length === 0 && <ErrorText>상품이 없습니다.</ErrorText>}
      </Container>
      {!loading && !isError && !(giftItemList?.length === 0) && (
        <MoreButton isViewMore={isViewMore} setIsViewMore={setIsViewMore} />
      )}
    </>
  );
};
