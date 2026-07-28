import QueryProvider from "@/app/components/shop/providers/query-provider";
import ReduxProvider from "@/app/components/shop/providers/redux-provider";
import ModalRoot from "@/app/components/shop/modals/modal-root";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ReduxProvider>
        {children}
        <ModalRoot />
      </ReduxProvider>
    </QueryProvider>
  );
}
