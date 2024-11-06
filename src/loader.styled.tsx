import styled, { keyframes } from "styled-components";

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3; /* Light grey background */
  border-top: 2px solid #3498db; /* Blue color for the rotating part */
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;
