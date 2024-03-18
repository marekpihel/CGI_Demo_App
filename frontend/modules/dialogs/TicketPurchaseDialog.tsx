import React from "react";
import {Dialog} from "@hilla/react-components/Dialog";
import {Button} from "@hilla/react-components/Button";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {IntegerField} from "@hilla/react-components/IntegerField";
import {NumberFieldChangeEvent} from "@hilla/react-components/NumberField";


export const ticketPurchaseDialog = (
    ticketDialogOpened: boolean,
    selectedMovieName: string,
    selectedDate: string,
    selectedSession: string,
    selectedMovieLanguage: string,
    ticketAmount: string,
    setTicketDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setSeatingDialogOpened: React.Dispatch<React.SetStateAction<boolean>>,
    setTicketAmount: React.Dispatch<React.SetStateAction<string>>
    ) => {

    const handleTicketPurchase = () => {
        setSeatingDialogOpened(true);
        setTicketDialogOpened(false);
    };

    const handleTicketAmountChanged  = (e: NumberFieldChangeEvent) => {
        const purchasableTicketAmount = e.target.value;
        setTicketAmount(purchasableTicketAmount);
    };

    return (
        <>
            <Dialog
                headerTitle="Purchase window"
                opened={ticketDialogOpened}
                onOpenedChanged={({ detail }) => {
                    setTicketDialogOpened(detail.value);
                }}
                footerRenderer={() => (
                    <>
                        <Button onClick={() => setTicketDialogOpened(false)}>Cancel</Button>
                        <Button theme="primary" onClick={handleTicketPurchase}>
                            Purchase
                        </Button>
                    </>
                )}
            >
                <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
                    <div>Movie name: {selectedMovieName}</div>
                    <div>Movie language: {selectedMovieLanguage}</div>
                    <div>Date: {selectedDate}</div>
                    <div>Session: {selectedSession}</div>
                    <IntegerField
                        label="Tickets"
                        helperText="Max 10 tickets"
                        min={1}
                        max={10}
                        value={ticketAmount}
                        stepButtonsVisible
                        onChange={handleTicketAmountChanged}
                    />
                </VerticalLayout>
            </Dialog>
        </>
    );
};