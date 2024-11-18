export const backendUrl =
  process.env.NODE_ENV === "production"
    ? `https://taikosend.vercel.app/api/`
    : `http://localhost:3000/api/`;
