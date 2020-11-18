export function handle<T>(promise: Promise<T>) {
    return promise
        .then(data => ([data, undefined]))
        .catch((error: Error) => ([undefined, error]));
}