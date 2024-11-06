import React from "react";
import { LoaderContainer, Spinner } from "./loader.styled";

export const Loader: React.FC = () => (
  <LoaderContainer>
    <Spinner />
  </LoaderContainer>
);
