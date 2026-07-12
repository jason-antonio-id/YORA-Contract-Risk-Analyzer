import serverless from "serverless-http";
import app from "../server";
 
// Wraps the existing Express app so all /api/* routes work as a single
// Vercel serverless function, without rewriting every route individually.
export default serverless(app);
 
