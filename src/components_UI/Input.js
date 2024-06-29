'use client'
import {useEffect, useRef, useState, useCallback } from 'react'


const Input = ({type, className, placeholder = false, defaultValue = undefined, handleChange = null, list = null, OnKeyUp = null, isReadOnly = false, ...props}) => {
    const [value, setValue] = useState({
        focus: defaultValue !== "",
        value: defaultValue ? String(defaultValue) : ''
    })
    const [password, setPassword] = useState(type === "password" ? false : true)
    const input = useRef(null)

    useEffect(() => {
        const handleWheel = (event) => {
          if (document.activeElement === input.current && event.deltaY !== 0) {
            event.preventDefault()
          }
        };
    
        input.current?.addEventListener("wheel", handleWheel)
    
        return () => {
            input.current?.removeEventListener("wheel", handleWheel)
        }
    }, [])


    useEffect(() => {
        const handleFocusChange = () => {
            if (input.current === document.activeElement) {
                if (!input.current.hasFocus) {
                    setValue({value: value.value , focus: value.value && typeof value.value !== "number" && value.value.trim() === "" ? !value.focus : true})
                    input.current.focus()
                    if(type !== 'number' && type !== 'date' && type !== 'time')
                        input.current.setSelectionRange(0, input.current.value.length)
                }
            } 
        };
        input.current.addEventListener('focus', handleFocusChange)
    
        return () => {
            if(input.current)
                input.current.removeEventListener('focus', handleFocusChange)
        }
    }, [])

    return (
        <>
            {
                placeholder ?
                    <>
                        <div 
                            className={`c-input c-input--placeholder c-input--primary ${value.focus || value.value !== '' ? 'c-input--focused' : ''} u-p2 ${className}`} 
                            onClick={() => {
                                setValue({...value, focus: value.value && typeof value.value !== "number" && value.value.trim() ===""? !value.focus : true})
                                input.current.focus()
                            }}
                        >
                            <span>{placeholder}</span>
                            <input 
                                type={ type !== "password"  ? type : password ? "text" : "password" } 
                                ref={input} 
                                value={ defaultValue !== undefined && defaultValue !== null ? defaultValue : value.value } 
                                className={`${!value.focus ? 'u-hidden' : ''} u-m2--horizontal ${className && className.includes('c-input--secondary') ? 'c-input--secondary' : ''}`} 
                                onKeyUp={(e) => {
                                    if (OnKeyUp)
                                        OnKeyUp(e);
                                }} 
                                onChange={(e) => {
                                    setValue({value: e.target.value, focus:  value.value && typeof value.value !== "number" && value.value.trim() ===""? false : true})
                                    if(handleChange)
                                        handleChange(e.target.value)
                                }}
                                onClick={(e) => {
                                    e.target.showPicker();
                                }}
                                readOnly={isReadOnly}
                                {...props}
                            />
                        </div>
                    </>
                :
                    <>
                        <input 
                            type={ type !== "password"  ? type : password ? "text" : "password" } 
                            ref={input} 
                            value={ defaultValue !== undefined && defaultValue !== null ? defaultValue : value.value } 
                            className={`c-input c-input--primary ${className}`} 
                            onClick={(e) => {
                                e.target.showPicker();
                            }}
                            onChange={(e) => {
                                setValue({value: e.target.value, focus:  value.value && typeof value.value !== "number" && value.value.trim() === "" ? false : true})
                                if(handleChange)
                                    handleChange(e.target.value)
                            }}
                            onKeyUp={(e) => {
                                if (OnKeyUp)
                                    OnKeyUp(e);
                            }}
                            readOnly={isReadOnly}
                        />
                    </>
            }
            {
                type === "password" 
                &&
                <div className="u-flex-center-center u-m3--horizontal u-m1--vertical u-color--white u-cursor--pointer c-input__show_password">
                    <input 
                        type={"checkbox"} 
                        checked={ password } 
                        id='mostrarPassword'
                        onChange={() => {
                            setPassword((prevState) => !prevState)
                        }}
                    />
                    <label className="u-cursor--pointer u-color--black" htmlFor={ 'mostrarPassword' }>Mostrar contraseña</label><br/>
                </div>
            }
        </>
    )
}
export default Input