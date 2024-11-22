import type  { FamilyMember } from "./familiesType";

export interface AllEmployees {
    id?: string; 
    firstName: string;
    lastName: string; 
    email: string; 
    dateOfBirth: string; 
    family: FamilyMember[];
  }