import { urlEvents } from "./urls"

export default async function GetEvents(){
    const response = await fetch (urlEvents, {
        method: 'GET', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
    });
    return response;
}