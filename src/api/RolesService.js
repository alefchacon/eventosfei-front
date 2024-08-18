import { urlRoles } from "./urls"
import { client } from "./Client.js";

export const GetRoles = async () => {
    const response = await client.get(urlRoles.getRoles)
    return response;
}
