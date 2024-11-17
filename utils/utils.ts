export const backendUrl =
  process.env.NODE_ENV === "production"
    ? `https://chainview-six.vercel.app/api/`
    : `http://localhost:3000/api/`;
