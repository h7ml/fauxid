"use client";

import { useState, useEffect } from "react";
import { IdentityType } from "@/lib/types";
import IdentityCard from "./identity-card";

interface IdentityListProps {
  identities: IdentityType[];
  showActions?: boolean;
}

export default function IdentityList({ identities, showActions = true }: IdentityListProps) {
  const [localIdentities, setLocalIdentities] = useState(identities);

  // 当传入的identities变化时，更新本地状态
  useEffect(() => {
    setLocalIdentities(identities);
  }, [identities]);

  function handleDeleteIdentity(identityId: string) {
    setLocalIdentities(localIdentities.filter(identity => identity.id !== identityId));
  }

  if (localIdentities.length === 0) {
    return (
      <div className="text-center py-12 px-4 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">暂无身份信息</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {localIdentities.map(identity => (
        <div key={identity.id} className="h-full">
          <IdentityCard
            identity={identity}
            showActions={showActions}
            onDelete={() => handleDeleteIdentity(identity.id)}
          />
        </div>
      ))}
    </div>
  );
} 
