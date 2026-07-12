import app from "../server.js";

// Vercel's Node.js runtime can invoke an Express app directly as a request
// handler, since express() returns a function compatible with Node's raw
// (req, res) HTTP interface. No Lambda-style adapter needed.
export default app;
