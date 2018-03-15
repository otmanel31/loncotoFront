import { Materiel } from "./Materiel";
import { Intervenant } from "./intervenant";

export class Intervention {
    constructor(public id: number,
                public singleInterventionNumber: string,
                public interventionDate: Date,
                public dateOfCompletion: Date,
                public status: string,
                public comment: string,
                public equipment: Materiel,
                public intervenant: Intervenant
    ){};
}