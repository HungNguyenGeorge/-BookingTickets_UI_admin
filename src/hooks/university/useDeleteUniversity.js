import { useLazyAxios } from 'use-axios-client'

const useDeleteUniversity = (id) => {
  const API = `${process.env.REACT_APP_API_ENDPOINT_UNIVERSITY}/university/${id}`

  return useLazyAxios({
    url: API,
    method: 'DELETE',
  })
}

export default useDeleteUniversity