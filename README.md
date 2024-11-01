# Hard age verification(HAV) standalone widget component

This project server as standalone widget component that could be imported within any form to verify customer's age

Complete documentation is available at: ...

## Setup

1. Instal packages
```npm install```
2. Run
```npm run dev```

## DEV 

For development purposes is created test component `App.tsx`. It contains basic form with include `<div className="ageproof-cz" data-apikey="A3SVWCBN"></div>` element and 
`<script src="https://marekbauer.github.io/hav-widget/dist/widget.bundle.js" defer></script>` included in `index.html`. Widget component is bundled using webpack and pushed to the Github repository, where it is deployed via GitHub Pages. 

Another way to test only the component itself is to include it directly from the `widget.tsx`. 

1. Create bundle
```npm run build```
2. Run eslint
```npm run lint```