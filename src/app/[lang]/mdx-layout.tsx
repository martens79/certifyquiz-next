import * as React from "react";
import ClientMDXWrapper from "@/components/ClientMDXWrapper";

export default function MDXLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientMDXWrapper>
      <div className="prose dark:prose-invert max-w-none px-4 py-6">
        {children}
      </div>
    </ClientMDXWrapper>
  );
}
