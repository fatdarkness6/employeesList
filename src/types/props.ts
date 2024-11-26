import type { Employee } from "./commonTypes";
import type { AllEmployees } from "./getAllEmployeesInfoTypes";

export interface RenderEmployeesProps {
    data : Employee
}
export interface AllEmployeesProps {
    ftchData: AllEmployees
}