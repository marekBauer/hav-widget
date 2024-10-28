import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface RedirectCheckboxComponentProps {
  redirectUrl: string;
  email?: string;
  phone?: string;
}

export const RedirectCheckboxComponent: React.FC<RedirectCheckboxComponentProps> = ({ redirectUrl, email, phone }) => {
  const [checkboxLabel] = useState<string>('Verifikace');

  console.log(redirectUrl, email, phone)

  const handleCheckboxClick = () => {
    window.location.href = redirectUrl;
  };

  return (
    <label>
      <input type="checkbox" onClick={handleCheckboxClick} />
      {checkboxLabel}
    </label>
  );
};

const autoloadWidget = () => {
  const initializeWidget = () => {
    console.log('autoloadWidget');
    
    const targetDiv = document.querySelector<HTMLDivElement>('div[data-widget="redirect-checkbox"]');
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

    if (!formFound) {
      alert('Form not found');
      return;
    }

    const emailInput = formFound.querySelector<HTMLInputElement>('input[name="email"]');
    const phoneInput = formFound.querySelector<HTMLInputElement>('input[name="phone"]');
    const email = emailInput?.value || '';
    const phone = phoneInput?.value || '';

    ReactDOM.render(
      <RedirectCheckboxComponent redirectUrl={redirectUrl} email={email} phone={phone} />,
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
// (window as any).autoloadWidget = autoloadWidget;
