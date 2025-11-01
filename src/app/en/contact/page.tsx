"use client";

import * as React from "react";
import Content from "./content.mdx";

export default function Page() {
  return (
    <div className="prose dark:prose-invert max-w-none px-4 py-6">
      <Content />
    </div>
  );
}
