import apiClient from '@/api/apiClient';
import styled from '@emotion/styled';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Container = styled.div<{ backgroundColor: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: auto;
  margin-top: 2.8rem;
  box-sizing: border-box;
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding-top: ${({ theme }) => theme.spacing.spacing6};
  padding-bottom: ${({ theme }) => theme.spacing.spacing5};
  padding-left: ${({ theme }) => theme.spacing.spacing4};
`;

const ThemeName = styled.div`
  ${({ theme }) => theme.typography.label1Bold}
  color: white;
`;

const Title = styled.div`
  ${({ theme }) => theme.typography.title1Bold}
  margin-top: ${({ theme }) => theme.spacing.spacing2};
  color: white;
`;

const Description = styled.div`
  ${({ theme }) => theme.typography.title2Regular}
  margin-top: ${({ theme }) => theme.spacing.spacing1};
  color: white;
`;

export const Banner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [themeName, setThemeName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.get(`/api/themes/${id}/info`);
        setThemeName(response.data.data.name);
        setTitle(response.data.data.title);
        setDescription(response.data.data.description);
        setBackgroundColor(response.data.data.backgroundColor);
        console.log(response.data.data);
      } catch (error) {
        console.log('⚠️ 요청 처리 중 오류가 발생했습니다.', error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.log('⚠️ 요청 처리 중 오류가 발생했습니다.', error);
          navigate('/main');
        }
      }
    };
    getData();
  }, [navigate, id]);

  return (
    <Container backgroundColor={backgroundColor}>
      {themeName && <ThemeName>{themeName}</ThemeName>}
      {title && <Title>{title}</Title>}
      {description && <Description>{description}</Description>}
    </Container>
  );
};
