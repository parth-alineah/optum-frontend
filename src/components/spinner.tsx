type Props = {}

const Spinner = ({}: Props) => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <div className='loader--spinner '>
      {bars.map((x: number) => {
        return <div key={x}></div>
      })}
    </div>
  )
}

export default Spinner
