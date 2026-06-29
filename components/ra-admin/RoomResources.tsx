import {
  List, Datagrid, TextField,
  Create, Edit, SimpleForm, TextInput,
  required, EditButton, DeleteButton, Show, SimpleShowLayout,
} from 'react-admin'

export const RoomList = () => (
  <List sort={{ field: 'name', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="name" label="Nom de la salle" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const RoomShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" label="Nom de la salle" />
    </SimpleShowLayout>
  </Show>
)

const RoomForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom de la salle" validate={required()} fullWidth />
  </SimpleForm>
)

export const RoomCreate = () => (
  <Create>
    <RoomForm />
  </Create>
)

export const RoomEdit = () => (
  <Edit>
    <RoomForm />
  </Edit>
)
