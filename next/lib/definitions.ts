export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
  
  interface Availability {
    days: string;
    from: string;
    to: string;
}

interface IntervenantAvailability {
    default: Availability[];
    [week: string]: Availability[];
}

export type Intervenants = {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    key: string;
    creationdate: string;
    endDate: string;
    availability: string | IntervenantAvailability; // Peut être une chaîne JSON ou l'objet
    workweek: string; // Peut être une chaîne JSON
};

export type IntervenantCreation = {
    email: string;
    firstname: string;
    lastname: string;
    availability: string | IntervenantAvailability; // Peut être une chaîne JSON ou l'objet
};

export type { Availability, IntervenantAvailability };