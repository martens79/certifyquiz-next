"use client";

import { MDXProvider } from "@mdx-js/react";
import * as React from "react";

export default function ClientMDXWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MDXProvider>{children}</MDXProvider>;
}
