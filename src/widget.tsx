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

interface VerificationConfirmedResponse {
  verifyId: string;
  verifyUuid: string;
  isAdult: boolean;
  visitCookieId: string;
}

interface InitVerificationResponse {
  "ageproof-verify-id": string;
  "ageproof-verify-uuid": string;
  "ageproof-expiration-time": string;
  "ageproof-visit-cookie": string;
}

interface VerifyCookieResponse {
  "ageproofcz-verify-id": string;
  "ageproofcz-verify-uid": string;
  "ageproofcz-visit-cookie": string;
  "ageproofcz-visit-time": string;
  "ageproofcz-verify-time": string;
  "ageproofcz-verify-method": string;
  "ageproofcz-verify-status": boolean;
  "ageproofcz-verify-adult": boolean;
}

// const COOKIE_KEY_ID = process.env.VITE_COOKIE_KEY_ID || "";
// const COOKIE_KEY_UUID = process.env.VITE_COOKIE_KEY_UUID || "";
const COOKIE_KEY_VISIT_ID = process.env.VITE_COOKIE_KEY_VISIT_ID || "";
const COOKIE_AGE_SECONDS = Number(process.env.VITE_COOKIE_AGE_SECONDS);
const SOCKET_SERVER_URL = process.env.VITE_SOCKET_SERVER_URL || "";
// const SOCKET_SERVER_URL = "http://localhost:5555";
const TARGET_DIV_SEARCH_MAX_ATTEMPTS = Number(
  process.env.VITE_TARGET_DIV_SEARCH_MAX_ATTEMPTS,
);
const SOCKET_AUTH_TOKEN = process.env.VITE_SOCKET_AUTH_TOKEN || "";
const VITE_VERIFICATION_SERVER_URL =
  process.env.VITE_VERIFICATION_SERVER_URL || "";

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
    const fetchData = async () => {
      await initializeVerification();
      await verifyCookie("1df13426a8e9ef65b58b622aab3ad094-1730798576000");
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL, {
      query: {
        verifyId,
      },
      auth: {
        token: SOCKET_AUTH_TOKEN,
      },
    });

    socket.on(
      "verification-result",
      (result: VerificationConfirmedResponse) => {
        console.log("Verification result:", result);

        if (verifyUuid === result.verifyUuid) {
          createCookie(
            COOKIE_KEY_VISIT_ID,
            result.visitCookieId || "",
            COOKIE_AGE_SECONDS,
          );
          setClientVerified(true);
          setHiddenInputValue(result.verifyUuid);
        }
      },
    );

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

// const getOrCreateCookie = (
//   name: string,
//   maxAge: number = COOKIE_AGE_SECONDS,
// ) => {
//   let cookieValue = getCookie(name);

//   if (!cookieValue) {
//     cookieValue = uuidv4();
//     createCookie(name, cookieValue, maxAge);
//     console.log(
//       `HardAgeVerification: Vytvořena nová cookie '${name}' s hodnotou:`,
//       cookieValue,
//     );
//   } else {
//     console.log(
//       `HardAgeVerification: Načtena existující cookie '${name}' s hodnotou:`,
//       cookieValue,
//     );
//   }
//   return cookieValue;
// };

const getCookie = (name: string) => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) return cookieValue;
  }
  return null;
};

const createCookie = (name: string, cookieValue: string, maxAge: number) => {
  document.cookie = `${name}=${cookieValue}; max-age=${maxAge}; path=/; samesite=none; secure=true`;
};

const initializeVerification = async () => {
  // const verifyUuid = getOrCreateCookie(COOKIE_KEY_UUID);

  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/${VITE_VERIFICATION_SERVER_URL}/api/client/init`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `AGEPROOFKEY`, // if token-based auth is required
          Origin: "http://localhost:5173",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to verify: ${response.statusText}`);
    }

    const result: InitVerificationResponse = await response.json();
    console.log("Init result from backend:", result);
    return result;
  } catch (error) {
    console.error("Error during initialization:", error);
  }
};

const verifyCookie = async (cookieID: string) => {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/${VITE_VERIFICATION_SERVER_URL}/api/client/verify-cookie?ageproof-visit-cookie=${cookieID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `AGEPROOFKEY`,
          Origin: "http://localhost:5173",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to verify: ${response.statusText}`);
    }

    const result: VerifyCookieResponse = await response.json();
    console.log("Verification result from backend:", result);

    return result;
  } catch (error) {
    console.error("Error during verification:", error);
  }
};

const loadWidget = () => {
  let initCount = 0;

  const initializeWidget = async () => {
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

    let cookieVerification;
    let initVerification;

    const visitedCookieId = getCookie(COOKIE_KEY_VISIT_ID);
    if (visitedCookieId) {
      cookieVerification = await verifyCookie(visitedCookieId);
    } else {
      initVerification = await initializeVerification();
    }
    if (!cookieVerification && !initVerification) return;

    // const cookieVerifyId = getOrCreateCookie(COOKIE_KEY_ID);
    // const cookieVerifyUuid = getOrCreateCookie(COOKIE_KEY_UUID);

    const verifyId =
      initVerification?.["ageproof-verify-id"] ||
      cookieVerification?.["ageproofcz-verify-id"];
    const verifyUuid =
      initVerification?.["ageproof-verify-uuid"] ||
      cookieVerification?.["ageproofcz-verify-uid"];

    if (!verifyId || !verifyUuid) return;

    ReactDOM.render(
      <HardAgeVerification
        redirectUrl={`${VITE_VERIFICATION_SERVER_URL}/verify?apiKey=${apiKey}&verifyId=${
          verifyId
        }&verifyUuid=${verifyUuid}`}
        verifyId={verifyId}
        verifyUuid={verifyUuid}
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
