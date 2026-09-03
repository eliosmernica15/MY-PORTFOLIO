// Contact details for the Resume and Footer sections. Derives from
// `SITE` so the source of truth stays in one place (`src/data/site.ts`)
// and the legacy `CONTACT_INFO` shape from the `52b4575` baseline
// keeps working without a parallel data file to keep in sync.
//
// If a field used by Resume/Footer isn't on `SITE` (e.g. `birthday`),
// add it to `SITE` and reference it here. Do NOT hardcode the values.
import { SITE } from './site';

export const CONTACT_INFO = {
  email: SITE.email,
  phone: SITE.phone,
  location: SITE.location,
  birthday: SITE.birthday,
};
