import type { Employee } from "./commonTypes";
import type { FamilyMember } from "./familiesType";
import type { AllEmployees } from "./getAllEmployeesInfoTypes";

export interface RenderEmployeesProps {
    data : Employee
}
export interface AllEmployeesProps {
    ftchData: AllEmployees
}

export interface FamiliesComponetsProps {
    index: number,
    items: FamilyMember
}