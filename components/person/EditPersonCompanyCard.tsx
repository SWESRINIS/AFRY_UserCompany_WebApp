import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useCallback } from "react";
import { CompaniesInterface, PersonInterface } from "../../interface";
import PersonCard from "./PersonCard";

type EditPersonCompanyCardProps = {
  companies: CompaniesInterface;
  person: PersonInterface;
  isUpdateDisabled: boolean;
  changeCompany: (personId: string, companyId: string) => void;
  onUpdate: (personId: string) => void;
};
const EditPersonCompanyCard = ({
  person,
  companies,
  isUpdateDisabled,
  changeCompany,
  onUpdate,
}: EditPersonCompanyCardProps) => {
  const handleonCompanyChange = useCallback(
    (e: SelectChangeEvent) => {
      changeCompany(person.id, e.target.value === "none" ? "" : e.target.value);
    },
    [changeCompany, person.id]
  );

  return (
    <>
      <Grid
        container
        marginTop={"1rem"}
        columnSpacing={3}
        rowSpacing={3}
        alignItems={"center"}
      >
        <Grid item lg={5} xs={12} sm={12} md={5} xl={5}>
          <PersonCard
            showDeleteButton={false}
            data={person}
            removePerson={() => {}}
          />
        </Grid>
        <Grid item lg={5} xs={12} sm={12} md={5} xl={5}>
          {companies !== undefined && Object.keys(companies).length > 0 ? (
            <FormControl fullWidth>
            <InputLabel id="company-label">Company</InputLabel>
            <Select
              labelId="Company"
              id="companyselect"
              value={person.company.id !== "" ? person.company.id : "none"}
              label="Company"
              placeholder="Select Company"
              onChange={handleonCompanyChange}
              fullWidth
              size="medium"
              variant="outlined" 
            >
              {Object.keys(companies).map((company, key) => {
                return (
                  <MenuItem key={key} value={companies[company].id}>
                    {companies[company].name}
                  </MenuItem>
                );
              })}
              {/* <MenuItem value={"none"}>None</MenuItem> */}
            </Select>
            </FormControl>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item lg={2} xs={12} sm={12} md={2} xl={2}>
          <Button
            disabled={isUpdateDisabled}
            onClick={() => onUpdate(person.id)}
            variant="contained"
            color="secondary"
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditPersonCompanyCard;
