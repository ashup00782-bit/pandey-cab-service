export type ServiceType = 'local_travel' | 'char_dham_yatra' | 'outstation_trip';

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'lost';

export type TripType = 'one_way' | 'round_trip';

export interface Inquiry {
  id: string;
  service_type: ServiceType;
  name: string;
  phone_number: string;
  pickup_location?: string;
  destination?: string;
  travel_date: string;
  message?: string;
  number_of_travelers?: number;
  city?: string;
  special_requirements?: string;
  pickup_city?: string;
  destination_city?: string;
  trip_type?: TripType;
  lead_status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LocalTravelFormData {
  name: string;
  phone_number: string;
  pickup_location: string;
  destination: string;
  travel_date: string;
  message: string;
}

export interface CharDhamFormData {
  name: string;
  phone_number: string;
  number_of_travelers: number;
  travel_date: string;
  city: string;
  special_requirements: string;
}

export interface OutstationFormData {
  name: string;
  phone_number: string;
  pickup_city: string;
  destination_city: string;
  travel_date: string;
  trip_type: TripType;
}
