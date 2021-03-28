import React, { useEffect } from 'react'
import classNames from 'classnames'
import createDimension, { useDimension } from '../../components/Dymension'
import './index.scss'

interface ConfirmProps {
    key?: string;
    body: React.ReactNode;
    variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
    placement?: 'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    duration?: number;
    delay?: number;
    dismissible?: boolean;
    onMount?: () => void;
    onUnmount?: () => void;
}

export const Toast: React.FunctionComponent<ConfirmProps> = ({ 
    body,
    variant,
    duration,
    dismissible,
    onMount,
    onUnmount
}) => {
    const {
        show,
        resolve,
    } = useDimension()

    useEffect(() => {
        if(duration > 0 && show) {

            const cleanup = setTimeout(() => {

                resolve(true)

            }, duration)

            return () => clearTimeout(cleanup)
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, show])

    useEffect(() => {

        onMount && onMount()

        return () => onUnmount && onUnmount()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classNames('toaster', { 'fade-toast-in': show, 'fade-toast-out': !show }, variant && `toaster-${variant}`)}>
            <div className="toaster-content">
                {body}
                {dismissible && <button className="toaster-content-close" onClick={resolve}>&times;</button>}
            </div>
        </div>
    )
}

Toast.defaultProps = {
    dismissible: false,
    duration: 6000
}

const createNode = (parent = document.body) => {
    return parent.appendChild(document.createElement('div'))
}

const toastContainer = createNode()

const setNodePosition = (position) => {

    const node = createNode(toastContainer)

    node.id = `toast-${position}`

    return node
}

const container = ['top', 'bottom'].reduce((result, primePosition) => {

    if(primePosition === 'top') {

        result[primePosition] = setNodePosition(primePosition)

    }

    return ['left', 'right'].reduce((result, position) => {

        const nodeProsition = `${primePosition}-${position}`

        result[nodeProsition] = setNodePosition(nodeProsition)

        return result

    }, result)

}, {})

export default createDimension(Toast, {
    delay: ({ delay = 600 }) => delay,
    containerNode: ({ placement = 'top-right'}) => container[placement],
    manipulateWrapperNode: (wrapperNode, props) => {

        if(props.key) {
            const existNode = document.getElementById(props.key)

            if(existNode) {

                wrapperNode = existNode

            } else {

                wrapperNode.id = props.key

            }
        }

        wrapperNode.className = 'toaster-wrapper'

        return wrapperNode
    }
})