import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import AppRoutes from "./routes/AppRoutes.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Amplify } from "aws-amplify";
import awsConfig from "./aws-exports.ts";

Amplify.configure(awsConfig);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
      <ThemeProvider>
        <AppWrapper>
          <AppRoutes />
        </AppWrapper>
      </ThemeProvider>
  </AuthProvider>,
);