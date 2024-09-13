/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.hbs$/,
      use: "handlebars-loader",
    });

    return config;
  },
};

export default nextConfig;
