"use client";

import { useState, useEffect } from "react";
import { IdentityType } from "@/lib/types";
import IdentityCard from "./identity-card";
import IdentityTable from "./identity-table";

interface IdentityListProps {
  identities: IdentityType[];
  showActions?: boolean;
  viewMode?: "grid" | "list" | "table";
}

export default function IdentityList({
  identities,
  showActions = true,
  viewMode = "grid"
}: IdentityListProps) {
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

  // 表格视图
  if (viewMode === "table") {
    return (
      <IdentityTable
        identities={localIdentities}
        onDelete={handleDeleteIdentity}
      />
    );
  }

  // 卡片或列表视图
  return (
    <div
      className={viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "flex flex-col space-y-4"
      }
    >
      {localIdentities.map(identity => (
        <div
          key={identity.id}
          className={viewMode === "grid" ? "h-full" : "w-full"}
        >
          <IdentityCard
            identity={identity}
            showActions={showActions}
            onDelete={() => handleDeleteIdentity(identity.id)}
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  );
} 
