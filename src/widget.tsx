import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Checkbox,
  Container,
  Logo,
  Subtitle,
  Title,
  Text,
  HiddenInput,
} from "./widget.styled";
import { useTranslation } from "react-i18next";
import "../i18n";
import { io, Socket } from "socket.io-client";

interface VerificationConfirmed {
  verifyId: string;
  verifyUuid: string;
  isAdult: boolean;
}

const COOKIE_KEY_ID = process.env.VITE_COOKIE_KEY_ID || "";
const COOKIE_KEY_UUID = process.env.VITE_COOKIE_KEY_UUID || "";
const COOKIE_AGE_SECONDS = Number(process.env.VITE_COOKIE_AGE_SECONDS);
const SOCKET_SERVER_URL = process.env.VITE_SOCKET_SERVER_URL || "";
// const SOCKET_SERVER_URL = "http://localhost:5555";
const TARGET_DIV_SEARCH_MAX_ATTEMPTS = Number(
  process.env.VITE_TARGET_DIV_SEARCH_MAX_ATTEMPTS,
);
const SOCKET_AUTH_TOKEN = process.env.VITE_SOCKET_AUTH_TOKEN || "";

interface HardAgeVerificationProps {
  redirectUrl: string;
  verifyId: string;
  verifyUuid: string;
  email?: string;
  phone?: string;
}

export const HardAgeVerification: React.FC<HardAgeVerificationProps> = ({
  redirectUrl,
  verifyId,
  verifyUuid,
}) => {
  const { t } = useTranslation();

  // TODO on init get info if the client was already verified from socket server
  const [clientVerified, setClientVerified] = useState<boolean>(false);
  const [hiddenInputValue, setHiddenInputValue] = useState<string>("");

  const handleClick = () => {
    if (!clientVerified) {
      window.open(redirectUrl, "_blank");
    }
  };

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL, {
      query: {
        verifyId,
      },
      auth: {
        token: SOCKET_AUTH_TOKEN,
      },
    });

    socket.on("verification-result", (result: VerificationConfirmed) => {
      console.log("Verification result:", result);

      if (verifyUuid === result.verifyUuid) {
        setClientVerified(true);
        setHiddenInputValue(result.verifyUuid);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [verifyId, verifyUuid]);

  return (
    <Container onClick={handleClick} verified={clientVerified}>
      <Checkbox onClick={(e) => e.preventDefault()} checked={clientVerified} />
      <Text>
        <Title>{t("verifyTitle")}</Title>
        <Subtitle>{t("verifySubtitle")}</Subtitle>
      </Text>
      <Logo>FJ</Logo>
      <HiddenInput value={hiddenInputValue} />
    </Container>
  );
};

const getOrCreateCookie = (
  name: string,
  maxAge: number = COOKIE_AGE_SECONDS,
) => {
  let cookieValue = getCookie(name);

  if (!cookieValue) {
    cookieValue = uuidv4();
    document.cookie = `${name}=${cookieValue}; max-age=${maxAge}; path=/; samesite=none; secure=true`;
    console.log(
      `HardAgeVerification: Vytvořena nová cookie '${name}' s hodnotou:`,
      cookieValue,
    );
  } else {
    console.log(
      `HardAgeVerification: Načtena existující cookie '${name}' s hodnotou:`,
      cookieValue,
    );
  }
  return cookieValue;
};

const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return cookieValue;
  }
  return null;
};

const loadWidget = () => {
  let initCount = 0;

  const initializeWidget = () => {
    initCount++;
    const targetDiv = document.querySelector(".ageproof-cz");
    if (!targetDiv) {
      console.warn("Target div not found");
      if (initCount <= TARGET_DIV_SEARCH_MAX_ATTEMPTS) {
        setTimeout(initializeWidget, 100);
      }
      return;
    }

    const apiKey = targetDiv.getAttribute("data-apikey") || "";

    if (!apiKey) {
      console.warn("API key not found");
      return;
    }

    // GET data from the form the target div is located in
    // let parent = targetDiv?.parentElement;
    // let formFound: HTMLFormElement | null = null;

    // while (parent) {
    //   if (parent.tagName === 'FORM') {
    //     formFound = parent as HTMLFormElement;
    //     break;
    //   }
    //   parent = parent.parentElement;
    // }

    // if (!formFound) {
    //   alert('Form not found');
    //   return;
    // }

    // const emailInput = formFound.querySelector<HTMLInputElement>(
    //   'input[name="email"]'
    // );
    // const phoneInput = formFound.querySelector<HTMLInputElement>(
    //   'input[name="phone"]'
    // );
    // const email = emailInput?.value || '';
    // const phone = phoneInput?.value || '';

    const cookieVerifyId = getOrCreateCookie(COOKIE_KEY_ID);
    const cookieVerifyUuid = getOrCreateCookie(COOKIE_KEY_UUID);

    ReactDOM.render(
      <HardAgeVerification
        redirectUrl={`https://loc82.hav-backend.com/verify?apiKey=${apiKey}&verifyId=${cookieVerifyId}&verifyUuid=${cookieVerifyUuid}`}
        verifyId={cookieVerifyId}
        verifyUuid={cookieVerifyUuid}
      />,
      targetDiv,
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeWidget);
  } else {
    initializeWidget();
  }
};

loadWidget();
