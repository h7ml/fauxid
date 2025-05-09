import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SmtpMessage() {
  return (
    <Alert className="bg-muted/50 border-muted-foreground/20 animate-fadeIn">
      <InfoIcon className="h-4 w-4 text-muted-foreground" />
      <AlertTitle className="text-sm font-medium">注意</AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground">
        邮件发送有频率限制。启用自定义SMTP可以提高发送频率限制。
        <Link
          href="https://supabase.com/docs/guides/auth/auth-smtp"
          target="_blank"
          className="text-primary hover:text-primary/80 transition-colors flex items-center text-xs gap-1 mt-2 font-medium"
        >
          了解更多 <ArrowUpRight size={12} />
        </Link>
      </AlertDescription>
    </Alert>
  );
}
