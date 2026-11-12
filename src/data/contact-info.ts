// Contact details for the Resume and Footer sections. Derives from
// `SITE` so the source of truth stays in one place (`src/data/site.ts`)
// and the legacy `CONTACT_INFO` shape from the `52b4575` baseline
// keeps working without a parallel data file to keep in sync.
import { SITE } from "./site";

export const CONTACT_INFO = {
  email: SITE.email,
  phone: SITE.phone,
  location: SITE.location,
};
