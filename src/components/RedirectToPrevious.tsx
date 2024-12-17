import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
type Props = {
  path?: string
}
const RedirectToPrevious = ({ path }: Props) => {
  const history = useNavigate()
  useEffect(() => {
    if (path) {
      history(path)
    } else {
      history(-1)
    }
  }, [])
  return null
}
export default RedirectToPrevious
