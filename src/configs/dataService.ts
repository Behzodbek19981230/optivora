import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

interface OptionalHeader {
  [key: string]: string
}
export type ServerError = {
  error: string
  message: string
  statusCode: number
}
const authHeader = () => {
  if (typeof window !== 'undefined') {
    return {
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    }
  }
}

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
  }
})
const contentTypeJson = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}
const contentTypeForm = {
  // 'Content-Type': 'multipart/form-data'
  // 'Content-Type': 'application/json',
  Accept: 'application/json'
}

class DataService {
  static get<T = any>(path: string, params = {}, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: path,
      params: { ...params },
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }

  static post<T = any, B = any>(path: string = '', data: B = {} as B, optionalHeader: OptionalHeader = {}) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }

  static patch<T = any, B = any>(path: string = '', data: B = {} as B): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader(), ...contentTypeJson }
    }
    return client(config)
  }

  static delete<T = any, B = any>(path: string = '', data: B = {} as B): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() }
    }
    return client(config)
  }

  static put<T = any, B = any>(path: string = '', data: B = {} as B, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }
  static login<T = any, B = any>(path: string = '', data: B = {} as B, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: path,
      data,
      headers: { ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }
  static postForm<T = any, B = any>(path: string = '', data: B = {} as B, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeForm }
    }
    return client(config)
  }
  static putForm<T = any, B = any>(path: string = '', data: B = {} as B, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeForm }
    }
    return client(config)
  }
}



client.interceptors.request.use(config => {

  return config
})

client.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    let message
    switch (error.response?.status) {
      case 500:
        message = 'Внутренняя ошибка сервера!'
        break
      case 401:
        message = error.response?.data
        localStorage.clear()
        window.location.href = '/'
        break
      case 400:
        message = error.response
        break
      default:
        message = error.response?.data
    }
    return Promise.reject(message)
  }
)

export { DataService }
