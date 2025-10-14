declare module 'js-cookie' {
  interface CookieAttributes {
    path?: string
    domain?: string
    expires?: number | Date
    sameSite?: 'strict' | 'lax' | 'none'
    secure?: boolean
  }
  interface CookiesStatic {
    get(name: string): string | undefined
    set(name: string, value: string, attributes?: CookieAttributes): void
    remove(name: string, attributes?: CookieAttributes): void
  }
  const Cookies: CookiesStatic
  export default Cookies
}
