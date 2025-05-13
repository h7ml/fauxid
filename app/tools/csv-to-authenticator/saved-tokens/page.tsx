import { Metadata } from "next";
import AuthenticatorTokenList from "@/components/ui/authenticator-token-list";
import { QrCode, ArrowLeft, Database, Upload, DownloadCloud, Layers, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SavedTokensPageClient from "./page.client";

export const metadata: Metadata = {
  title: "已保存的认证令牌 - FauxID",
  description: "管理您保存的认证令牌",
};

export default function SavedTokensPage() {
  return <SavedTokensPageClient />;
} 
