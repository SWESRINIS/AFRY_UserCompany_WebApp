import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import PageAddPerson from "../components/person/PageAddPerson";
import PageAddCompany from "../components/company/PageAddCompany";
import PageEditPersonCompany from "../components/person/PageEditPersonCompany";
import { Grid, Tab, Tabs, Badge, Box, Container, Typography } from "@mui/material";
import { Person, Business, AddBusiness } from "@mui/icons-material";

export default function Home() {
  const [currenSection, setCurrentSection] = useState<0 | 1 | 2>(0);
  const [title, setTitle] = useState<
    "Add User" | "Add Company" | "Link Company"
  >("Add User");

  const handleTileOnSectionChange = useCallback(() => {
    switch (currenSection) {
      case 0:
        setTitle("Add User");
        break;
      case 1:
        setTitle("Add Company");
        break;
      case 2:
        setTitle("Link Company");
        break;
      default:
        return;
    }
  }, [currenSection]);
  useEffect(() => {
    handleTileOnSectionChange();
  }, [handleTileOnSectionChange]);
  return (
    <>
      <Head>
      <Grid container marginTop={"1rem"} rowSpacing={2} columnSpacing={2} justifyContent={"center"}>
        <Grid
          item
          alignContent="center"
        >
          <Typography sx={{ margin: "0.2rem" }} variant={"h1"} fontFamily="initial" fontSize={30} align="center" color="#ab47bc">
            User Company Application
          </Typography>
        </Grid>
      </Grid>
        <title>{title}</title>
      </Head>
      <Grid container marginTop={"2rem"} rowSpacing={3} columnSpacing={3}>
        <Grid
          lg={12}
          md={12}
          xl={12}
          sm={12}
          xs={12}
          item
          alignItems="center"
          justifyContent={"center"}
        >
          <Container>
            <Box sx={{ maxWidth: { xs: 320, sm: 580, md: 900 }}}>
              <Tabs
                value={currenSection}
                aria-label="icon label tabs example"
                variant="fullWidth"
                scrollButtons="auto"
                textColor="secondary"
                indicatorColor="secondary"
                centered
                >
                <Tab icon={<Person />} label="Add User" onClick={() => setCurrentSection(0)} />
                <Tab icon={<AddBusiness />} label="Add Company" onClick={() => setCurrentSection(1)} />
                <Tab icon={<Business  />} label="Link Company" onClick={() => setCurrentSection(2)}/>
              </Tabs>
            </Box>
          </Container>
        </Grid>
        <Grid item lg={12} md={12} xl={12} sm={12} xs={12}>
          <Container>
            <Box sx={{ bgcolor: 'background.default',marginTop: "2rem 0rem" , borderRadius:"2.5rem"}}>
              {currenSection === 0 ? (
                <PageAddPerson
                  changeCurrentSection={() => setCurrentSection(1)}
                />
              ) : (
                <></>
              )}
            </Box>
            <Box sx={{ bgcolor: 'background.default', marginTop: "1rem 0rem", marginBottom:"3rem 0rem", borderRadius:"2.5rem"}}>
              {currenSection === 1 ? <PageAddCompany /> : <></>}
            </Box>
            <Box sx={{ bgcolor: 'background.default' ,marginTop: "1rem 0rem", borderRadius:"2.5rem"}}>
              {currenSection === 2 ? (
                <PageEditPersonCompany
                  changeCurrentSection={() => setCurrentSection(0)}
                />
              ) : (
                <></>
              )}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}
