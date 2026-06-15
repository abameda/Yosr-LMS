import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import RootLayout from "./layout";

describe("RootLayout", () => {
  it("declares Arabic as the default language and RTL direction", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>المحتوى</main>
      </RootLayout>,
    );

    expect(markup).toContain('<html lang="ar" dir="rtl">');
  });
});
