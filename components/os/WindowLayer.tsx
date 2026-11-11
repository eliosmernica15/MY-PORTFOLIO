"use client";

import React, { memo } from "react";
import { useOs } from "./OsContext";
import Window from "./Window";

/**
 * Renders the stack of open ELIOS/OS application windows.
 * The layer itself is click-through; each window opts back in.
 */
const WindowLayer: React.FC = () => {
  const os = useOs();
  return (
    <div
      aria-hidden="false"
      className="pointer-events-none fixed inset-0 z-[15]"
    >
      {os.windows.map((w) => (
        <Window key={w.appId} appId={w.appId} />
      ))}
    </div>
  );
};

export default memo(WindowLayer);
