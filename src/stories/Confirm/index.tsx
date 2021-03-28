import React from 'react'
import { Modal, Button } from "react-bootstrap"
import createDimension, { useDimension } from '../../components/Dymension'

interface ConfirmProps {
    title: React.ReactNode, 
    body: React.ReactNode,
    confirm: React.ReactNode,
    cancel: React.ReactNode
}

export const Confirm: React.FunctionComponent<ConfirmProps> = ({ 
    title, 
    body,
    confirm = "Yes",
    cancel = "No",
}) => {
    const {
        show,
        resolve,
    } = useDimension()

    const handleResolve = () => {
        resolve(true)
    }
    
    const handleReject = () => {
        resolve(false)
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
                {body}
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

export default createDimension(Confirm, {
    delay: 1000
})