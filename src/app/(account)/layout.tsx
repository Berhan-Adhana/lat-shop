// src/app/(account)/layout.tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh", background: "#fdf8f0" }}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
