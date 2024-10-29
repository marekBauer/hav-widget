import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  border: 1px dashed #b1b1b1;
  padding: 10px;
  max-width: 300px;
  font-family: Arial, sans-serif;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;

const Text = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  color: #000;
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #777;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

const LogoCheck = styled.div`
  color: green;
  font-size: 20px;
  margin-left: -5px;
`;

interface RedirectCheckboxComponentProps {
  redirectUrl: string;
  email?: string;
  phone?: string;
}

export const RedirectCheckboxComponent: React.FC<
  RedirectCheckboxComponentProps
> = ({ redirectUrl, email, phone }) => {
  console.log('checkbox');
  console.log(redirectUrl, email, phone);

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form submission
    console.log('click');
    window.location.href = redirectUrl;
  };

  return (
    <Container>
      <Checkbox onChange={handleCheckboxClick} />
      <Text>
        <Title>Ověřit můj věk</Title>
        <Subtitle>Podmínky použití – Zajišťuje ...</Subtitle>
      </Text>
      <Logo>
        A<LogoCheck>✓</LogoCheck>
      </Logo>
    </Container>
  );
};

function getOrCreateCookie(name: string, maxAge: number) {
  let cookieValue = getCookie(name);
  if (!cookieValue) {
    cookieValue = generateUuid();
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
}

function getCookie(name: string) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) return cookieValue;
  }
  return null;
}

function generateUuid() {
  const uuid = 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
  console.log('HardAgeVerification: Generováno UUID:', uuid);
  return uuid;
}

const autoloadWidget = () => {
  const initializeWidget = () => {
    console.log('autoloadWidget');
    console.log(document);
    const targetDiv = document.querySelector('.hav');
    if (!targetDiv) {
      setTimeout(initializeWidget, 100);
      console.warn('Target div not found');
      return;
    }
    console.log(targetDiv);

    const apiKey = targetDiv.getAttribute('data-apiKey') || '';
    if (!apiKey) {
      console.warn('API key not found');
      return;
    }

    console.log(apiKey);

    // Find the parent form element
    let parent = targetDiv?.parentElement;
    let formFound: HTMLFormElement | null = null;

    while (parent) {
      if (parent.tagName === 'FORM') {
        formFound = parent as HTMLFormElement;
        break;
      }
      parent = parent.parentElement;
    }

    console.log(formFound);

    if (!formFound) {
      alert('Form not found');
      return;
    }

    const emailInput = formFound.querySelector<HTMLInputElement>(
      'input[name="email"]'
    );
    const phoneInput = formFound.querySelector<HTMLInputElement>(
      'input[name="phone"]'
    );
    console.log(emailInput);
    console.log(phoneInput);

    const email = emailInput?.value || '';
    const phone = phoneInput?.value || '';

    const siteUrl = encodeURIComponent(window.location.href.split('?')[0]);
    const referrer = encodeURIComponent(document.referrer);
    const cookieUuid = getOrCreateCookie('hardageverification_session', 3600);

    ReactDOM.render(
      <RedirectCheckboxComponent
        redirectUrl={`https://loc82.hav-backend.com/get-iframe/${apiKey}?site_url=${siteUrl}&referrer=${referrer}&uuid=${cookieUuid}`}
        email={email}
        phone={phone}
      />,
      targetDiv
    );
  };

  // Check if the DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
};

autoloadWidget();
