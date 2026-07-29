import QueryProvider from "@/app/components/shop/providers/query-provider";
import ReduxProvider from "@/app/components/shop/providers/redux-provider";
import ModalRoot from "@/app/components/shop/modals/modal-root";
import { getCurrentUser } from "@/lib/auth/user";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <QueryProvider>
      <ReduxProvider>
        {children}
        <ModalRoot email={user?.email ?? null} />
      </ReduxProvider>
    </QueryProvider>
  );
}
