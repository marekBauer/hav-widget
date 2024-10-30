import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { Checkbox, Container, Logo, Subtitle, Title, Text, HiddenInput } from './widget.styled';
import { useTranslation } from 'react-i18next';
import '../i18n';

interface HardAgeVerificationProps {
  redirectUrl: string;
  email?: string;
  phone?: string;
  hiddenInputValue?: string;
}

const COOKIE_AGE_SECONDS = 3600;

export const HardAgeVerification: React.FC<
  HardAgeVerificationProps
> = ({ redirectUrl, hiddenInputValue }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <Container onClick={handleClick}>
      <Checkbox onClick={(e)  => e.preventDefault()}/>
      <Text>
        <Title>{t('verifyTitle')}</Title>
        <Subtitle>{t('verifySubtitle')}</Subtitle>
      </Text>
      <Logo>FJ</Logo>
      <HiddenInput value={hiddenInputValue}/>
    </Container>
  );
};

const getOrCreateCookie = (name: string, maxAge: number = COOKIE_AGE_SECONDS) => {
  let cookieValue = getCookie(name);

  if (!cookieValue) {
    cookieValue = uuidv4();
    document.cookie = `${name}=${cookieValue}; max-age=${maxAge}; path=/; samesite=none; secure=true`;
    console.log(
      `HardAgeVerification: Vytvořena nová cookie '${name}' s hodnotou:`,
      cookieValue
    );
  } else {
    console.log(
      `HardAgeVerification: Načtena existující cookie '${name}' s hodnotou:`,
      cookieValue
    );
  }
  return cookieValue;
};

const getCookie = (name: string) => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) return cookieValue;
  }
  return null;
};

const loadWidget = () => {
  const initializeWidget = () => {
    const targetDiv = document.querySelector('.hav');
    if (!targetDiv) {
      setTimeout(initializeWidget, 100);
      console.warn('Target div not found');
      return;
    }

    const apiKey = targetDiv.getAttribute('data-apiKey') || '';

    if (!apiKey) {
      console.warn('API key not found');
      return;
    }

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

    const cookieUuid = getOrCreateCookie('hav_verification_session');
    
    ReactDOM.render(
      <HardAgeVerification
        redirectUrl={`https://loc82.hav-backend.com/verify?call_api_key=${apiKey}&call_verify_id=${2024252536}&call_verify_uid=${cookieUuid}`}
      />,
      targetDiv
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
};

loadWidget();