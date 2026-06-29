import {
  List, Datagrid, TextField, DateField, NumberField,
  Create, Edit, SimpleForm, TextInput, DateTimeInput, NumberInput,
  required, EditButton, DeleteButton, Show, SimpleShowLayout,
} from 'react-admin'

export const EventList = () => (
  <List sort={{ field: 'startDate', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const EventShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" label="Titre" />
      <TextField source="description" label="Description" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
    </SimpleShowLayout>
  </Show>
)

const EventForm = () => (
  <SimpleForm>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={4} validate={required()} fullWidth />
    <TextInput source="location" label="Lieu" validate={required()} fullWidth />
    <DateTimeInput source="startDate" label="Date de début" validate={required()} />
    <DateTimeInput source="endDate" label="Date de fin" validate={required()} />
  </SimpleForm>
)

export const EventCreate = () => (
  <Create>
    <EventForm />
  </Create>
)

export const EventEdit = () => (
  <Edit>
    <EventForm />
  </Edit>
)
