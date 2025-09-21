// Stage One: The domain model (Data requirements.  All required fields.)

// data model when sending a request to create or update a contact
export interface ContactRequest {
  name: string; // 512 characters
  contactPoint: string; // Email, Phone, Text, Letters, Face2Face
  notes?: string; // 1024 characters
  reminderDate: string;
  reminderTime: string;
}

// data model stored in the system
export interface Contact extends ContactRequest {
  id: string; // UUID
  dateCreated: string;
}
