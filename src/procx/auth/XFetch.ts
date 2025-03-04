import { getToken } from "./cookie";

export type RequestMethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 응답 타입 정의
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiData<T = any> {
  code: string;
  message: string | null;
  data: T | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  data: T | null;
  errCode: number | null;
  errMsg: string | null;
  isSuccess: boolean;
}

// 요청 옵션 타입 정의
export interface RequestOptions {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
  cache?: RequestCache;
  timeout?: number;
}

// 에러 메시지 추출 함수 개선
const getErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err;

  if (err instanceof Error) return err.message;

  if (err && typeof err === "object") {
    const errorObj = err as Record<string, unknown>;
    return (
      (errorObj.msg as string) ||
      (errorObj.message as string) ||
      (errorObj.error_description as string) ||
      (errorObj.error as string) ||
      JSON.stringify(err)
    );
  }

  return "Unknown error";
};

export class XFetch {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultOptions: RequestOptions;

  constructor(baseUrl: string, defaultOptions: RequestOptions = {}) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json;utf-8",
    };
    this.defaultOptions = {
      // 기본 옵션으로 타임아웃 5초와 credentials include 설정
      timeout: 5000,
      credentials: "include",
      ...defaultOptions, // 사용자 지정 옵션이 있으면 덮어쓰기
    };
  }

  // 인스턴스 생성 (싱글톤 패턴)
  static create(
    baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "",
    options: RequestOptions = {}
  ): XFetch {
    console.log("baseUrl ===" + process.env.NEXT_PUBLIC_BASE_URL);
    return new XFetch(baseUrl, options);
  }

  // 요청 URL 구성
  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
  }

  // 요청 헤더 구성
  private getHeaders(customHeaders?: Record<string, string>): Headers {
    const headers = new Headers({
      ...this.defaultHeaders,
      ...customHeaders,
    });

    // 인증 토큰이 있으면 추가
    const token = getToken();
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  // 요청 실행 및 응답 처리
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async request<T = any>(
    method: RequestMethodType,
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = this.getUrl(endpoint);
    const headers = this.getHeaders(options.headers);

    // 타임아웃 설정 - 옵션에서 지정하거나 기본값 사용
    const abortController = new AbortController();
    const { signal } = abortController;

    const timeout = options.timeout || this.defaultOptions.timeout;
    const timeoutId = timeout
      ? setTimeout(() => abortController.abort(), timeout)
      : null;

    try {
      const requestOptions: RequestInit = {
        method,
        headers,
        signal,
        credentials:
          options.credentials ||
          this.defaultOptions.credentials ||
          "same-origin",
        cache: options.cache || this.defaultOptions.cache,
      };

      // GET 요청이 아닌 경우에만 body 추가
      if (method !== "GET" && body !== undefined) {
        requestOptions.body =
          typeof body === "string" ? body : JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);

      // 타임아웃 제거
      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData = null;
        try {
          // 서버에서 반환하는 에러 정보 파싱 시도
          errorData = await response.json();
        } catch (e) {
          // JSON 파싱 실패 시 기본 에러 메시지 사용
          errorData = getErrorMessage(e);
        }

        return {
          data: null,
          errCode: response.status,
          errMsg: errorData?.message || response.statusText,
          isSuccess: false,
        };
      }

      // 응답 본문이 있는지 확인 (204 No Content 등의 경우)
      const contentType = response.headers.get("content-type");
      let data: T | null = null;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else if (response.status !== 204) {
        // 텍스트로 응답 받기
        const text = await response.text();
        data = text as unknown as T;
      }

      return {
        data,
        errCode: null,
        errMsg: null,
        isSuccess: true,
      };
    } catch (error) {
      // 타임아웃 제거
      if (timeoutId) clearTimeout(timeoutId);

      // AbortError 확인
      const isTimeout =
        error instanceof DOMException && error.name === "AbortError";

      return {
        data: null,
        errCode: isTimeout ? 408 : 0,
        errMsg: isTimeout ? "Request timeout" : getErrorMessage(error),
        isSuccess: false,
      };
    }
  }

  // HTTP 메서드 구현
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T = any>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T = any>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async patch<T = any>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }
}

// 기본 인스턴스 생성 및 내보내기
export const xfetch = XFetch.create();

// 특정 베이스 URL을 사용하는 인스턴스 생성 예시
// export const apiClient = XFetch.create('https://api.example.com');
