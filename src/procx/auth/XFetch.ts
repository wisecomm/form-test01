import { getToken } from "./cookie";

export type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE'

export default class XFetch {
    baseUrl = "";

    // constructor(baseUrl: string) {
    //   this.baseUrl = baseUrl;
    // }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async get(url: string): Promise<any> {
//        const requestParams = _getRequestParams(method, options, parameters, body)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any

        try {
            result = await fetch(`${this.baseUrl}${url}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: "Bearer " + getToken(),
                },
                });
        } catch (e) {
            console.error(e)

            // fetch failed, likely due to a network or CORS error
            throw new AuthRetryableFetchError(_getErrorMessage(e), 0)
        }

        if (!result.ok) {
            await handleError(result)
        }
        if (options?.noResolveJson) {
            return result
        }

        try {
            return await result.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            await handleError(e)
        }
    }
}
