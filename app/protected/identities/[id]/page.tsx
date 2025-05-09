import { getIdentity } from "@/app/actions/identity-actions";
import IdentityDetail from "@/components/identity/identity-detail";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function IdentityPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = params;
  const result = await getIdentity(id);

  if (!result.success || !result.data) {
    redirect("/protected");
  }

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center">
        <Link href="/protected/identities">
          <Button variant="ghost" className="p-0 h-auto mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">身份详情</h1>
      </div>

      <IdentityDetail
        identity={result.data}
      />
    </div>
  );
} 
