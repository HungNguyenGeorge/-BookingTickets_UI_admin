import { useLazyAxios } from 'use-axios-client'

const useUpdateUniversity = (id, payload) => {
  const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university/${id}`

  return useLazyAxios({
    url: API,
    method: 'PUT',
    data: payload,
  })
}

export default useUpdateUniversity