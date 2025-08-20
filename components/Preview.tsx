"use client";

import React from "react";

export default function Preview({component}: {component: string}) {
  return (
    <iframe
      src={`${process.env.STORYBOOK_URL}/iframe.html?globals=backgrounds.value%3Alight&id=${component}--default&viewMode=story`}
      width="100%"
      height={400}
    ></iframe>
  );
}
