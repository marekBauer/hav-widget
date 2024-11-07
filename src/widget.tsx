import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
// import { v4 as uuidv4 } from "uuid";
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
import { Loader } from "./loader";
import { createRoot } from "react-dom/client";

interface VerificationConfirmedResponse {
  verifyId: string;
  verifyUuid: string;
  isAdult: boolean;
}

interface InitVerificationResponse {
  "ageproof-verify-id": string;
  "ageproof-verify-uuid": string;
  "ageproof-expiration-time": string;
  "ageproof-visit-cookie": string;
}

interface VerifyCookieResponse {
  "ageproof-verify-id": string;
  "ageproof-verify-uuid": string;
  "ageproof-visit-cookie": string;
  "ageproof-expiration-time": string;
  "ageproof-verify-status": "new" | "verified";
  "ageproof-is-adult": boolean;
}

// const COOKIE_KEY_ID = process.env.VITE_COOKIE_KEY_ID || "";
// const COOKIE_KEY_UUID = process.env.VITE_COOKIE_KEY_UUID || "";
const COOKIE_KEY_VISIT_ID = process.env.VITE_COOKIE_KEY_VISIT_ID || "";
// const COOKIE_AGE_SECONDS = Number(process.env.VITE_COOKIE_AGE_SECONDS);
const SOCKET_SERVER_URL = process.env.VITE_SOCKET_SERVER_URL || "";
const TARGET_DIV_SEARCH_MAX_ATTEMPTS = Number(
  process.env.VITE_TARGET_DIV_SEARCH_MAX_ATTEMPTS,
);
const SOCKET_AUTH_TOKEN = process.env.VITE_SOCKET_AUTH_TOKEN || "";
const VITE_VERIFICATION_SERVER_URL =
  process.env.VITE_VERIFICATION_SERVER_URL || "";
const VERIFICATION_API_KEY = process.env.VITE_VERIFICATION_API_KEY || "";
const VERIFICATION_EXPIRED_CODE = 409;

interface HardAgeVerificationProps {
  redirectUrl: string;
  verifyId: string;
  verifyUuid: string;
  email?: string;
  phone?: string;
  isVerified?: VerifyCookieResponse["ageproof-verify-status"];
  isAdult?: VerifyCookieResponse["ageproof-is-adult"];
}

export const HardAgeVerification: React.FC<HardAgeVerificationProps> = ({
  redirectUrl,
  verifyId,
  verifyUuid,
  isVerified,
  isAdult,
}) => {
  const { t } = useTranslation();

  const [clientVerified, setClientVerified] = useState<boolean>(
    isVerified === "verified",
  );
  const [clientIsAdult, setClientIsAdult] = useState<boolean | undefined>(
    isAdult,
  );
  const [hiddenInputValue, setHiddenInputValue] = useState<string>("");

  const handleClick = () => {
    if (!clientVerified) {
      window.open(redirectUrl, "_blank");
    }
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const initVerification = await initializeVerification();
  //     if (!initVerification) return;
  //     const expirationTime =
  //       (new Date(initVerification?.["ageproof-expiration-time"]).getTime() -
  //         new Date().getTime()) /
  //       1000;
  //     console.log(expirationTime);
  //     createCookie(
  //       COOKIE_KEY_VISIT_ID + "test",
  //       initVerification?.["ageproof-visit-cookie"],
  //       10,
  //     );

  //     await verifyCookie("4a361625e9e1be3f076bdb945f7423e4-1730883699000");
  //   };

  //   fetchData();
  // }, []);

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
          setClientVerified(true);
          setClientIsAdult(!!result.isAdult);
          setHiddenInputValue(result.verifyUuid);
        }
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [verifyId, verifyUuid]);

  return (
    <Container
      onClick={handleClick}
      verified={clientVerified}
      isAdult={clientIsAdult}
    >
      <Checkbox
        onClick={(e) => e.preventDefault()}
        checked={clientVerified}
        onChange={(e) => e.preventDefault()}
      />
      <Text>
        <Title>{t("verifyTitle")}</Title>
        <Subtitle>
          {t("verifySubtitle")}
          {clientIsAdult === true && "A"}
          {clientIsAdult === false && "NA"}
        </Subtitle>
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
  document.cookie = `${name}=${cookieValue}; max-age=${Math.round(maxAge)}; path=/; samesite=none; secure=true`;
};

const initializeVerification = async () => {
  try {
    const currentOrigin = window.location.origin;
    const response = await fetch(
      `${VITE_VERIFICATION_SERVER_URL}/api/client/init`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `${VERIFICATION_API_KEY}`,
          Origin: currentOrigin,
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

const verifyCookie = async (
  cookieID: string,
): Promise<
  | {
      cookieVerification?: VerifyCookieResponse | undefined;
      status: number;
    }
  | undefined
> => {
  try {
    const currentOrigin = window.location.origin;
    const response = await fetch(
      `${VITE_VERIFICATION_SERVER_URL}/api/client/verify-cookie?ageproof-visit-cookie=${cookieID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": `${VERIFICATION_API_KEY}`,
          Origin: currentOrigin,
        },
      },
    );
    console.log(response);
    if (response.status === VERIFICATION_EXPIRED_CODE) {
      return { status: response.status };
    }

    if (!response.ok) {
      throw new Error(`Failed to verify: ${response.statusText}`);
    }

    const result: VerifyCookieResponse = await response.json();
    console.log("Verification result from backend:", result);

    return { cookieVerification: result, status: response.status };
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
        //poresit load kdyz je pomaly net
        setTimeout(initializeWidget, 500);
      }
      return;
    }

    ReactDOM.render(<Loader />, targetDiv);

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
      const response = await verifyCookie(visitedCookieId);
      if (response?.status === VERIFICATION_EXPIRED_CODE) {
        initVerification = await initializeVerification();
      } else {
        cookieVerification = response?.cookieVerification;
      }
      if (!cookieVerification && !initVerification) return;
    } else {
      initVerification = await initializeVerification();
      if (!initVerification) return;

      const expirationTime =
        (new Date(initVerification["ageproof-expiration-time"]).getTime() -
          new Date().getTime()) /
        1000;

      createCookie(
        COOKIE_KEY_VISIT_ID,
        initVerification?.["ageproof-visit-cookie"],
        expirationTime,
      );
    }

    // const cookieVerifyId = getOrCreateCookie(COOKIE_KEY_ID);
    // const cookieVerifyUuid = getOrCreateCookie(COOKIE_KEY_UUID);

    const verifyId =
      initVerification?.["ageproof-verify-id"] ||
      cookieVerification?.["ageproof-verify-id"];
    const verifyUuid =
      initVerification?.["ageproof-verify-uuid"] ||
      cookieVerification?.["ageproof-verify-uuid"];

    console.log(verifyId, verifyUuid);

    if (!verifyId || !verifyUuid) return;

    const root = createRoot(targetDiv);
    root.render(
      <HardAgeVerification
        redirectUrl={`${VITE_VERIFICATION_SERVER_URL}/verification/verify?apiKey=${apiKey}&verifyId=${
          verifyId
        }&verifyUuid=${verifyUuid}`}
        verifyId={verifyId}
        verifyUuid={verifyUuid}
        isVerified={cookieVerification?.["ageproof-verify-status"]}
        isAdult={cookieVerification?.["ageproof-is-adult"]}
      />,
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeWidget);
  } else {
    initializeWidget();
  }
};

loadWidget();
