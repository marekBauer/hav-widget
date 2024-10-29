import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

interface RedirectCheckboxComponentProps {
  redirectUrl: string;
  email?: string;
  phone?: string;
}

export const RedirectCheckboxComponent: React.FC<
  RedirectCheckboxComponentProps
> = ({ redirectUrl, email, phone }) => {
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
      <input type='checkbox' onChange={handleCheckboxClick} />
      {checkboxLabel}
    </label>
  );
};

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

    // Create an iframe and append it to the targetDiv
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.height = '50px'; // Adjust the height as needed
    targetDiv.appendChild(iframe);

    // Wait for the iframe to load, then render the React component inside it
    iframe.onload = () => {
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        const iframeRoot = iframeDoc.createElement('div');
        iframeDoc.body.appendChild(iframeRoot);

        // Render the React component in the iframe's root
        createRoot(iframeRoot).render(
          <RedirectCheckboxComponent
            redirectUrl={'https://www.seznam.cz/'}
            email={email}
            phone={phone}
          />
        );
      }
    };
  };

  // Check if the DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWidget);
  } else {
    initializeWidget();
  }
};

autoloadWidget();
