import React, { useState } from 'react'
import { Modal, Button, Form } from "react-bootstrap"
import createDimension, { useDimension } from '../../components'

type StateType = {
    value: string;
    error: null | string;
}

interface PromptProps {
    title: React.ReactNode,
    before: React.ReactNode,
    after: React.ReactNode,
    placeholder?: string;
    confirm?: React.ReactNode,
    cancel?: React.ReactNode,
    requireMessage?: string,
}

export const Prompt: React.FunctionComponent<PromptProps> = ({ 
    title,
    before,
    after,
    placeholder,
    confirm,
    cancel,
    requireMessage
}) => {

    const [{value, error}, setStates] = useState<StateType>({
        value: '',
        error: null
    })

    const {
        show,
        resolve,
        reject
    } = useDimension()

    const handleResolve = () => {
        if(value) {
            resolve(value)
        } else {
            setStates(prev => ({ ...prev, error: requireMessage}))
        }
    }
    
    const handleReject = () => {
        resolve('')
    }

    const handleChange = (e:any) => {
        setStates(prev => ({ ...prev, value: e.target.value}))
    }

    return (
        <Modal
            show={show}
            onHide={handleReject}
            backdrop="static"
            keyboard={false}
            animation
        >
            <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {before}
                <Form.Control value={value} placeholder={placeholder} onChange={handleChange}/>
                <p style={{color: 'crimson', fontSize: '13px', textAlign: 'center'}}>{error}</p>
                {after}
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" onClick={handleResolve}>
                {confirm}
            </Button>
            <Button variant="danger" onClick={handleReject} >
                {cancel}
            </Button>
            </Modal.Footer>
        </Modal>
    )
}

Prompt.defaultProps = {
    confirm: "Yes",
    cancel: "No",
    requireMessage: 'The field is required'
}
export default createDimension<string, typeof Prompt>(Prompt, {
    delay: 1000
})