import axios from "axios";
interface BuildClientOptions {
  Cookie?: string;
  Authorization?: string;
}

export const buildClient = (options: BuildClientOptions = {}) => {
  const { Cookie, Authorization } = options;
  // const isDevelopment = process.env.NODE_ENV === "development";${process.env.NEXT_PUBLIC_VERCEL_URL}
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const headers =
    process.env.NEXT_IN_CLUSTER == "YES"
      ? {
          Host: "ticketing.dev",
          ...(Cookie && { Cookie }),
          ...(Authorization && { Authorization }),
        }
      : {};

  let client = null;
  if (typeof window === "undefined") {
    client = axios.create({
      baseURL,
      headers,
    });
  } else {
    // We must be on the browser
    client = axios.create({
      baseURL: "/",
    });
  }

  client.interceptors.request.use((config) => {
    if (!process.env.NEXT_IN_CLUSTER && config.url?.startsWith("/api/")) {
      config.url = config.url.replace("/en/api/", "/");
      config.url = config.url.replace("/ar/api/", "/");
      config.url = config.url.replace("/en/users/currentuser", "/currentUser");
      config.url = config.url.replace("/ar/users/currentuser", "/currentUser");
      console.log("Transformed URL:", config.url);
    }
    return config;
  });

  return client;
};
// import axios from "axios";

// const BuildClient = ({ req }) => {
//   if (typeof window === "undefined") {
//     // We are on the server

//     return axios.create({
//       baseURL:
//         "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
//       headers: req.headers,
//     });
//   } else {
//     // We must be on the browser
//     return axios.create({
//       baseUrl: "/",
//     });
//   }
// };
// export default BuildClient;

// };
