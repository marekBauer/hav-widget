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

interface HardAgeVerificationProps {
  redirectUrl: string;
  verifyId: string;
  verifyUuid: string;
  email?: string;
  phone?: string;
}

interface VerificationConfirmed {
  uid: string;
  isAdult: boolean;
  target: "widget";
}

const COOKIE_KEY_ID = "age_proof_local_id";
const COOKIE_KEY_UUID = "age_proof_local_uid";
const COOKIE_AGE_SECONDS = 3600;
const SOCKET_SERVER_URL = "http://localhost:5555";

export const HardAgeVerification: React.FC<HardAgeVerificationProps> = ({
  redirectUrl,
  verifyId,
  verifyUuid,
}) => {
  const { t } = useTranslation();
  // TODO on init get info if the client was already verified from socket server
  const [clientVerified, setClientVerified] = useState<boolean>(false);
  const [hiddenInputValue, setHiddenInputValue] = useState<string>("");

  // const cookieId = useMemo(() => getCookie(COOKIE_KEY_UUID),[])
  // console.log(cookieId)

  const handleClick = () => {
    if (!clientVerified) {
      window.location.href = redirectUrl;
    }
  };

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL, {
      query: {
        userId: verifyId,
      },
    });

    socket.on("verification-confirmed", (response: VerificationConfirmed) => {
      console.log("Verification confirmed:", response);
      if (verifyUuid === response.uid) {
        setClientVerified(true);
        setHiddenInputValue(response.uid);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container onClick={handleClick}>
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
  const initializeWidget = () => {
    const targetDiv = document.querySelector(".hav");
    if (!targetDiv) {
      setTimeout(initializeWidget, 100);
      console.warn("Target div not found");
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
        redirectUrl={`https://loc82.hav-backend.com/verify?api_key=${apiKey}&verify_id=${cookieVerifyId}&verify_uid=${cookieVerifyUuid}`}
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
