/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
    i18n,
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
