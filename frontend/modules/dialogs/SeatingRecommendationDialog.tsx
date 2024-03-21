import React from "react";
import {Dialog} from "@hilla/react-components/Dialog";
import {Button} from "@hilla/react-components/Button";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {SeatingEndpoint} from "Frontend/generated/endpoints";
import {Notification} from "@hilla/react-components/Notification";

const screenStyle = {
    width: "100%",
    marginRight: "auto",
    marginLeft: "auto",
    height: "128px"
};

const projectorStyle = {
    width: "auto",
    marginRight: "auto",
    marginLeft: "auto",
    height: "48px"
};
let hasSeating = false;

export const seatingRecommendationDialog = (
        seating: Array<Array<number>>,
        selectedMovieName: string,
        selectedDate: string,
        selectedSession: string,
        selectedMovieLanguage: string,
        ticketAmount: string,
        seatingDialogOpened: boolean,
        setTicketDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
        setSeatingDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
        setSelectedMovieName: React.Dispatch<React.SetStateAction<string>>,
        setSelectedDate: React.Dispatch<React.SetStateAction<string>>,
        setSelectedSession: React.Dispatch<React.SetStateAction<string>>,
        setTicketAmount: React.Dispatch<React.SetStateAction<string>>,
        setSeating: React.Dispatch<React.SetStateAction<Array<Array<number>>>>
    ) => {
    let confirmedSeats: Array<Array<number>> = [];


    async function getSeatingFromServer(){
        let movieInformation = selectedMovieName + "," +
                                        selectedDate + "," +
                                        selectedSession + "," +
                                        selectedMovieLanguage;
        const serverResponse = await SeatingEndpoint.getSeating(movieInformation);

        const seating = (serverResponse ?? []).map(row => row?.filter(seat => seat != undefined) as number[]);

        setSeating(seating);
        hasSeating = true;
    }

    function checkIfHasEnoughFreeSeats(currentPoint: number[]) {
        let suitableSpots = true;
        for (let i = 0; i < parseInt(ticketAmount); i++) {
            if (seating?.[currentPoint[0]]?.[currentPoint[1] + i] !== undefined) {
                if (seating[currentPoint[0]][currentPoint[1] + i] !== 0) {
                    suitableSpots = false; // Set to false if a spot is taken
                    break; // Break out of the loop
                }
            } else {
                suitableSpots = false; // Set to false if a spot is out of bounds
                break; // Break out of the loop
            }
        }
        return suitableSpots;
    }

    function addAdjacentSeatingToCheck(currentPoint: number[], rowMidpoint: number, pointsToCheck: any[], beenPoints: any[], columnMidpoint: number) {
        for (let i = -1; i < 2; i++) {
            if (
                currentPoint[0] + i >= 0 &&
                currentPoint[0] + i < rowMidpoint &&
                !pointsToCheck.some(point => point[0] === currentPoint[0] + i && point[1] === currentPoint[1]) &&
                !beenPoints.some(point => point[0] === currentPoint[0] + i && point[1] === currentPoint[1])
            ) {
                pointsToCheck.push([currentPoint[0] + i, currentPoint[1]]);
            }
        }

        for (let i = -1; i < 2; i++) {
            if (
                currentPoint[1] + i >= 0 &&
                currentPoint[1] + i < columnMidpoint &&
                !pointsToCheck.some(point => point[0] === currentPoint[0] && point[1] === currentPoint[1] + i) &&
                !beenPoints.some(point => point[0] === currentPoint[0] && point[1] === currentPoint[1] + i)
            ) {
                pointsToCheck.push([currentPoint[0], currentPoint[1] + i]);
            }
        }
    }

    function insertRecommendationSeatsIntoSeating(){
        if(!seatingDialogOpened){
            return;
        }
        let middlePoint = [seating?.length, seating?.[0]?.length];
        const rowMidpoint = middlePoint?.[0] ?? 0;
        const columnMidpoint = middlePoint?.[1] ?? 0;
        let pointsToCheck = [];
        let beenPoints = [];
        let currentPoint = [Math.floor(rowMidpoint / 2), Math.floor((columnMidpoint - 1) / 2)];
        let freeSeats: number[][] = [];

        pointsToCheck.push(currentPoint);
        beenPoints.push(currentPoint)
        let sideBySideSeatingAvailable = false;


        while(pointsToCheck.length != 0){
            if (pointsToCheck.length === 0) {
                break; // Break the loop if pointsToCheck is empty
            }

            currentPoint = pointsToCheck.shift() ?? [];
            // Check neighboring points
            addAdjacentSeatingToCheck(currentPoint, rowMidpoint, pointsToCheck, beenPoints, columnMidpoint);

            if(seating?.[currentPoint[0]]?.[currentPoint[1]] !== undefined &&
                seating?.[currentPoint[0]]?.[currentPoint[1]] == 0 &&
                !freeSeats.some(point => point[0] === currentPoint[0] && point[1] === currentPoint[1])){
                freeSeats.push(currentPoint);
            }

            if(checkIfHasEnoughFreeSeats(currentPoint)){
                for (let i = 0; i < parseInt(ticketAmount); i++) {
                    if (seating?.[currentPoint[0]]?.[currentPoint[1] + i] !== undefined) {
                        seating[currentPoint[0]][currentPoint[1] + i] = 2;
                        confirmedSeats.push([currentPoint[0], currentPoint[1] + i]);
                    }
                }
                sideBySideSeatingAvailable = true;
                break;
            }
            beenPoints.push(currentPoint);
        }

        if(sideBySideSeatingAvailable){
            return;
        }
        if(!sideBySideSeatingAvailable && freeSeats.length >= parseInt(ticketAmount)){
            let freeSeat: [number, number] | any[] = [];
            for (let seat = 0; seat < parseInt(ticketAmount); seat++) {
                freeSeat = freeSeats.shift() ?? [];
                seating[freeSeat[0]][freeSeat[1]] = 2;
                confirmedSeats.push(freeSeat);
            }
            return;
        } else {
            Notification.show("There aren't enough seats available.", {
                theme: 'warning',
            });
            handleSeatingCancel();
        }
    }

    const handleSeatingConfirm = () => {
        SeatingEndpoint.addSeatsToSeating(confirmedSeats,
            selectedMovieName + "," +
            selectedDate + "," +
            selectedSession + "," +
            selectedMovieLanguage);

        confirmedSeats = [];
        hasSeating = false;
        setSeatingDialogOpened(false);
        setTicketDialogOpened(false);
        setSelectedMovieName("");
        setSelectedDate("");
        setSelectedSession("");
        setTicketAmount("1");
    };

    function removeRecommendedSeating() {
        for (let row = 0; row < seating.length; row++) {
            for (let column = 0; column < seating[row].length; column++) {
                if(seating[row][column] == 2){
                    seating[row][column] = 0;
                }
            }            
        }
    }

    const handleSeatingCancel = () => {
        hasSeating = false;
        confirmedSeats = [];
        removeRecommendedSeating();
        setSeatingDialogOpened(false);
        setTicketDialogOpened(false);
        setSelectedMovieName("");
        setSelectedDate("");
        setSelectedSession("");
        setTicketAmount("");
    };

    const SeatDetail = ({ seat } : {seat: number}) => {
        const seatStyle = {
            width: "48px",
            height: "48px"
        };

        if(seat === 0){
            return <img src="/pictures/cinema_icons/seat_empty.png"
                        data-row="${row}"
                        data-column="$column"
                        style={seatStyle}
                        alt="Displays an image of empty seating for the purpose of showing empty seats"/>;
        } else if (seat == 1){
            return <img src="/pictures/cinema_icons/seat_taken.png"
                        style={seatStyle}
                        alt="Displays an image of taken seating for the purpose of displaying taken seats to user"/>
        } else {
            return <img src="/pictures/cinema_icons/seat_recommended.png"
                        data-row="${row}"
                        data-column="$column"
                        style={seatStyle}
                        alt="Displays an image of recommended seating for the purpose of
                        displaying recommended seats to user"/>;
        }
    };

    if(seatingDialogOpened && !hasSeating){
        getSeatingFromServer();
    }
    if(hasSeating){
        removeRecommendedSeating();
        insertRecommendationSeatsIntoSeating();
    }

    return (
        <>
            <Dialog
                headerTitle="Seating window"
                opened={seatingDialogOpened}
                onOpenedChanged={({ detail }) => {
                    setSeatingDialogOpened(detail.value);
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={handleSeatingCancel}>Cancel</Button>
                        <Button theme="primary" onClick={handleSeatingConfirm}>
                            Confirm
                        </Button>
                    </>
                )}
                style={{width: "500px", height: "fit-content", blockSize: "fit-content"}}
            >
                <VerticalLayout style={{width: "auto", height: "auto"}}>
                    <img src="/pictures/cinema_icons/projector.png"
                         style={projectorStyle}
                         alt="Displays image of a projector in the seating dialog to give user idea of what way the
                         cinema layout is in regards to the chairs."/>
                    {seating?.map((row) => (
                        <HorizontalLayout>
                            {row.map((seat) => (
                                <SeatDetail seat={seat}/>
                            ))}
                        </HorizontalLayout>
                    ))}
                    <img src="/pictures/cinema_icons/screen.png"
                         style={screenStyle}
                         alt="Displays a screen icon in the seating dialog to give the user idea on where the screen is
                          in relation to the chairs overlay"/>

                </VerticalLayout>
            </Dialog>
        </>
    );
};