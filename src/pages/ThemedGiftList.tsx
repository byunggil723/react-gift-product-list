import { Banner } from '@/components/gift_themed_list_page/Banner';
import { GiftList } from '@/components/gift_themed_list_page/GiftList';
import { TopNavBar } from '@/components/TopNavBar';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
  min-height: 100vh;
  max-width: 720px;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.gray200};
`;

const ThemedGiftList = () => {
  return (
    <Container>
      <TopNavBar title="선물하기" mainPath="/" />
      <Banner />
      <GiftList />
    </Container>
  );
};

export default ThemedGiftList;
