import { urlPublicity } from "./urls"
import { client } from "./Client.js";

export const GetPublicity = async (idEvento = 0) => {
    const response = await client.get(urlPublicity(idEvento))
    return response;
}
