import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'
import { VITE_MAP_KEY } from '@/utils/envVariables'

const containerStyle = {
  width: '100%',
  height: '100%',
}
interface Location {
  lat: number
  lng: number
}

interface Props {
  locations: Location[]
}

const GoogleMapComponent = ({ locations }: Props) => {
  const center = locations?.length > 0 ? locations[0] : { lat: 0, lng: 0 }

  return (
    <LoadScript googleMapsApiKey={VITE_MAP_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {locations?.map((location, index) => <MarkerF key={index} position={location} />)}
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapComponent
