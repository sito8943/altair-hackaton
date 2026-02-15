const toBoolean = (value?: string) => value === "true";

export const ENABLE_MOCK_API = toBoolean(
  import.meta.env.VITE_ENABLE_MOCK_API
);

export const ENABLE_SOCIO_DEMO_FIELDS = toBoolean(
  import.meta.env.VITE_ENABLE_SOCIO_DEMO_FIELDS
);
