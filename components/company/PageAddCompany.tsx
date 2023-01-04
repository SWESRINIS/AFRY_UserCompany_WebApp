import { uuidv4 } from "@firebase/util";
import {
  Box,
  Button,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import {
  useCreateCompany,
  useDeleteCompany,
  useGetAllCompanies,
  useGetPersonsFromCompany,
  useUnlinkCompanyFromPerson,
} from "../../hooks/useEndpoints";

import { CompanyInterface, PersonInterface } from "../../interface";
import PersonCard from "../person/PersonCard";

const PageAddCompany = () => {
  const [company, setCompany] = useState<CompanyInterface>({
    id: uuidv4(),
    name: "",
  });
  const [selectedCompany, setSelectedCompany] = useState<string>("none");

  const {
    data: Companies,
    isFetching: isCompaniesFetching,
    refetch: refetchCompanies,
  } = useGetAllCompanies();

  const {
    data: personsFromCompany,
    isFetching: isPersonsFromCompanyFetching,
    refetch: refetchPersonsFromCompany,
  } = useGetPersonsFromCompany(selectedCompany);

  const { mutateAsync: CreateCompanyMutation } = useCreateCompany();
  const { mutateAsync: RemovePersonFromCompany } = useUnlinkCompanyFromPerson();
  const { mutateAsync: DeleteCompany } = useDeleteCompany();

  const handleonClickCreateCompany = useCallback(() => {
    CreateCompanyMutation({
      collectionID: `company`,
      documentID: `companies`,
      dataField: company.id,
      newData: company,
    }).then(() => {
      setCompany({
        id: uuidv4(),
        name: "",
      });
      refetchCompanies();
    });
  }, [CreateCompanyMutation, company, refetchCompanies]);

  const handleonCompanyChange = useCallback(
    (e: SelectChangeEvent) => {
      if (Companies !== undefined && e.target.value !== "none") {
        setSelectedCompany(Companies[e.target.value].id);
      } else {
        setSelectedCompany("none");
      }
    },
    [Companies]
  );

  const handleonClickRemovePerson = useCallback(
    (id: string) => {
      return RemovePersonFromCompany({
        collectionID: `person`,
        documentID: id,
        dataField: `company.id`,
        newData: "",
      })
        .then(() => {
          return RemovePersonFromCompany({
            collectionID: `person`,
            documentID: id,
            dataField: `company.name`,
            newData: "",
          });
        })
        .then(() => {
          refetchPersonsFromCompany();
          return new Promise((resolve, rej) => {
            resolve("");
          });
        });
    },
    [RemovePersonFromCompany, refetchPersonsFromCompany]
  );

  const handleonClickDeleteCompany = useCallback(() => {
    if (personsFromCompany !== undefined) {
      const promises = personsFromCompany.map((person) =>
        handleonClickRemovePerson(person.id)
      );
      return Promise.all(promises).then(() => {
        return DeleteCompany({
          collectionID: `company`,
          documentID: `companies`,
          dataField: selectedCompany,
          newData: "",
        }).then(() => {
          refetchCompanies();
          setSelectedCompany("none");
          return new Promise((resolve, rej) => {
            resolve("");
          });
        });
      });
    }
  }, [
    DeleteCompany,
    handleonClickRemovePerson,
    refetchCompanies,
    personsFromCompany,
    selectedCompany,
  ]);

  return (
    <>
      <Grid container columnSpacing={2}>
        <Grid item lg={4} md={4} xl={4} sm={12} xs={12}>
          <Container maxWidth="lg">
            <Grid container>
              <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                <Container>
                  <Stack spacing={5}>
                  <CardContent>
                  <Typography sx={{  marginTop: "2 rem" }} variant="button" fontSize={18} fontStyle="-moz-initial">Create Company</Typography>
                  </CardContent>
                  </Stack>
                  </Container>
              </Grid>
              <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                <Container>
                  <TextField
                    id="companynameTI"
                    label="Company Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={company.name}
                    inputProps={{ maxLength: 12 }}
                    helperText={"Enter the company's name (Max 12 characters)"}
                    size ="small"
                    onChange={(e) =>
                      setCompany({
                        ...company,
                        name: e.currentTarget.value.toString(),
                      })
                    }
                  />
                </Container>
              </Grid>
              <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                <Container>
                  <Button
                    sx={{ marginTop: "1.5rem" }}
                    variant="contained"
                    onClick={handleonClickCreateCompany}
                    disabled={company.name === ""}
                    color="secondary"
                  >
                    Create Company
                  </Button>
                </Container>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid
          borderLeft={"2px solid black"}
          item
          lg={8}
          md={8}
          xl={8}
          sm={12}
          xs={12}
        >
          <Container>
            <Grid container columnSpacing={3} rowSpacing={3}>
              <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                <Container>
                  <Box>
                  <Stack spacing={5}>
                  <CardContent>
                    <Typography sx={{ marginBottom: "1rem" }} variant="button" fontSize={18}>
                      List of Companies
                    </Typography>
                    </CardContent>
                    </Stack>
                    {isCompaniesFetching ? (
                      <Skeleton variant="rectangular" width={210} height={60} />
                    ) : Companies !== undefined &&
                      Object.keys(Companies).length > 0 ? (
                        <FormControl sx={{ marginTop: "1rem" }} fullWidth>
                        <InputLabel id="company-label">Company</InputLabel> 
                      <Select
                        labelId="company"
                        id="companyselect"
                        value={selectedCompany}
                        label="Company"
                        placeholder="Select Company"
                        size="small"
                        onChange={handleonCompanyChange}
                        fullWidth
                      >
                        {Object.keys(Companies).map((company, key) => {
                          return (
                            <MenuItem key={key} value={Companies[company].id}>
                              {Companies[company].name}
                            </MenuItem>
                          );
                        })}
                        {/* <MenuItem value={"none"}>None</MenuItem> */}
                      </Select>
                      </FormControl>
                    ) : (
                      <Typography sx={{ margin: "1rem 0rem" }} variant={"subtitle1"} fontFamily="initial" fontSize={18}>
                        No Companies exists! Create one!
                      </Typography>
                    )}
                    <Button
                      sx={{ marginTop: "3rem" }}
                      variant="contained"
                      color="error"
                      onClick={handleonClickDeleteCompany}
                      disabled={selectedCompany === "none"}
                    >
                      Delete Company
                    </Button>
                  </Box>
                </Container>
              </Grid>

              <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
                <Container>
                  <Box>
                
                  <Typography sx={{ marginBottom: "1rem" }} variant="button" fontSize={16}>
                      {`People linked with ${
                        Companies !== undefined && selectedCompany !== "none"
                          ? Companies[selectedCompany].name
                          : "Company"
                      }`}
                    </Typography>
                    
                    {isPersonsFromCompanyFetching ? (
                      <Skeleton variant="rectangular" width={210} height={60} />
                    ) : personsFromCompany !== undefined &&
                      personsFromCompany.length > 0 ? (
                      <>
                        <Grid container rowSpacing={3}>
                          {personsFromCompany.map(
                            (person: PersonInterface, key) => {
                              return (
                                <Grid
                                  key={key}
                                  item
                                  xs={12}
                                  sm={12}
                                  md={5}
                                  xl={5}
                                  lg={12}
                                >
                                  <PersonCard
                                    data={person}
                                    showDeleteButton={true}
                                    removePerson={handleonClickRemovePerson}
                                    
                                  />
                                </Grid>
                              );
                            }
                          )}
                        </Grid>
                      </>
                    ) : (
                      <Typography sx={{ margin: "1rem 0rem" }} variant={"subtitle1"} fontFamily="initial" fontSize={18}>No Person Present!</Typography>
                    )}
                   
                  </Box>
                </Container>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default PageAddCompany;
