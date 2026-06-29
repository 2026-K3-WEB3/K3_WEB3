import {
  List, Datagrid, TextField, DateField, NumberField, ReferenceField,
  Create, Edit, SimpleForm, TextInput, DateTimeInput, NumberInput,
  ReferenceInput, SelectInput, required, EditButton, DeleteButton, Show, SimpleShowLayout,
} from 'react-admin'

export const SessionList = () => (
  <List sort={{ field: 'startTime', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="title" label="Titre" />
      <ReferenceField source="eventId" reference="events" label="Événement">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="roomId" reference="rooms" label="Salle">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startTime" label="Début" showTime />
      <DateField source="endTime" label="Fin" showTime />
      <NumberField source="capacity" label="Capacité" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)

export const SessionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="title" label="Titre" />
      <TextField source="description" label="Description" />
      <ReferenceField source="eventId" reference="events" label="Événement">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="roomId" reference="rooms" label="Salle">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startTime" label="Début" showTime />
      <DateField source="endTime" label="Fin" showTime />
      <NumberField source="capacity" label="Capacité" />
    </SimpleShowLayout>
  </Show>
)

const SessionForm = () => (
  <SimpleForm>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={4} fullWidth />
    <ReferenceInput source="eventId" reference="events" label="Événement">
      <SelectInput optionText="title" validate={required()} fullWidth />
    </ReferenceInput>
    <ReferenceInput source="roomId" reference="rooms" label="Salle">
      <SelectInput optionText="name" validate={required()} fullWidth />
    </ReferenceInput>
    <DateTimeInput source="startTime" label="Date de début" validate={required()} />
    <DateTimeInput source="endTime" label="Date de fin" validate={required()} />
    <NumberInput source="capacity" label="Capacité" />
  </SimpleForm>
)

export const SessionCreate = () => (
  <Create>
    <SessionForm />
  </Create>
)

export const SessionEdit = () => (
  <Edit>
    <SessionForm />
  </Edit>
)
