"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Toaster } from "sonner";

import { Provider } from "react-redux";
import { store } from "@/lib/store";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const shouldShowLayout = !pathname.startsWith("/admin");

  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      {shouldShowLayout && <Header />}
      <main>{children}</main>
      {shouldShowLayout && <Footer />}
    </Provider>
  );
};

export default UserLayout;
  