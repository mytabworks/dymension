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

		const wrapper = finalNode.appendChild(document.createElement('div'))

		if(typeof manipulateWrapperNode === 'function') {

			manipulateWrapperNode(wrapper, props)

		}

		const promise = new Promise((resolve, reject) => {

			ReactDOM.render(
				<DimensionContext.Provider value={{resolve, reject}}>
					<Component
						{...(props as any)}
					/>
				</DimensionContext.Provider>,
				wrapper
			)
		})

		const close = () => {
			setTimeout(() => {

				ReactDOM.unmountComponentAtNode(wrapper)

				setTimeout(() => {

					if (finalNode.contains(wrapper)) {

						finalNode.removeChild(wrapper)

					}
				})
				
			}, delay)
		}

		return promise.finally(() => {
			close()
		})
	}
}



export default createDimension