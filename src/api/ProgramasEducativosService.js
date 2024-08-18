import { client } from "./Client.js";
import { urlProgramasEducativos } from "./urls";

export const GetProgramasEducativos = async () => {
  return await client.get(urlProgramasEducativos);
}