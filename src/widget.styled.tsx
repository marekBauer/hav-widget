import styled, { css } from "styled-components";

export const Container = styled.div<{
  verified: boolean;
}>`
  ${({ verified }) => css`
    display: flex;
    align-items: center;
    border: 1px dashed black;
    padding: 10px;
    max-width: 500px;
    font-family: Arial, sans-serif;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    ${verified &&
    css`
      background-color: #00ff00;
    `}
  `}
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  cursor: pointer;
`;

export const Text = styled.div`
  flex: 1;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #000;
`;

export const Subtitle = styled.div`
  font-size: 12px;
  color: #777;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

export const HiddenInput = styled.input.attrs((props) => ({
  type: "hidden",
  name: "hav-uuid",
  id: "hav-uuid",
  value: props.value,
}))`
  resize: none;
  display: none;
`;
