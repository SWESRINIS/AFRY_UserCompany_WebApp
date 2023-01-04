import { useMutation, useQuery } from "react-query";
import {
  get,
  getMany,
  getWithQueries,
  post,
  put,
  removeField,
} from "../api/firebase-api-client";
import {
  CompaniesInterface,
  PeopleInterface,
  PersonInterface,
} from "../interface";

export const useGetAllPersons = () =>
  useQuery(["getAllPesons", "all persons list"], () => {
    return getMany<PersonInterface>(`person`).then((persons) => {
      return persons.reduce(
        (accumulator: { [key: string]: PersonInterface }, key) => {
          accumulator[key.id] = key;
          return accumulator;
        },
        {} as PeopleInterface
      );
    });
  });

export const useGetAllCompanies = () =>
  useQuery(["getCompanies", "companies list"], () =>
    get<CompaniesInterface>(`company`, `companies`)
  );

export const useGetPersonsFromCompany = (companyId: string) =>
  useQuery(
    ["getPersonFromCompany", companyId],
    () =>
      getWithQueries<PersonInterface>(`person`, {
        field: "company.id",
        on: companyId,
        op: "==",
      }),
    {
      enabled: companyId !== "none",
    }
  );

export const useCreatePerson = () => useMutation(post);
export const useCreateCompany = () => useMutation(put);
export const useUnlinkCompanyFromPerson = () => useMutation(put);
export const useDeleteCompany = () => useMutation(removeField);
export const useUpdateCompanyFromPerson = () => useMutation(put);
