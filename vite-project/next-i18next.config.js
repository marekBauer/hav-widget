/** @type {import('next-i18next').UserConfig} */
module.exports = {
    i18n: {
        defaultLocale: 'cs',
        //fallbackLng: 'cs',
        locales: ['cs', 'en'],
        defaultNS: 'common',
        localeDetection: false,
        localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/public/locales',
    },
};
