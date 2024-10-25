import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface RedirectCheckboxComponentProps {
  redirectUrl: string;
  email?: string;
  phone?: string;
}

export const RedirectCheckboxComponent: React.FC<RedirectCheckboxComponentProps> = ({ redirectUrl, email, phone }) => {
  const [checkboxLabel, setCheckboxLabel] = useState<string>('Verifikace');

  console.log(redirectUrl, email, phone)

  const handleCheckboxClick = () => {
    //window.location.href = redirectUrl;
  };

  return (
    <label>
      <input type="checkbox" onClick={handleCheckboxClick} />
      {checkboxLabel}
    </label>
  );
};

const autoloadWidget = () => {
  console.log('autoloadWidget')
  const targetDiv = document.querySelector<HTMLDivElement>('div[data-widget="redirect-checkbox"]');

  if (!targetDiv) {
    console.warn('Target div with data-widget="redirect-checkbox" not found');
    return;
  }

  const redirectUrl = targetDiv.getAttribute('data-redirect-url') || '';
  if (!redirectUrl) {
    console.warn('API endpoint or redirect URL not specified in the target div attributes');
    return;
  }
  console.log(targetDiv)

  let parent = targetDiv?.parentElement;
  let formFound: HTMLFormElement | null = null;

  while (parent) {
    if (parent.tagName === 'FORM') {
      formFound = parent as HTMLFormElement; 
      break; 
    }
    parent = parent.parentElement; 
  }

  if (!formFound) {
    alert('Form not found');
    return
  } else {
  }

  const emailInput = formFound.querySelector<HTMLInputElement>('input[name="email"]');
    const phoneInput = formFound.querySelector<HTMLInputElement>('input[name="phone"]');
    const email = emailInput?.value || '';
    const phone = phoneInput?.value || '';

    // if (email && name) {
    //   window.location.href = `${redirectUrl}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    // } else {
    //   alert('Please fill in both the name and email fields');
    // }

  ReactDOM.render(
    <RedirectCheckboxComponent redirectUrl={redirectUrl} email={email} phone={phone} />,
    targetDiv
  );
};

autoloadWidget();

(window as any).autoloadWidget = autoloadWidget;