# Hard age verification(HAV) - standalone widget component

This project serves as a standalone widget component that can be imported into any form to verify a customer's age. 

Complete documentation is available at: ...

## Setup

1. Instal packages
```npm install```
2. Run
```npm run dev```

## DEV 

For development purposes, a test component App.tsx is provided. It includes a basic form containing the element <div className="ageproof-cz" data-apikey="A3SVWCBN"></div> and the script <script src="https://marekbauer.github.io/hav-widget/dist/widget.bundle.js" defer></script> in index.html. The widget component is bundled using Webpack and pushed to the GitHub repository, where it is deployed via GitHub Pages.

Another way to test only the component itself is to include it directly from the `widget.tsx`. 

1. Create bundle
```npm run build```
2. Run ESlint
```npm run lint```