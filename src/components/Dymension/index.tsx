import React, { createContext, useContext, useState } from 'react'
import ReactDOM from 'react-dom'

interface DimensionValue {
	resolve?: (value?: unknown) => void, 
	reject?: (value?: unknown) => void,
}

const DimensionContext = createContext<DimensionValue>({})

export const useDimension = () => {
	const [show, setShow] = useState<boolean>(true)
	const promise = useContext(DimensionContext)

	const resolve = (value: unknown) => {
		setShow(false)
		promise.resolve!(value)
	}

	const reject = (value: unknown) => {
		setShow(false)
		promise.reject!(value)
	}

	return {
		show,
		resolve,
		reject
	}
}

type Pararam<C> =  C extends React.FunctionComponent<infer P> ? P : never

function createDimension<C extends React.FunctionComponent<any>>(Component: C, {
	delay,
	node = document.body,
	manipulateWrapperNode
}: {
	delay: number;
	node?: Element | ((props: Pararam<C>) => Element);
	manipulateWrapperNode?: (wrapperNode: Element, props: Pararam<C>) => void
}) {
	return (props: Pararam<C>) => {

		const finalNode = typeof node === 'function' ? node(props) : node

		const wrapperNode = finalNode.appendChild(document.createElement('div'))

		if(typeof manipulateWrapperNode === 'function') {

			manipulateWrapperNode(wrapperNode, props)

		}

		const close = () => {
			setTimeout(() => {

				ReactDOM.unmountComponentAtNode(wrapperNode)

				setTimeout(() => {

					if (finalNode.contains(wrapperNode)) {

						finalNode.removeChild(wrapperNode)

					}
				})
				
			}, delay)
		}

		const promisify = new Promise((resolve, reject) => {

			ReactDOM.render(
				<DimensionContext.Provider value={{resolve, reject}}>
					<Component
						{...(props as any)}
					/>
				</DimensionContext.Provider>,
				wrapperNode
			)
		})

		return promisify
		.then((value) => {
			close()
			return value
		})
		.catch((value) => {
			close()
			return Promise.reject(value)
		})
	}
}



export default createDimension