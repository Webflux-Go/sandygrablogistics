import QueryProvider from "@/app/components/shop/providers/query-provider";
import ReduxProvider from "@/app/components/shop/providers/redux-provider";
import SessionProvider from "@/app/components/shop/providers/session-provider";
import WishlistSync from "@/app/components/shop/providers/wishlist-sync";
import ModalRoot from "@/app/components/shop/modals/modal-root";
import { getCurrentUser } from "@/lib/auth/user";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const authenticated = Boolean(user);

  return (
    <QueryProvider>
      <ReduxProvider>
        <SessionProvider authenticated={authenticated}>
          {children}
          <WishlistSync authenticated={authenticated} />
          <ModalRoot email={user?.email ?? null} />
        </SessionProvider>
      </ReduxProvider>
    </QueryProvider>
  );
}
