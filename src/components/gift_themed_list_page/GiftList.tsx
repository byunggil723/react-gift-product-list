import styled from '@emotion/styled';
import { GiftItemCard } from '../GiftItemCard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import type { GiftItemDataType } from '@/types/giftItem';
import apiClient from '@/api/apiClient';
import { useParams } from 'react-router-dom';

const Container = styled.div`
  flex: 1;
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

const IntersectionTrigger = styled.div`
  width: 100%;
  height: 1rem;
`;

export const GiftList = () => {
  const intersectionTriggerRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState(0);
  const [giftItemList, setGiftItemList] = useState<GiftItemDataType[] | null>(null);

  console.log(cursor);

  const getData = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/themes/${id}/products?cursor=${cursor}&limit=10`);
      console.log(response.data.data);

      if (!response.data.data.hasMoreList) {
        setHasMore(false);
        return;
      }

      const prevList = giftItemList || [];
      setGiftItemList([...prevList, ...response.data.data.list]);
      setCursor(cursor + 10);
    } catch (error) {
      setIsError(true);
      setLoading(false);
      console.log('⚠️ 요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요. ', error);
    }
  }, [cursor, id, giftItemList]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const targetElement = intersectionTriggerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          getData();
        }
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.1,
      }
    );

    if (targetElement) observer.observe(targetElement);

    return () => {
      if (targetElement) observer.unobserve(targetElement);
    };
  }, [getData, hasMore]);

  useEffect(() => {
    if (giftItemList === null) return;

    setLoading(false);
  }, [giftItemList]);

  return (
    <Container>
      {loading && <Spinner />}
      {!loading && (
        <List>
          {giftItemList?.map((item) => {
            return (
              <GiftItemCard
                key={`GIFT_THEMED_LIST_${item.id}`}
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
      {hasMore && <IntersectionTrigger ref={intersectionTriggerRef} />}
    </Container>
  );
};
