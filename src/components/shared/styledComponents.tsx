import styled from 'styled-components';
import { Container, Box } from '@mui/material';

export const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  padding-top: 25px;
  box-sizing: border-box;
`;

export const StyledForm = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
`;
