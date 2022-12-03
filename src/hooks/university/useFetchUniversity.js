import { useLazyAxios } from 'use-axios-client'

const useFetchUniversity = () => {
  const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university`

  return useLazyAxios({
    url: API,
  })
}

export default useFetchUniversity