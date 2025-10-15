import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getdataMap } from 'src/store/map'
import { useSelector } from 'react-redux'

const myIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconSize: [30, 35]
})

export default function LafletMap() {
  const coordinate = useSelector((state: any) => state.map.coordinate)

  const dispatch = useDispatch()
  const [position, setPosition] = useState<[number, number]>([41.33798463676688, 69.3251512545794])
  const eventHandlers = useMemo(
    () => ({
      dragend(e: any) {
        setPosition([e.target.getLatLng()?.lat, e.target.getLatLng()?.lng])
        dispatch(getdataMap([e.target.getLatLng()?.lat, e.target.getLatLng()?.lng]))
      }
    }),
    []
  )
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        console.log([e.latlng.lat, e.latlng.lng])

        setPosition([e.latlng.lat, e.latlng.lng])
        dispatch(getdataMap([e.latlng.lat, e.latlng.lng]))
      }
    })
    return null
  }

  useEffect(() => {
    if (coordinate?.length > 0) {
      if (coordinate[0] != null && coordinate[1] != null) setPosition([coordinate[0], coordinate[1]])
    }
  }, [coordinate])

  return (
    <MapContainer
      center={position}
      attributionControl={false}
      zoom={5}
      scrollWheelZoom={true}
      style={{ width: '100%', height: 400 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <Marker draggable={true} icon={myIcon} eventHandlers={eventHandlers} position={position}></Marker>
      <MapEvents />
    </MapContainer>
  )
}
