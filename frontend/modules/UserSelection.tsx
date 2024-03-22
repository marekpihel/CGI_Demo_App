import {ComboBox, ComboBoxFilterChangedEvent} from "@hilla/react-components/ComboBox";
import Movie from "Frontend/generated/com/example/cgi_demo_app/model/Movie";
import User from "Frontend/generated/com/example/cgi_demo_app/model/User";
import React from "react";


export const selectUser = (users: User[],
                           movies: Movie[],
                           setFilteredMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
                           setActiveUserId: React.Dispatch<React.SetStateAction<string>>) => {
    const activeUserChanged = (e: ComboBoxFilterChangedEvent) => {
        let userId = e.detail.value;
        if (userId.length == 0) {
            setFilteredMovies(movies);
        }
        setActiveUserId(userId);
    };

    return (
        <ComboBox
            label="Users"
            itemLabelPath="displayName"
            item-value-path="id"
            style={{textOverflow: "initial"}}
            filteredItems={users}
            onValueChanged={activeUserChanged}
            clearButtonVisible
            renderer={({item: user}) => (
                <div style={{display: 'flex'}}>
                    <div>
                        {user.firstName} {user.lastName}
                        <div hidden id={"activeUserId"}>
                            {user.id}
                        </div>
                    </div>
                </div>
            )}
        />
    );
};