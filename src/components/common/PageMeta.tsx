import { useEffect, type ReactNode } from "react";

type PageMetaProps = {
  title: string;
  description: string;
};

const PageMeta = ({ title, description }: PageMetaProps) => {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = title;

    let descriptionMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.setAttribute("content", description);
  }, [title, description]);

  return null;
};

export const AppWrapper = ({ children }: { children: ReactNode }) => <>{children}</>;

export default PageMeta;
