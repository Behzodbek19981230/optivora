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
    'Access-Control-Allow-Origin': '*'
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
  static get(path: string, params = {}, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: path,
      params: { ...params },
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }

  static post(path: string = '', data: any = {}, optionalHeader: OptionalHeader = {}) {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }

  static patch(path: string = '', data: any = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader(), ...contentTypeJson }
    }
    return client(config)
  }

  static delete(path: string = '', data: any = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() }
    }
    return client(config)
  }

  static put(path: string = '', data: any = {}, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }
  static login(path: string = '', data: any = {}, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: path,
      data,
      headers: { ...optionalHeader, ...contentTypeJson }
    }
    return client(config)
  }
  static postForm(path: string = '', data: any = {}, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeForm }
    }
    return client(config)
  }
  static putForm(path: string = '', data: any = {}, optionalHeader: OptionalHeader = {}): Promise<AxiosResponse> {
    const config: AxiosRequestConfig = {
      method: 'PUT',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader, ...contentTypeForm }
    }
    return client(config)
  }
}

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
