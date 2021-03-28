import React from 'react';
import { Parameters } from "@storybook/react"
import confirm, { Confirm } from '.'
import toaster from '../Toast';
import { Spinner } from 'react-bootstrap';

export default {
    title: 'Confirm',
    component: Confirm,
};

const DateTemplate: Parameters = (args) => {
    
    const handle = (event) => {
        confirm(args)
        .then((confirmed) => {
            if(confirmed) {
                toaster({
                    delay: 300,
                    placement: 'top',
                    variant: 'info',
                    body: <div><Spinner animation="border" size="sm" /> deleting...</div>,
                    onUnmount: () => {
                        toaster({
                            placement: 'top',
                            variant: 'success',
                            body: `Successfully deleted`,
                        })
                    }
                })
            } else {
                toaster({
                    placement: 'top',
                    variant: 'danger',
                    body: 'dismissed'
                })
            }
        })
    }

    return (
        <button className="btn btn-danger" onClick={handle}>delete?</button>
    )
};

export const DefaultDate = DateTemplate.bind({});

DefaultDate.args = {
    title: "Delete",
    body: <p>are you sure you wanna delete this?</p>
}