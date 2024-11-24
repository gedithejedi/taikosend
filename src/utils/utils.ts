export const backendUrl =
  process.env.NODE_ENV === "production"
    ? `https://taikosend.vercel.app/api/`
    : `http://localhost:3000/api/`;

    export const shortenAddress = (address: string | undefined, start?: number, end?: number) => {
      if (!address) return '';
      return `${address.substring(0, (start || 6))}...${address.substring(address.length - (end || 4), address.length)}`;
    };
