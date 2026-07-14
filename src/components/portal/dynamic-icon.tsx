"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type LucideIcon = React.ComponentType<LucideProps>;

export function DynamicIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon = React.useMemo<LucideIcon>(() => {
    return (
      ((LucideIcons as unknown as Record<string, LucideIcon>)[name] ||
        LucideIcons.Landmark) as LucideIcon
    );
  }, [name]);
  return <Icon {...props} />;
}
