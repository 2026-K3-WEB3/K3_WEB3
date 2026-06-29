import {
  List, Datagrid, TextField,
  Create, Edit, SimpleForm, TextInput,
  required, EditButton, DeleteButton, Show, SimpleShowLayout,
} from 'react-admin'

export const SpeakerList = () => (
  <List sort={{ field: 'name', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="name" label="Nom" />
      <TextField source="bio" label="Biographie" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const SpeakerShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" label="Nom" />
      <TextField source="photo" label="Photo URL" />
      <TextField source="bio" label="Biographie" />
    </SimpleShowLayout>
  </Show>
)

const SpeakerForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom" validate={required()} fullWidth />
    <TextInput source="photo" label="Photo URL" fullWidth />
    <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
  </SimpleForm>
)

export const SpeakerCreate = () => (
  <Create>
    <SpeakerForm />
  </Create>
)

export const SpeakerEdit = () => (
  <Edit>
    <SpeakerForm />
  </Edit>
)
