import { Avatar, Button, Card, CardHeader, Grid } from "@mui/material";
import React from "react";
import { PersonInterface } from "../../interface";

type PersonCardProps = {
  data: PersonInterface;
  showDeleteButton: boolean;
  removePerson: (id: string) => void;
};

const PersonCard = ({
  data,
  showDeleteButton,
  removePerson,
}: PersonCardProps) => {
  return (
    <>
      <Grid container columnSpacing={3} rowSpacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={20} xl={12}>
          <Card
            sx={{
              alignItems: "flex-start",
              boxSizing:"border-box",
              blockSize:"70px"
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "purple" }} aria-label="recipe">
                  {data.name[0].toUpperCase()}
                </Avatar>
              }
              title={data.name.toUpperCase()}
              action={
                showDeleteButton ? (
                  <Button
                    onClick={() => removePerson(data.id)}
                    color="inherit"
                    variant="contained"
                    
                  
                  >
                    Unlink
                  </Button>
                ) : (
                  <></>
                )
              }
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(PersonCard);
