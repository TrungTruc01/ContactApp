export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  avatar?: string;
}

export type RootStackParamList = {
  Home: undefined;
  Details: { contact: Contact };
  Add: undefined;
  Edit: { contact: Contact };
  Settings: undefined;
  EditPersonal: undefined;
};

export type SortOrder = 'asc' | 'desc'; 