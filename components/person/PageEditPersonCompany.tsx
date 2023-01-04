import {Button, CircularProgress, Grid, Typography} from "@mui/material";
import { Container } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import {
  useGetAllCompanies,
  useGetAllPersons,
  useUpdateCompanyFromPerson,
} from "../../hooks/useEndpoints";
import { PeopleInterface } from "../../interface";
import EditPersonCompanyCard from "./EditPersonCompanyCard";

type PageEditPersonCompanyProps = {
  changeCurrentSection: () => void;
};
const PageEditPersonCompany = ({
  changeCurrentSection,
}: PageEditPersonCompanyProps) => {
  const [personsData, setPersonsData] = useState<PeopleInterface>(
    {} as PeopleInterface
  );

  const {
    data: Persons,
    isFetching: isPersonsFetching,
    refetch: refetchPersons,
  } = useGetAllPersons();

  const { data: Companies, isFetching: isCompaniesFetching } =
    useGetAllCompanies();

  const { mutateAsync: UpdateCompanyInDb } = useUpdateCompanyFromPerson();

  const handleUpdatePersonCompany = (personId: string, companyId: string) => {
    if (Companies !== undefined) {
      setPersonsData({
        ...personsData,
        [personId]: {
          ...personsData[personId],
          company: {
            id: companyId !== "" ? companyId : "",
            name: companyId !== "" ? Companies[companyId].name : "",
          },
        },
      });
    }
  };

  const updatePersonCompanyCallback = useCallback(
    (personId: string) => {
      UpdateCompanyInDb({
        collectionID: `person`,
        documentID: personId,
        dataField: `company`,
        newData: personsData[personId].company,
      }).then(() => {
        refetchPersons();
        return new Promise((resolve, reject) => {
          if (!isPersonsFetching) return resolve("");
        });
      });
    },
    [UpdateCompanyInDb, isPersonsFetching, personsData, refetchPersons]
  );

  const checkIsTheCompanyChanged = useCallback(
    (personId: string) => {
      if (Persons !== undefined) {
        return (
          personsData[personId].company.id === Persons[personId].company.id
        );
      } else return false;
    },
    [Persons, personsData]
  );

  const inititalizePersonsDataState = useCallback(() => {
    if (Persons !== undefined) {
      setPersonsData(Persons);
    }
  }, [Persons]);

  useEffect(() => {
    inititalizePersonsDataState();
  }, [inititalizePersonsDataState]);
  useEffect(() => {
    refetchPersons();
  }, [refetchPersons]);

  return !isPersonsFetching && !isCompaniesFetching ? (
    <>
      <Grid container>
        <Grid item lg={12} md={12} xl={12} sm={12} xs={12} sx={{ marginBottom: "1rem" }}>
          <Container>
            <Grid container>
              <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                {Persons !== undefined &&
                Companies !== undefined &&
                Object.keys(personsData).length > 0 ? (
                  Object.keys(personsData).map((person, key) => {
                    return (
                      <EditPersonCompanyCard
                        key={key}
                        companies={Companies}
                        changeCompany={handleUpdatePersonCompany}
                        person={personsData[person]}
                        isUpdateDisabled={checkIsTheCompanyChanged(
                          personsData[person].id
                        )}
                        onUpdate={updatePersonCompanyCallback}
                      />
                    );
                  })
                ) : (
                  <Grid container spacing={2} marginTop={"2rem"}>
                    <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                      <Container>
                        <Typography>No People here!!</Typography>
                      </Container>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                      <Container>
                        <Button
                          onClick={changeCurrentSection}
                          variant="contained"
                        >
                          Add Person
                        </Button>
                      </Container>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </>
  ) : (
    <Grid container>
      <Grid
        item
        lg={12}
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

export default PageEditPersonCompany;
