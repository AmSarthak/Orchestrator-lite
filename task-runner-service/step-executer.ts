import { Step } from "./types";

function delay(ms: number){
    return new Promise<void>((resolve)=> setTimeout(() => {
        resolve();
    }, ms))
}

export async function executeStep(step : Step) : Promise<void>{
    await delay(step.duration);
    if(step.failMode=="Random" && Math.random() < 0.6){
        throw new Error(`Step ${step.name} failed`)
    }
}

