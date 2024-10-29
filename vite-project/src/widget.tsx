import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface RedirectCheckboxComponentProps {
  redirectUrl: string;
  email?: string;
  phone?: string;
}

export const RedirectCheckboxComponent: React.FC<RedirectCheckboxComponentProps> = ({ redirectUrl, email, phone }) => {
  const [checkboxLabel] = useState<string>('Verifikace');

  console.log('checkbox');
  console.log(redirectUrl, email, phone);

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent form submission
    console.log('click');
    window.location.href = redirectUrl;
  };

  return (
    <label>
      <input type="checkbox" onChange={handleCheckboxClick} />
      {checkboxLabel}
    </label>
  );
};

const autoloadWidget = () => {
  const initializeWidget = () => {
  console.log('autoloadWidget');
  console.log(document)
  const targetDiv = document.getElementById("custom-widget")
  if (!targetDiv) {
    console.warn('Target div with data-widget="redirect-checkbox" not found');
    return;
  }

  const redirectUrl = targetDiv.getAttribute('data-redirect-url') || '';
  if (!redirectUrl) {
    console.warn('Redirect URL not specified in the target div attributes');
    return;
  }
  console.log(targetDiv);

  let parent = targetDiv?.parentElement;
  let formFound: HTMLFormElement | null = null;

  while (parent) {
    if (parent.tagName === 'FORM') {
      formFound = parent as HTMLFormElement;
      break;
    }
    parent = parent.parentElement;
  }
  console.log(formFound)

  if (!formFound) {
    alert('Form not found');
    return;
  }

  const emailInput = formFound.querySelector<HTMLInputElement>('input[name="email"]');
  const phoneInput = formFound.querySelector<HTMLInputElement>('input[name="phone"]');
  const email = emailInput?.value || '';
  const phone = phoneInput?.value || '';

  console.log(email, phone);

  ReactDOM.render(
    <RedirectCheckboxComponent redirectUrl={redirectUrl} email={email} phone={phone} />,
    targetDiv
  );
  }

  if (document.readyState === 'loading') {
    console.log('loading')
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    console.log('loaded')
    initializeWidget();
  }
};

autoloadWidget();
