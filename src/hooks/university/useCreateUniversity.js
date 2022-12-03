import { useLazyAxios } from 'use-axios-client'

const useCreateUniversity = (payload) => {
  const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university`

  return useLazyAxios({
    url: API,
    method: 'POST',
    data: payload,
  })
}

export default useCreateUniversity