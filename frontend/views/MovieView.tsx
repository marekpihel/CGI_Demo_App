import { Button } from "@hilla/react-components/Button.js";
import { Notification } from "@hilla/react-components/Notification.js";
import { TextField } from "@hilla/react-components/TextField.js";
import { HelloEndpoint, MoviesEndpoint } from "Frontend/generated/endpoints.js";
import { useState } from "react";

export default function MainView() {
    const [movie, addMovie] = useState("");

    return (
        <>
            <div id="MainBox">
                <TextField
                    label="Add movie"
                    onValueChanged={(e) => {
                        addMovie(e.detail.value);
                    }}
                />
                <Button
                    onClick={async () => {
                        const serverResponse = await MoviesEndpoint.addMovie(movie);
                        Notification.show(serverResponse);
                    }}
                 >
                    Add Movie
                </Button>
                <Button
                    onClick={async () => {
                        const serverResponse = await MoviesEndpoint.getMovies();
                        Notification.show(serverResponse);
                    }}
                >
                    Get Movies
                </Button>
            </div>
        </>
    );
}
