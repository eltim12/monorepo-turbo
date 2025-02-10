"use client"; // Required for Client Components

import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
