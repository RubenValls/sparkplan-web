import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn about how SparkPlan uses cookies to improve your browsing experience.",
  alternates: {
    canonical: "/cookies",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
