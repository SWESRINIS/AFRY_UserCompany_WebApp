import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useCreatePerson, useGetAllCompanies } from "../../hooks/useEndpoints";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { PersonInterface } from "../../interface";
import { uuidv4 } from "@firebase/util";
import { Stack } from "@mui/system";

type PageAddPersonProps = {
  changeCurrentSection: () => void;
};

const PageAddPerson = ({ changeCurrentSection }: PageAddPersonProps) => {
  const [person, setPerson] = useState<PersonInterface>({
    name: "",
    id: uuidv4(),
    company: {
      id: "",
      name: "",
    },
  });
  const [selectedCompany, setSelectedCompany] = useState<string>("none");

  const { data: Companies, isFetching: isCompaniesFetching } =
    useGetAllCompanies();
  const { mutateAsync: CreatePersonMutation } = useCreatePerson();

  const handleonCompanyChange = useCallback(
    (e: SelectChangeEvent) => {
      setSelectedCompany(e.target.value);
      if (Companies !== undefined && e.target.value !== "none") {
        setPerson({
          ...person,
          company: {
            id: e.target.value,
            name: Companies[e.target.value].name,
          },
        });
      }
    },
    [Companies, person]
  );

  const handleonClickCreatePerson = () => {
    return CreatePersonMutation({
      collectionID: "person",
      documentID: person.id,
      newData: person,
    }).then(() => {
      setPerson({
        name: "",
        id: uuidv4(),
        company: {
          id: "",
          name: "",
        },
      });
      setSelectedCompany("none");
    });
  };

  return (
    <>
      <Grid container columnSpacing={4} rowSpacing={2} maxHeight="1000px">
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Box>
          <Container>
            <TextField
              id="nameTI"
              label="Name *"
              variant="outlined"
              value={person.name}
              disabled={
                Companies !== undefined && Object.keys(Companies).length === 0
              }
              fullWidth
              size="small"
              inputProps={{ maxLength: 12 }}
              InputLabelProps={{
                sx: {
                  color: "grey"
                 
                }
              }}
              helperText={"Enter the user's name (Max 12 characters)"}

              onChange={(e) =>
                setPerson({ ...person, name: e.currentTarget.value.toString() })
              }
            />
          </Container>
          </Box>
        </Grid>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12} maxHeight="100px">
          <Container>
            <Box>
            {isCompaniesFetching ? (
              <Skeleton variant="rectangular" width={210} height={60} />
            ) : Companies !== undefined && Object.keys(Companies).length > 0 ? (
              <FormControl fullWidth>
                <InputLabel id="company-label">Company</InputLabel>
                <Select
                  labelId="company"
                  id="companyselect"
                  value={selectedCompany}
                  label="Company"
                  placeholder= "Select Company"
                  fullWidth
                  size="small"
                  
                  onChange={handleonCompanyChange}
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
                <FormHelperText>Select to associate the user and the company</FormHelperText>
              </FormControl>
              
              
            ) : (
              <Box>
                <Typography sx={{ margin: "1rem 0rem" }} variant={"subtitle1"} fontFamily="initial" fontSize={18}>
                  No Company Exists! Create one!
                </Typography>
                <Button color="secondary" onClick={changeCurrentSection} variant="contained">
                  Add Company
                </Button>
              </Box>
              
            )}
            </Box>
          </Container>
        </Grid> 
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <Container>
            <Box sx={{width: '100%',margin:"1rem 0rem"}}>
            <Button 
              disabled={
                (Companies !== undefined &&
                  Object.keys(Companies).length === 0) ||
                person.name.length <= 0
              }
              onClick={handleonClickCreatePerson}
              variant="contained"
              color="secondary"
            >
              Create Person
            </Button>
            </Box>
            <Stack spacing={5}></Stack>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default PageAddPerson;
