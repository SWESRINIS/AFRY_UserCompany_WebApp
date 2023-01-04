import { WhereFilterOp } from "firebase/firestore";

export interface PersonInterface {
  id: string;
  name: string;
  company: CompanyInterface;
}

export interface CompanyInterface {
  id: string;
  name: string;
}

export interface CompaniesInterface {
  [id: string]: CompanyInterface;
}

export interface PeopleInterface {
  [id: string]: PersonInterface;
}


// api-client 
export type Condition = {
  field: string;
  op: WhereFilterOp;
  on: string | number | boolean;
};
export type Conditions = Array<Condition>;

export interface ModifyingDataInDB {
  collectionID: string;
  documentID: string;
  dataField?: string;
  newData: any;
}

export type PostOrPut = (args: ModifyingDataInDB) => Promise<void>;
export type Remove = (args: ModifyingDataInDB) => Promise<any>;