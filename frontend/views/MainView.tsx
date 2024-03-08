import { Button } from "@hilla/react-components/Button.js";
import { Notification } from "@hilla/react-components/Notification.js";
import { TextField } from "@hilla/react-components/TextField.js";
import { HelloEndpoint, MoviesEndpoint } from "Frontend/generated/endpoints.js";
import { useState } from "react";

export default function MainView() {
  const [name, setName] = useState("");


  return (
    <>
      <TextField
        label="Your name"
        onValueChanged={(e) => {
          setName(e.detail.value);
        }}
      />
      <Button
        onClick={async () => {
          const serverResponse = await HelloEndpoint.sayHello(name);
          Notification.show(serverResponse);
        }}
      >
        Say hello
      </Button>
        <TextField
            label="Add movie"
            onValueChanged={(e) => {
                setMovie(e.detail.value);
            }}
        />
        <Button
        onClick={async () => {
            const serverResponse = await MoviesEndpoint.getMovies();
            console.log(serverResponse);
            Notification.show(serverResponse);
        }}
    >
        Get Movies
    </Button>
    </>
  );
}
