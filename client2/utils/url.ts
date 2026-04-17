export const getBaseUrl = () => {
  const environment = process.env.NODE_ENV;

  const baseUrl =
    environment === "development"
      ? "http://localhost:4000"
      : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  console.log(baseUrl, "baseUrl");
  return baseUrl;
};
