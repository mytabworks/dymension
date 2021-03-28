import React from 'react';
import { Parameters } from "@storybook/react"
import prompt, { Prompt } from '.'
import toaster from '../Toast'
import { Spinner } from 'react-bootstrap';

export default {
    title: 'Prompt',
    component: Prompt,
};

const DateTemplate: Parameters = (args) => {
    
    const handle = (event) => {
        prompt(args)
        .then((value: string) => {
            if(value.length) {
                toaster({
                    delay: 300,
                    placement: 'top',
                    variant: 'info',
                    body: <div><Spinner animation="border" size="sm" /> loading...</div>,
                    onUnmount: () => {
                        toaster({
                            placement: 'top',
                            variant: 'success',
                            body: `success value: ${value}`,
                        })
                    }
                })
            } else {
                toaster({
                    placement: 'top',
                    variant: 'danger',
                    body: "canceled"
                })
            }
        })
    }

    return (
        <button className="btn btn-primary" onClick={handle}>prompt</button>
    )
};

export const DefaultDate = DateTemplate.bind({});

DefaultDate.args = {
    title: "Prompt",
}