import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient } from "react-query";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

export default function App({ Component, pageProps }: AppProps) {
  const queryclient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryOnMount: false,
        refetchOnReconnect: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryclient}>
      {process.env.NODE_ENV === "production" ? null : <ReactQueryDevtools />}
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
