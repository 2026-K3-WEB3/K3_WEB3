import { Admin, Resource } from 'react-admin'
import { dataProvider } from '@/lib/ra-data-provider'
import { authProvider } from '@/lib/ra-auth-provider'

import { EventList, EventShow, EventCreate, EventEdit } from './EventResources'
import { SessionList, SessionShow, SessionCreate, SessionEdit } from './SessionResources'
import { SpeakerList, SpeakerShow, SpeakerCreate, SpeakerEdit } from './SpeakerResources'
import { RoomList, RoomShow, RoomCreate, RoomEdit } from './RoomResources'

export default function AdminApp() {
  return (
    <Admin
      basename="/ra-admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
    >
      <Resource
        name="events"
        list={EventList}
        show={EventShow}
        create={EventCreate}
        edit={EventEdit}
        options={{ label: 'Événements' }}
      />
      <Resource
        name="sessions"
        list={SessionList}
        show={SessionShow}
        create={SessionCreate}
        edit={SessionEdit}
        options={{ label: 'Sessions' }}
      />
      <Resource
        name="speakers"
        list={SpeakerList}
        show={SpeakerShow}
        create={SpeakerCreate}
        edit={SpeakerEdit}
        options={{ label: 'Intervenants' }}
      />
      <Resource
        name="rooms"
        list={RoomList}
        show={RoomShow}
        create={RoomCreate}
        edit={RoomEdit}
        options={{ label: 'Salles' }}
      />
    </Admin>
  )
}
