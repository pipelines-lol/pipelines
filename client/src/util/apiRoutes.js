const host =
  process.env.MODE === "DEV"
    ? "http://localhost:4000"
    : process.env.MODE === "PROD"
    ? "https://pipelines-backend.onrender.com"
    : (console.error("Unknown mode:", process.env.MODE), null);

export { host };