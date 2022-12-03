import { useLazyAxios } from 'use-axios-client'

const useFetchDetailUniversity = (id) => {
  const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university/${id}`

  return useLazyAxios({
    url: API,
  })
}

export default useFetchDetailUniversity