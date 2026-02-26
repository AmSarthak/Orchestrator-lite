export type Step = {
    name : string
    duration : number;
    failMode? : "Random" | "None"
    retryCount : number
}