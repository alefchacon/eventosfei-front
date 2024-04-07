import { urlEvaluations } from "./urls"

export default async function CreateEvaluation(evaluation){
    const response = await fetch (urlEvaluations, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evaluation),
    });
}